"use client";

import { getAllAppraisalBoards } from "@/service/appraiseService";
import { getAllInstructors } from "@/service/instructorService";
import { getAllPeriods } from "@/service/registrationService";
import {
  assignAppraisalBoard,
  assignReviewInstructor,
  deleteTopicById,
  getTopics,
  getTopicsByPeriod,
  searchTopic,
} from "@/service/topicService";
import { exportTopicList } from "@/utils/export";
import { dateFormat } from "@/utils/format";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  ExportOutlined,
  PaperClipOutlined,
  SyncOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Button,
  Descriptions,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  message,
} from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
const { Search } = Input;
const { Option } = Select;

export default function TopicsManagePage() {
  const [topics, setTopics] = useState();
  const [assignedTopicId, setAssignedTopicId] = useState();
  const [reviewIntructors, setReviewIntructors] = useState();
  const [appraiseStaffs, setAppraiseStaffs] = useState();
  const [listPeriod, setListPeriod] = useState();
  const [selectedPeriod, setSelectedPeriod] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(`Không có`);
  const [selectedStaff, setSelectedStaff] = useState(`Không có`);
  const [activeExpRow, setActiveExpRow] = useState([]);
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const loadTopics = async () => {
    let res = await getTopicsByPeriod(selectedPeriod);
    res = await res.json();
    setTopics(res);
  };

  const loadPeriod = async () => {
    let res = await getAllPeriods();
    res = await res.json();
    setListPeriod(res);
  };

  const loadReviewInstructors = async () => {
    let res = await getAllInstructors();
    res = await res.json();
    setReviewIntructors(res);
  };

  const loadAppraiseStaffs = async () => {
    let res = await getAllAppraisalBoards();
    res = await res.json();
    setAppraiseStaffs(res);
  };

  const deleteTopic = async (id) => {
    const confirmed = await modal.confirm({
      title: "Xóa đề tài",
      content: "Bạn có chắc chắn muốn xóa đề tài này không?",
    });

    if (confirmed) {
      let res = await deleteTopicById(id);
      res = await res.json();

      if (res.status === 200) {
        const { message } = res;
        messageApi.open({
          type: "success",
          content: message,
          duration: 2,
        });
        loadTopics();
      } else {
        const { message } = res;
        messageApi.open({
          type: "error",
          content: message,
          duration: 2,
        });
      }
    }
  };

  const handleSearchTopic = async (searchValue) => {
    var res = await searchTopic(searchValue);
    res = await res.json();
    setTopics(res);
  };

  const handleSearchChange = async (event) => {
    if (event.target.value === "") {
      loadTopics();
    }
  };

  const handleExport = async () => {
    let students = [];
    for (const topic of topics) {
      students.push(topic.owner);
    }
    exportTopicList(topics, students);
  };

  const handlePeriodChange = (value) => {
    setSelectedPeriod(value);
  };

  const showModal = (topic) => {
    if (topic.reviewInstructor) {
      setSelectedInstructor(topic.reviewInstructor._id);
    }

    if (topic.appraiseStaff) {
      setSelectedStaff(topic.appraiseStaff._id);
    }
    setAssignedTopicId(topic._id);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (selectedInstructor) {
      let res = await assignReviewInstructor(
        assignedTopicId,
        selectedInstructor
      );

      if (res.status === 200) {
        res = await res.json();
        const { message } = res;
        messageApi.open({
          type: "success",
          content: message,
          duration: 2,
        });
      } else {
        res = await res.json();
        const { message } = res;
        messageApi.open({
          type: "error",
          content: message,
          duration: 2,
        });
      }
    }

    if (selectedStaff) {
      let res = await assignAppraisalBoard(assignedTopicId, selectedStaff);
      if (res.status === 200) {
        res = await res.json();
        const { message } = res;
        messageApi.open({
          type: "success",
          content: message,
          duration: 2,
        });
      } else {
        res = await res.json();
        const { message } = res;
        messageApi.open({
          type: "error",
          content: message,
          duration: 2,
        });
      }
    }
    // console.log("Topic:", assignedTopicId);
    // console.log("Instructor:", selectedInstructor);
    // console.log("Staff:", selectedStaff);
    setAssignedTopicId(null);
    setSelectedInstructor(`Không có`);
    setSelectedStaff(`Không có`);
    loadTopics();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    loadPeriod();
    loadAppraiseStaffs();
    loadReviewInstructors();
  }, []);

  useEffect(() => {
    if (!selectedPeriod) return;

    loadTopics();
  }, [selectedPeriod]);

  const columns = [
    {
      title: "Tên tiếng Việt",
      dataIndex: "vietnameseName",
      key: "vietnameseName",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Tên tiếng Anh",
      dataIndex: "englishName",
      key: "englishName",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, { createdAt }) => {
        return <p>{dateFormat(new Date(createdAt))}</p>;
      },
    },
    {
      title: "Trạng thái kiểm duyệt",
      dataIndex: "reviews",
      key: "reviews",
      render: (_, { reviews }) => {
        let color, icon, text;
        const isReviewed = reviews.length > 0;
        switch (isReviewed) {
          case true:
            color = "success";
            text = "Đã kiểm duyệt";
            icon = <CheckCircleOutlined />;
            break;
          case false:
            color = "default";
            text = "Chưa kiểm duyệt";
            icon = <SyncOutlined spin />;
          default:
            break;
        }
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
      filters: [
        {
          text: "Đã kiểm duyệt",
          value: true,
        },
        {
          text: "Chưa kiểm duyệt",
          value: false,
        },
      ],
      onFilter: (value, record) => record.isReviewed === value,
    },
    {
      title: "Trạng thái thẩm định",
      dataIndex: "appraises",
      key: "appraises",
      render: (_, { appraises }) => {
        let color, icon, text;
        const isAppraised = appraises.length > 0;
        switch (isAppraised) {
          case true:
            color = "success";
            text = "Đã thẩm định";
            icon = <CheckCircleOutlined />;
            break;
          case false:
            color = "default";
            text = "Chưa thẩm định";
            icon = <SyncOutlined spin />;
          default:
            break;
        }
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
      filters: [
        {
          text: "Đã thẩm định",
          value: true,
        },
        {
          text: "Chưa thẩm định",
          value: false,
        },
      ],
      onFilter: (value, record) => record.isAppraised === value,
    },
    {
      title: "Hành động",
      key: "action",
      width: "10%",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button
              onClick={() => showModal(record)}
              icon={<UserAddOutlined />}
            />

            <Button
              onClick={() => deleteTopic(record._id)}
              danger
              icon={<DeleteOutlined />}
            />
          </Space>
        );
      },
    },
  ];

  return (
    <div className="bg-gray-100 min-h-[100vh]">
      <div className="flex flex-col py-6 mx-32">
        <div className="flex justify-between">
          <div className="space-x-4">
            {listPeriod && (
              <Select
                className="w-64"
                placeholder="Chọn đợt đăng ký..."
                onChange={handlePeriodChange}
                value={selectedPeriod}
              >
                {listPeriod.map((period, index) => (
                  <Option
                    key={`registration-period-${index}`}
                    value={period._id}
                  >
                    {period.title}
                  </Option>
                ))}
              </Select>
            )}

            <Search
              className="w-[450px] mb-4"
              placeholder="Tìm kiếm đề tài..."
              enterButton
              onSearch={handleSearchTopic}
              onChange={handleSearchChange}
            />
          </div>

          <Button
            loading={!topics}
            onClick={handleExport}
            icon={<ExportOutlined />}
            type="primary"
          >
            Xuất danh sách
          </Button>
        </div>

        <Spin spinning={!topics}>
          <Table
            rowKey={(record) => record._id}
            tableLayout="fixed"
            columns={columns}
            dataSource={topics}
            pagination={{ pageSize: 8 }}
            expandable={{
              expandedRowRender: (record) => {
                if (record._id === activeExpRow[0]) {
                  const instructorItems = [
                    {
                      label: "Tên",
                      key: "name",
                      children: <p>{record.instructor.accountId.name}</p>,
                    },
                    {
                      label: "Email",
                      key: "email",
                      children: (
                        <Link
                          target="_blank"
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${record.instructor.email}`}
                        >
                          <ExportOutlined className="mr-1" />
                          {record.instructor.accountId.email}
                        </Link>
                      ),
                    },
                    {
                      label: "Học hàm, học vị",
                      key: "academicRank",
                      children: <p>{record.instructor.academicRank}</p>,
                    },
                    {
                      label: "Khoa",
                      key: "faculty",
                      children: <p>{record.instructor.faculty}</p>,
                    },
                  ];

                  const topicDataItems = [
                    {
                      label: "Loại hình nghiên cứu",
                      key: "type",
                      children: <p>{record.type}</p>,
                    },
                    {
                      label: "Thành viên",
                      key: "participants",
                      children: (
                        <p>
                          {record.participants.map((participant, index) => (
                            <span key={`participant-${index}`}>
                              {index + 1}. {participant}
                              <br />
                            </span>
                          ))}
                        </p>
                      ),
                    },
                    {
                      label: "Số lượng kiểm duyệt",
                      key: "reviews",
                      children: <p>{record.reviews.length}</p>,
                    },
                    {
                      label: "Số lượng thẩm định",
                      key: "appraise",
                      children: <p>{record.appraises.length}</p>,
                    },
                  ];

                  const reviewInstructorItems = [
                    {
                      label: "Tên",
                      key: "name",
                      children: (
                        <p>
                          {record.reviewInstructor &&
                            record.reviewInstructor.accountId.name}
                          {!record.reviewInstructor && "Chưa có"}
                        </p>
                      ),
                    },
                    {
                      label: "Email",
                      key: "email",
                      children: (
                        <p>
                          {record.reviewInstructor &&
                            record.reviewInstructor.accountId.email}
                          {!record.reviewInstructor && "Chưa có"}
                        </p>
                      ),
                    },
                    {
                      label: "Học hàm, học vị",
                      key: "academicRank",
                      children: (
                        <p>
                          {record.reviewInstructor &&
                            record.reviewInstructor.academicRank}
                          {!record.reviewInstructor && "Chưa có"}
                        </p>
                      ),
                    },
                    {
                      label: "Khoa",
                      key: "faculty",
                      children: (
                        <p>
                          {record.reviewInstructor &&
                            record.reviewInstructor.faculty}
                          {!record.reviewInstructor && "Chưa có"}
                        </p>
                      ),
                    },
                  ];

                  const appraiseStaffItems = [
                    {
                      label: "Tên",
                      key: "name",
                      children: (
                        <p>
                          {record.appraiseStaff &&
                            record.appraiseStaff.accountId.name}
                          {!record.appraiseStaff && "Chưa có"}
                        </p>
                      ),
                    },
                    {
                      label: "Email",
                      key: "email",
                      children: (
                        <p>
                          {record.appraiseStaff &&
                            record.appraiseStaff.accountId.email}
                          {!record.appraiseStaff && "Chưa có"}
                        </p>
                      ),
                    },
                  ];

                  return (
                    <div className="space-y-4">
                      <Descriptions
                        title="Thông tin Giảng viên Hướng dẫn"
                        items={instructorItems}
                      />
                      <Descriptions
                        title="Thông tin Đề tài"
                        items={topicDataItems}
                        column={2}
                      />
                      <Descriptions
                        title="Thông tin Giảng viên kiểm duyệt"
                        items={reviewInstructorItems}
                      />
                      <Descriptions
                        title="Thông tin cán bộ thẩm định"
                        items={appraiseStaffItems}
                      />
                    </div>
                  );
                }
              },
              expandedRowKeys: activeExpRow,
              onExpand: (expanded, record) => {
                let keys = [];
                if (expanded) {
                  keys.push(record._id);
                }
                setActiveExpRow(keys);
              },
            }}
          />
        </Spin>
      </div>

      <Modal
        title="Phân công Công việc"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xác nhận"
        cancelText="Hủy bỏ"
        className="p-4"
      >
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Giảng viên kiểm duyệt
            </label>
            <Select
              placeholder="Select an instructor"
              className="w-full"
              value={selectedInstructor}
              onChange={(value) => setSelectedInstructor(value)}
            >
              <Option value={`Không có`}>Không có</Option>
              {reviewIntructors?.map((instructor, index) => (
                <Option
                  key={`review-instructor-${index}`}
                  value={instructor._id}
                >
                  {instructor.account.name}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Cán bộ thẩm định
            </label>
            <Select
              placeholder="Select a staff member"
              className="w-full"
              value={selectedStaff}
              onChange={(value) => setSelectedStaff(value)}
            >
              <Option value={`Không có`}>Không có</Option>
              {appraiseStaffs?.map((appraisalStaff, index) => (
                <Option
                  key={`appraisal-staff-${index}`}
                  value={appraisalStaff._id}
                >
                  {appraisalStaff.account.name}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </Modal>
      {messageContextHolder}
      {modalContextHolder}
    </div>
  );
}
