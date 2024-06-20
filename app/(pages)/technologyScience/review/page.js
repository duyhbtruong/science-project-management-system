"use client";

import { getTopics } from "@/service/topicService";
import { HighlightOutlined } from "@ant-design/icons";
import { Input, Button, Space, Spin, Table } from "antd";
import { useEffect, useState } from "react";
const { Search } = Input;

export default function ReviewPage() {
  const [topics, setTopics] = useState();

  const loadTopics = async () => {
    setTopics(await getTopics());
  };

  useEffect(() => {
    loadTopics();
  }, []);

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
      title: "Hành động",
      key: "action",
      width: "10%",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button onClick={() => {}} danger icon={<HighlightOutlined />} />
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
            expandable={{
              expandedRowRender: (record) => {
                const instructorItems = [
                  {
                    label: "Tên",
                    key: "name",
                    children: <p>{record.instructor.name}</p>,
                  },
                  {
                    label: "Email",
                    key: "email",
                    children: (
                      <Link
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${record.instructor.email}`}
                      >
                        {record.instructor.email}
                      </Link>
                    ),
                  },
                  {
                    label: "Học hàm, học vị",
                    key: "academicRank",
                    children: <p>{record.instructor.academicRank}</p>,
                  },
                ];

                const reviewItems = [
                  {
                    label: "Trạng thái",
                    key: "isReviewed",
                    children: (
                      <Tag
                        color={record.isReviewed ? "success" : "default"}
                        icon={
                          record.isReviewed ? (
                            <CheckCircleOutlined />
                          ) : (
                            <SyncOutlined spin />
                          )
                        }
                      >
                        {record.isReviewed
                          ? "Đã kiểm duyệt"
                          : "Chưa kiểm duyệt"}
                      </Tag>
                    ),
                  },
                  {
                    label: "Kết quả",
                    key: "result",
                    children: <p>70</p>,
                  },
                ];

                return (
                  <div className="space-y-4">
                    <Descriptions
                      title="Thông tin Giảng viên Hướng dẫn"
                      items={instructorItems}
                    />
                    <Descriptions
                      title="Thông tin kiểm duyệt"
                      items={reviewItems}
                    />
                  </div>
                );
              },
            }}
          />
        </Spin>
      </div>
    </div>
  );
}
