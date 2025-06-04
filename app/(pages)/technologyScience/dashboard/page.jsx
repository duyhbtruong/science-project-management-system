"use client";

import { getAllPeriods } from "@/service/registrationService";
import { getTopicsByPeriod } from "@/service/topicService";
import { getAllInstructors } from "@/service/instructorService";
import { Card, Row, Col, Statistic } from "antd";
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
  const [chartsData, setChartsData] = useState();
  const [numberOfTopics, setNumberOfTopics] = useState(0);
  const [numberOfPeriods, setNumberOfPeriods] = useState(0);
  const [instructorStats, setInstructorStats] = useState([]);
  const [facultyDistribution, setFacultyDistribution] = useState([]);
  const [reviewStats, setReviewStats] = useState({ passed: 0, failed: 0 });
  const [participantStats, setParticipantStats] = useState({
    total: 0,
    average: 0,
  });

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  const loadPeriod = async () => {
    let res = await getAllPeriods();
    res = await res.json();
    setListPeriod(res);
  };

  const loadTopicsInEachPeriod = async () => {
    const data = [];
    let sum = 0;
    let passedCount = 0;
    let totalParticipants = 0;
    let instructorTopicCount = {};
    let facultyCount = {};

    for (let i = 0; i < listPeriod.length; i++) {
      let periodData = await getTopicsByPeriod(listPeriod[i]._id);
      periodData = await periodData.json();

      // Count topics per period
      data.push({ period: listPeriod[i].title, topics: periodData.length });
      sum += periodData.length;

      // Process each topic
      periodData.forEach((topic) => {
        // Count review status
        if (topic.reviewPassed) passedCount++;

        // Count participants
        totalParticipants += topic.participants.length + 1; // +1 for owner

        // Count instructor topics
        const instructorId = topic.instructor._id;
        instructorTopicCount[instructorId] =
          (instructorTopicCount[instructorId] || 0) + 1;

        // Count faculty distribution
        const faculty = topic.owner.faculty;
        facultyCount[faculty] = (facultyCount[faculty] || 0) + 1;
      });
    }

    // Process instructor statistics
    const instructorData = Object.entries(instructorTopicCount)
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Process faculty distribution
    const facultyData = Object.entries(facultyCount).map(([name, count]) => ({
      name,
      value: count,
    }));

    setChartsData(data);
    setNumberOfTopics(sum);
    setNumberOfPeriods(listPeriod.length);
    setInstructorStats(instructorData);
    setFacultyDistribution(facultyData);
    setReviewStats({
      passed: passedCount,
      failed: sum - passedCount,
    });
    setParticipantStats({
      total: totalParticipants,
      average: sum > 0 ? (totalParticipants / sum).toFixed(1) : 0,
    });
  };

  useEffect(() => {
    loadPeriod();
  }, []);

  useEffect(() => {
    if (!listPeriod) return;
    loadTopicsInEachPeriod();
  }, [listPeriod]);

  // Mock data
  //   const numberOfTopics = 120;
  //   const numberOfPeriods = 5;
  //   const chartData = [
  //     { period: "Period 1", topics: 20 },
  //     { period: "Period 2", topics: 25 },
  //     { period: "Period 3", topics: 30 },
  //     { period: "Period 4", topics: 15 },
  //     { period: "Period 5", topics: 30 },
  //   ];

  //   console.log(">>> listPeriod: ", listPeriod);
  //   console.log(">>> chartsData: ", chartsData);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>

      <Row gutter={[16, 16]} className="mb-6">
        <Col span={6}>
          <Card className="shadow-lg">
            <Statistic title="Total Topics" value={numberOfTopics} />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="shadow-lg">
            <Statistic title="Registration Periods" value={numberOfPeriods} />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="shadow-lg">
            <Statistic
              title="Total Participants"
              value={participantStats.total}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="shadow-lg">
            <Statistic
              title="Avg Participants/Topic"
              value={participantStats.average}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={16}>
          <Card className="shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">
              Topics per Registration Period
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={chartsData}
                margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="topics"
                  stroke="#4CAF50"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Review Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Passed", value: reviewStats.passed },
                    { name: "Failed", value: reviewStats.failed },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
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
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card className="shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">
              Top Instructors by Topics
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={instructorStats}
                margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card className="shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Topics by Faculty</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={facultyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {facultyDistribution.map((entry, index) => (
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
      </Row>
    </div>
  );
}
