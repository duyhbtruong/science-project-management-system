"use client";

import { getAccountById } from "@/service/accountService";
import { getAllPeriods } from "@/service/registrationService";
import { deleteReviewById } from "@/service/reviewService";
import {
  getTopics,
  getTopicsByPeriod,
  getTopicsByReviewInstructorId,
  searchTopic,
} from "@/service/topicService";
import { dateFormat } from "@/utils/format";
import {
  CheckOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  HighlightOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Input,
  Button,
  Space,
  Spin,
  Table,
  Tag,
  Modal,
  message,
  Select,
} from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const { Search } = Input;
const { Option } = Select;

export default function ReviewPage() {
  const router = useRouter();
  const session = useSession();
  const userId = session?.data?.user?.id;
  const [account, setAccount] = useState();
  const [instructor, setInstructor] = useState();
  const [topics, setTopics] = useState();
  const [listPeriod, setListPeriod] = useState();
  const [selectedPeriod, setSelectedPeriod] = useState();
  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();

  const config = {
    title: "Hủy kết quả kiểm duyệt?",
    content: <p>Bạn có muốn hủy kết quả kiểm duyệt của đề tài này không?</p>,
  };

  const loadAccount = async () => {
    let res = await getAccountById(userId);
    res = await res.json();
    setInstructor(res.instructor);
    setAccount(res.account);
  };

  const loadTopics = async () => {
    let res = await getTopicsByReviewInstructorId(
      selectedPeriod,
      instructor._id
    );
    res = await res.json();
    setTopics(res);
  };

  const loadPeriod = async () => {
    let res = await getAllPeriods();
    res = await res.json();
    setListPeriod(res);
  };

  const deleteReview = async (reviewId) => {
    let res = await deleteReviewById(reviewId);
    if (res.status === 200) {
      res = await res.json();
      const { message } = res;
      messageApi.open({
        type: "success",
        content: message,
        duration: 2,
      });
      loadTopics();
    } else {
      res = await res.json();
      const { message } = res;
      messageApi.open({
        type: "error",
        content: message,
        duration: 2,
      });
    }
  };

  const handleSearchChange = (event) => {
    if (event.target.value) {
      loadTopics();
    }
  };

  const handleSearchTopic = async (searchValue) => {
    const res = await searchTopic(searchValue);
    setTopics(res);
  };

  const handlePeriodChange = (value) => {
    setSelectedPeriod(value);
  };

  useEffect(() => {
    loadPeriod();
  }, []);

  useEffect(() => {
    if (!userId) return;

    loadAccount();
  }, [userId]);

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
      render: (_, record) => {
        const createdAt = new Date(record.createdAt);
        return <p>{dateFormat(createdAt)}</p>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "isReviewed",
      key: "isReviewed",
      render: (_, record) => {
        const isReviewed = record.reviews.length > 0;
        return (
          <Tag
            color={isReviewed ? "success" : "default"}
            icon={isReviewed ? <CheckOutlined /> : <SyncOutlined spin />}
          >
            {isReviewed ? "Đã kiểm duyệt" : "Chưa kiểm duyệt"}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: "10%",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button
              onClick={() => router.push(`/instructor/review/${record._id}`)}
              icon={<HighlightOutlined />}
            />
            <Button
              disabled={record.reviews.length === 0}
              onClick={async () => {
                const confirmed = await modal.confirm(config);
                if (confirmed) {
                  deleteReview(record.reviews[0]);
                }
              }}
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
        <div className="mb-4 space-x-4">
          {listPeriod && (
            <Select
              className="w-64"
              placeholder="Chọn đợt đăng ký..."
              onChange={handlePeriodChange}
              value={selectedPeriod}
            >
              {listPeriod.map((period, index) => (
                <Option key={`registration-period-${index}`} value={period._id}>
                  {period.title}
                </Option>
              ))}
            </Select>
          )}

          {/* {selectedPeriod && (
            <Search
              className="w-[450px] "
              placeholder="Tìm kiếm đề tài..."
              enterButton
              onSearch={handleSearchTopic}
              onChange={handleSearchChange}
            />
          )} */}
        </div>
        <Spin spinning={!topics}>
          <Table
            rowKey={(record) => record._id}
            tableLayout="fixed"
            columns={columns}
            dataSource={topics}
            pagination={{ pageSize: 8 }}
          />
        </Spin>
      </div>
      {modalContextHolder}
      {messageContextHolder}
    </div>
  );
}
