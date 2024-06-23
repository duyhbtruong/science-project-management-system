"use client";

import { deleteReviewByTopicId } from "@/service/reviewService";
import { getTopics, searchTopic } from "@/service/topicService";
import { dateFormat } from "@/utils/format";
import {
  CheckOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  HighlightOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Input, Button, Space, Spin, Table, Tag, Modal, message } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const { Search } = Input;

export default function ReviewPage() {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const [topics, setTopics] = useState();
  const router = useRouter();
  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();

  const config = {
    title: "Hủy kết quả kiểm duyệt?",
    content: <p>Bạn có muốn hủy kết quả kiểm duyệt của đề tài này không?</p>,
  };

  const loadTopics = async () => {
    setTopics(await getTopics());
  };

  const deleteReview = async (topicId, technologyScienceId) => {
    const res = await deleteReviewByTopicId(topicId, technologyScienceId);
    const { message } = res;
    if (message === "Chưa kiểm duyệt đề tài này!") {
      messageApi.open({
        type: "error",
        content: message,
      });
    } else {
      messageApi.open({
        type: "success",
        content: message,
      });
      loadTopics();
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

  useEffect(() => {
    loadTopics();
  }, []);

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
        return (
          <Tag
            color={record.isReviewed ? "success" : "default"}
            icon={record.isReviewed ? <CheckOutlined /> : <SyncOutlined spin />}
          >
            {record.isReviewed ? "Đã kiểm duyệt" : "Chưa kiểm duyệt"}
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
              onClick={() =>
                router.push(`/technologyScience/review/${record._id}`)
              }
              icon={<HighlightOutlined />}
            />
            <Button
              onClick={async () => {
                const confirmed = await modal.confirm(config);
                if (confirmed) {
                  deleteReview(record._id, userId);
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
    <div className="bg-gray-100 min-h-[calc(100vh-45.8px)]">
      <div className="flex flex-col mx-32 py-6">
        <Search
          className="w-[450px] mb-4"
          placeholder="Tìm kiếm đề tài..."
          enterButton
          onSearch={handleSearchTopic}
          onChange={handleSearchChange}
        />
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
