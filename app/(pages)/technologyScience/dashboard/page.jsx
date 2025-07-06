"use client";

import { getAllPeriods } from "@/service/registrationService";
import { getTopicsByPeriod } from "@/service/topicService";
import { getAllInstructors } from "@/service/instructorService";
import { Card, Row, Col, Statistic, Tabs, Select, Space } from "antd";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard() {
  const [listPeriod, setListPeriod] = useState();
  const [periodStats, setPeriodStats] = useState([]);
  const [selectedPeriods, setSelectedPeriods] = useState([]);
  const [overallStats, setOverallStats] = useState({
    totalTopics: 0,
    totalParticipants: 0,
  });
  const [facultyStats, setFacultyStats] = useState([]);
  const [yearStats, setYearStats] = useState([]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // Helper function to extract year from period title
  const extractYearFromTitle = (title) => {
    if (!title) return title;

    // Try to extract year from period title with multiple patterns
    let yearMatch = title.match(/(\d{4})/);
    if (yearMatch) {
      let year = yearMatch[1];

      // If it's a range like "2023-2024", use the first year
      const rangeMatch = title.match(/(\d{4})-(\d{4})/);
      if (rangeMatch) {
        year = rangeMatch[1]; // Use the first year of the range
      }

      // For new format "Đợt X-YYYY", extract the year part
      const newFormatMatch = title.match(/Đợt\s+\d+-\d{4}/);
      if (newFormatMatch) {
        const yearFromNewFormat = title.match(/-(\d{4})/);
        if (yearFromNewFormat) {
          year = yearFromNewFormat[1];
        }
      }

      return year;
    }

    return title; // Return original title if no year found
  };

  const loadPeriod = async () => {
    let res = await getAllPeriods();
    res = await res.json();
    setListPeriod(res);
  };

  const loadTopicsInEachPeriod = async () => {
    const periodData = [];
    let totalTopics = 0;
    let totalParticipants = 0;

    if (selectedPeriods.length === 0) {
      setPeriodStats([]);
      setOverallStats({
        totalTopics: 0,
        totalParticipants: 0,
      });
      return;
    }

    const periodsToLoad = listPeriod.filter((period) =>
      selectedPeriods.includes(period._id)
    );

    for (let i = 0; i < periodsToLoad.length; i++) {
      let periodTopics = await getTopicsByPeriod(periodsToLoad[i]._id);
      periodTopics = await periodTopics.json();

      const periodStat = {
        periodId: periodsToLoad[i]._id,
        periodName: periodsToLoad[i].title,
        totalTopics: periodTopics.length,
        topicsByFaculty: {},
        instructorStats: {},
        reviewStats: { passed: 0, failed: 0 },
        totalParticipants: 0,
      };

      periodTopics.forEach((topic) => {
        if (topic.reviewPassed) {
          periodStat.reviewStats.passed++;
        } else {
          periodStat.reviewStats.failed++;
        }

        const participants = topic.participants.length + 1;
        periodStat.totalParticipants += participants;
        totalParticipants += participants;

        const instructorId = topic.instructor._id;
        const instructorName = topic.instructor.accountId.name || instructorId;
        if (!periodStat.instructorStats[instructorId]) {
          periodStat.instructorStats[instructorId] = {
            id: instructorId,
            name: instructorName,
            count: 0,
          };
        }
        periodStat.instructorStats[instructorId].count++;

        const faculty = topic.owner.faculty;
        periodStat.topicsByFaculty[faculty] =
          (periodStat.topicsByFaculty[faculty] || 0) + 1;
      });

      periodStat.instructorStats = Object.values(periodStat.instructorStats)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      periodStat.topicsByFaculty = Object.entries(
        periodStat.topicsByFaculty
      ).map(([name, count]) => ({ name, value: count }));

      periodData.push(periodStat);
      totalTopics += periodTopics.length;
    }

    setPeriodStats(periodData);
    setOverallStats({
      totalTopics,
      totalParticipants,
    });
  };

  const loadFacultyStatistics = async () => {
    if (!listPeriod || listPeriod.length === 0) return;

    const facultyData = {};
    let totalTopics = 0;
    let totalParticipants = 0;

    // Load all topics from all periods
    for (let i = 0; i < listPeriod.length; i++) {
      let periodTopics = await getTopicsByPeriod(listPeriod[i]._id);
      periodTopics = await periodTopics.json();

      periodTopics.forEach((topic) => {
        const faculty = topic.owner.faculty;

        if (!facultyData[faculty]) {
          facultyData[faculty] = {
            facultyName: faculty,
            totalTopics: 0,
            totalParticipants: 0,
            reviewStats: { passed: 0, failed: 0 },
            instructorStats: {},
            periodStats: {},
          };
        }

        // Count topics
        facultyData[faculty].totalTopics++;
        totalTopics++;

        // Count participants
        const participants = topic.participants.length + 1;
        facultyData[faculty].totalParticipants += participants;
        totalParticipants += participants;

        // Count review status
        if (topic.reviewPassed) {
          facultyData[faculty].reviewStats.passed++;
        } else {
          facultyData[faculty].reviewStats.failed++;
        }

        // Count instructors
        const instructorId = topic.instructor._id;
        const instructorName = topic.instructor.accountId.name || instructorId;
        if (!facultyData[faculty].instructorStats[instructorId]) {
          facultyData[faculty].instructorStats[instructorId] = {
            id: instructorId,
            name: instructorName,
            count: 0,
          };
        }
        facultyData[faculty].instructorStats[instructorId].count++;

        // Count by period
        const periodName = listPeriod[i].title;
        if (!facultyData[faculty].periodStats[periodName]) {
          facultyData[faculty].periodStats[periodName] = 0;
        }
        facultyData[faculty].periodStats[periodName]++;
      });
    }

    // Process faculty data
    const processedFacultyData = Object.values(facultyData).map((faculty) => ({
      ...faculty,
      instructorStats: Object.values(faculty.instructorStats)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      periodStats: Object.entries(faculty.periodStats)
        .map(([period, count]) => ({ period, count }))
        .sort((a, b) => b.count - a.count),
    }));

    setFacultyStats(processedFacultyData);
  };

  const loadYearStatistics = async () => {
    if (!listPeriod || listPeriod.length === 0) return;

    const yearData = {};
    let totalTopics = 0;
    let totalParticipants = 0;

    // Load all topics from all periods
    for (let i = 0; i < listPeriod.length; i++) {
      let periodTopics = await getTopicsByPeriod(listPeriod[i]._id);
      periodTopics = await periodTopics.json();

      // Extract year from period title using helper function
      const periodTitle = listPeriod[i].title;
      const year = extractYearFromTitle(periodTitle);

      if (!yearData[year]) {
        yearData[year] = {
          yearName: year,
          totalTopics: 0,
          totalParticipants: 0,
          reviewStats: { passed: 0, failed: 0 },
          facultyStats: {},
          instructorStats: {},
          periodStats: {},
        };
      }

      periodTopics.forEach((topic) => {
        // Count topics
        yearData[year].totalTopics++;
        totalTopics++;

        // Count participants
        const participants = topic.participants.length + 1;
        yearData[year].totalParticipants += participants;
        totalParticipants += participants;

        // Count review status
        if (topic.reviewPassed) {
          yearData[year].reviewStats.passed++;
        } else {
          yearData[year].reviewStats.failed++;
        }

        // Count by faculty
        const faculty = topic.owner.faculty;
        if (!yearData[year].facultyStats[faculty]) {
          yearData[year].facultyStats[faculty] = 0;
        }
        yearData[year].facultyStats[faculty]++;

        // Count instructors
        const instructorId = topic.instructor._id;
        const instructorName = topic.instructor.accountId.name || instructorId;
        if (!yearData[year].instructorStats[instructorId]) {
          yearData[year].instructorStats[instructorId] = {
            id: instructorId,
            name: instructorName,
            count: 0,
          };
        }
        yearData[year].instructorStats[instructorId].count++;

        // Count by period
        const periodName = listPeriod[i].title;
        if (!yearData[year].periodStats[periodName]) {
          yearData[year].periodStats[periodName] = 0;
        }
        yearData[year].periodStats[periodName]++;
      });
    }

    // Process year data
    const processedYearData = Object.values(yearData)
      .map((year) => ({
        ...year,
        facultyStats: Object.entries(year.facultyStats)
          .map(([faculty, count]) => ({ faculty, count }))
          .sort((a, b) => b.count - a.count),
        instructorStats: Object.values(year.instructorStats)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
        periodStats: Object.entries(year.periodStats)
          .map(([period, count]) => ({ period, count }))
          .sort((a, b) => b.count - a.count),
      }))
      .sort((a, b) => b.yearName - a.yearName); // Sort by year descending

    setYearStats(processedYearData);
  };

  useEffect(() => {
    loadPeriod();
  }, []);

  useEffect(() => {
    if (!listPeriod) return;
    loadTopicsInEachPeriod();
  }, [listPeriod, selectedPeriods]);

  useEffect(() => {
    if (!listPeriod) return;
    loadFacultyStatistics();
  }, [listPeriod]);

  useEffect(() => {
    if (!listPeriod) return;
    loadYearStatistics();
  }, [listPeriod]);

  const renderPeriodStatistics = () => (
    <div>
      <Card className="mb-6 shadow-lg">
        <Space direction="vertical" style={{ width: "100%" }}>
          <h3 className="mb-2 text-lg font-semibold">Chọn đợt đăng ký</h3>
          <Select
            mode="multiple"
            placeholder="Chọn đợt đăng ký để xem thống kê"
            value={selectedPeriods}
            onChange={setSelectedPeriods}
            style={{ width: "100%" }}
            options={
              listPeriod?.map((period) => ({
                label: period.title,
                value: period._id,
              })) || []
            }
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Space>
      </Card>

      {periodStats.map((period, index) => (
        <Card key={period.periodId} className="mb-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-blue-600">
            {period.periodName}
          </h2>

          <Row gutter={[16, 16]} className="mb-6">
            <Col span={6}>
              <Statistic title="Số đề tài" value={period.totalTopics} />
            </Col>
            <Col span={6}>
              <Statistic
                title="Số người tham gia"
                value={period.totalParticipants}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Tỷ lệ đạt"
                value={
                  period.totalTopics > 0
                    ? (
                        (period.reviewStats.passed / period.totalTopics) *
                        100
                      ).toFixed(1)
                    : 0
                }
                suffix="%"
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Tỷ lệ không đạt"
                value={
                  period.totalTopics > 0
                    ? (
                        (period.reviewStats.failed / period.totalTopics) *
                        100
                      ).toFixed(1)
                    : 0
                }
                suffix="%"
              />
            </Col>
          </Row>

          {period.totalTopics > 0 ? (
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card className="shadow-sm">
                  <h3 className="mb-3 text-lg font-medium">
                    Trạng thái đánh giá
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Đạt", value: period.reviewStats.passed },
                          {
                            name: "Không đạt",
                            value: period.reviewStats.failed,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[0, 1].map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              <Col span={8}>
                <Card className="shadow-sm">
                  <h3 className="mb-3 text-lg font-medium">Đề tài theo khoa</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={period.topicsByFaculty}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {period.topicsByFaculty.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              <Col span={8}>
                <Card className="shadow-sm">
                  <h3 className="mb-3 text-lg font-medium">
                    Giảng viên hướng dẫn hàng đầu
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={period.instructorStats}
                      margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          ) : (
            <Card className="shadow-sm">
              <div className="py-8 text-center text-gray-500">
                <p className="text-lg">
                  Chưa có đề tài nào được đăng ký trong đợt này
                </p>
                <p className="mt-2 text-sm">
                  Biểu đồ sẽ hiển thị khi có dữ liệu
                </p>
              </div>
            </Card>
          )}
        </Card>
      ))}
    </div>
  );

  const renderFacultyStatistics = () => (
    <div>
      {facultyStats.map((faculty, index) => (
        <Card key={faculty.facultyName} className="mb-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-green-600">
            {faculty.facultyName}
          </h2>

          {/* Faculty Summary */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col span={6}>
              <Statistic title="Tổng số đề tài" value={faculty.totalTopics} />
            </Col>
            <Col span={6}>
              <Statistic
                title="Tổng số người tham gia"
                value={faculty.totalParticipants}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Tỷ lệ đạt"
                value={
                  faculty.totalTopics > 0
                    ? (
                        (faculty.reviewStats.passed / faculty.totalTopics) *
                        100
                      ).toFixed(1)
                    : 0
                }
                suffix="%"
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Tỷ lệ không đạt"
                value={
                  faculty.totalTopics > 0
                    ? (
                        (faculty.reviewStats.failed / faculty.totalTopics) *
                        100
                      ).toFixed(1)
                    : 0
                }
                suffix="%"
              />
            </Col>
          </Row>

          {/* Charts for this faculty */}
          {faculty.totalTopics > 0 ? (
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card className="shadow-sm">
                  <h3 className="mb-3 text-lg font-medium">
                    Trạng thái đánh giá
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Đạt", value: faculty.reviewStats.passed },
                          {
                            name: "Không đạt",
                            value: faculty.reviewStats.failed,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[0, 1].map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              <Col span={8}>
                <Card className="shadow-sm">
                  <h3 className="mb-3 text-lg font-medium">
                    Đề tài theo đợt đăng ký
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={faculty.periodStats}
                      margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="period"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>

              <Col span={8}>
                <Card className="shadow-sm">
                  <h3 className="mb-3 text-lg font-medium">
                    Giảng viên hướng dẫn hàng đầu
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={faculty.instructorStats}
                      margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#FFBB28" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          ) : (
            <Card className="shadow-sm">
              <div className="py-8 text-center text-gray-500">
                <p className="text-lg">
                  Chưa có đề tài nào được đăng ký trong khoa này
                </p>
                <p className="mt-2 text-sm">
                  Biểu đồ sẽ hiển thị khi có dữ liệu
                </p>
              </div>
            </Card>
          )}
        </Card>
      ))}
    </div>
  );

  const renderYearStatistics = () => (
    <div>
      {yearStats.map((year, index) => (
        <Card key={year.yearName} className="mb-6 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-purple-600">
            Năm học {year.yearName}
          </h2>

          {/* Year Summary */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col span={6}>
              <Statistic title="Tổng số đề tài" value={year.totalTopics} />
            </Col>
            <Col span={6}>
              <Statistic
                title="Tổng số người tham gia"
                value={year.totalParticipants}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Tỷ lệ đạt"
                value={
                  year.totalTopics > 0
                    ? (
                        (year.reviewStats.passed / year.totalTopics) *
                        100
                      ).toFixed(1)
                    : 0
                }
                suffix="%"
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Tỷ lệ không đạt"
                value={
                  year.totalTopics > 0
                    ? (
                        (year.reviewStats.failed / year.totalTopics) *
                        100
                      ).toFixed(1)
                    : 0
                }
                suffix="%"
              />
            </Col>
          </Row>

          {/* Charts for this year */}
          {year.totalTopics > 0 ? (
            <>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card className="shadow-sm">
                    <h3 className="mb-3 text-lg font-medium">
                      Trạng thái đánh giá
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Đạt", value: year.reviewStats.passed },
                            {
                              name: "Không đạt",
                              value: year.reviewStats.failed,
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[0, 1].map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>

                <Col span={8}>
                  <Card className="shadow-sm">
                    <h3 className="mb-3 text-lg font-medium">
                      Đề tài theo khoa
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart
                        data={year.facultyStats}
                        margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="faculty"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#FF8042" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>

                <Col span={8}>
                  <Card className="shadow-sm">
                    <h3 className="mb-3 text-lg font-medium">
                      Đề tài theo đợt đăng ký
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart
                        data={year.periodStats}
                        margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="period"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>

              {/* Top Instructors for this year */}
              <Row gutter={[16, 16]} className="mt-6">
                <Col span={24}>
                  <Card className="shadow-sm">
                    <h3 className="mb-3 text-lg font-medium">
                      Giảng viên hướng dẫn hàng đầu trong năm
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={year.instructorStats}
                        margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={100}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#00C49F" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>
            </>
          ) : (
            <Card className="shadow-sm">
              <div className="py-8 text-center text-gray-500">
                <p className="text-lg">
                  Chưa có đề tài nào được đăng ký trong năm này
                </p>
                <p className="mt-2 text-sm">
                  Biểu đồ sẽ hiển thị khi có dữ liệu
                </p>
              </div>
            </Card>
          )}
        </Card>
      ))}
    </div>
  );

  const items = [
    {
      key: "1",
      label: "Thống kê theo đợt đăng ký",
      children: renderPeriodStatistics(),
    },
    {
      key: "2",
      label: "Thống kê theo khoa",
      children: renderFacultyStatistics(),
    },
    {
      key: "3",
      label: "Thống kê theo năm",
      children: renderYearStatistics(),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>

      <Tabs
        defaultActiveKey="1"
        items={items}
        size="large"
        className="dashboard-tabs"
      />
    </div>
  );
}
