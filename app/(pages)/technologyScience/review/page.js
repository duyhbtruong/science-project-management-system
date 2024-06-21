"use client";

import { getTopics } from "@/service/topicService";
import { dateFormat } from "@/utils/format";
import {
  CheckOutlined,
  DeleteOutlined,
  HighlightOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Input, Button, Space, Spin, Table, Tag } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const { Search } = Input;

export default function ReviewPage() {
  const [topics, setTopics] = useState();
  const router = useRouter();

  const loadTopics = async () => {
    setTopics(await getTopics());
  };

  useEffect(() => {
    loadTopics();
  }, []);
  console.log(topics);

  const columns = [
    {
      title: "Tên đề tài",
      dataIndex: "vietnameseName",
      key: "vietnameseName",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Loại hình",
      dataIndex: "type",
      key: "type",
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
            <Button onClick={() => {}} danger icon={<DeleteOutlined />} />
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
    </div>
  );
}
