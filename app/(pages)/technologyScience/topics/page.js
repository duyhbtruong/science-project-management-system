"use client";

import {
  CheckCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, Modal, Space, Table, Tag } from "antd";
import { useState } from "react";

export default function TopicsManagePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const topics = [
    {
      key: "1",
      vietnameseName: "QUY TRÌNH THỰC HIỆN ĐỀ TÀI NGHIÊN CỨU KHOA HỌC",
      owner: "Tester 1",
      reviewStatus: "Đã kiểm duyệt",
      appraiseStatus: "Đã thẩm định",
    },
    {
      key: "2",
      vietnameseName: "Testing",
      owner: "Tester 2",
      reviewStatus: "Đang kiểm duyệt",
      appraiseStatus: "Đang thẩm định",
    },
    {
      key: "3",
      vietnameseName: "Testing",
      owner: "Tester 3",
      reviewStatus: "Chưa kiểm duyệt",
      appraiseStatus: "Chưa thẩm định",
    },
    {
      key: "4",
      vietnameseName: "Testing",
      owner: "Tester 3",
      reviewStatus: "Chưa kiểm duyệt",
      appraiseStatus: "Chưa thẩm định",
    },
    {
      key: "5",
      vietnameseName: "Testing",
      owner: "Tester 3",
      reviewStatus: "Chưa kiểm duyệt",
      appraiseStatus: "Chưa thẩm định",
    },
    {
      key: "6",
      vietnameseName: "Testing",
      owner: "Tester 3",
      reviewStatus: "Chưa kiểm duyệt",
      appraiseStatus: "Chưa thẩm định",
    },
    {
      key: "7",
      vietnameseName: "Testing",
      owner: "Tester 3",
      reviewStatus: "Chưa kiểm duyệt",
      appraiseStatus: "Chưa thẩm định",
    },
    {
      key: "8",
      vietnameseName: "Testing",
      owner: "Tester 3",
      reviewStatus: "Chưa kiểm duyệt",
      appraiseStatus: "Chưa thẩm định",
    },
    {
      key: "9",
      vietnameseName: "Testing",
      owner: "Tester 3",
      reviewStatus: "Chưa kiểm duyệt",
      appraiseStatus: "Chưa thẩm định",
    },
    {
      key: "10",
      vietnameseName: "Testing",
      owner: "Tester 3",
      reviewStatus: "Chưa kiểm duyệt",
      appraiseStatus: "Chưa thẩm định",
    },
    {
      key: "11",
      vietnameseName: "Testing",
      owner: "Tester 3",
      reviewStatus: "Chưa kiểm duyệt",
      appraiseStatus: "Chưa thẩm định",
    },
  ];

  const columns = [
    {
      title: "Tên đề tài",
      dataIndex: "vietnameseName",
      key: "vietnameseName",
      width: "35%",
      ellipsis: true,
    },
    {
      title: "Chủ nhiệm đề tài",
      dataIndex: "owner",
      key: "owner",
    },
    {
      title: "Trạng thái kiểm duyệt",
      dataIndex: "reviewStatus",
      key: "reviewStatus",
      render: (_, { reviewStatus }) => {
        let color, icon;
        switch (reviewStatus) {
          case "Đã kiểm duyệt":
            color = "success";
            icon = <CheckCircleOutlined />;
            break;
          case "Đang kiểm duyệt":
            color = "processing";
            icon = <SyncOutlined spin />;
            break;
          case "Chưa kiểm duyệt":
            color = "default";
            icon = <MinusCircleOutlined />;
          default:
            break;
        }
        return (
          <Tag color={color} icon={icon}>
            {reviewStatus}
          </Tag>
        );
      },
      filters: [
        {
          text: "Đã kiểm duyệt",
          value: "Đã kiểm duyệt",
        },
        {
          text: "Đang kiểm duyệt",
          value: "Đang kiểm duyệt",
        },
        {
          text: "Chưa kiểm duyệt",
          value: "Chưa kiểm duyệt",
        },
      ],
      onFilter: (value, record) => record.reviewStatus.indexOf(value) === 0,
    },
    {
      title: "Trạng thái thẩm định",
      dataIndex: "appraiseStatus",
      key: "appraiseStatus",
      render: (_, { appraiseStatus }) => {
        let color, icon;
        switch (appraiseStatus) {
          case "Đã thẩm định":
            color = "success";
            icon = <CheckCircleOutlined />;
            break;
          case "Đang thẩm định":
            color = "processing";
            icon = <SyncOutlined spin />;
            break;
          case "Chưa thẩm định":
            color = "default";
            icon = <MinusCircleOutlined />;
          default:
            break;
        }
        return (
          <Tag color={color} icon={icon}>
            {appraiseStatus}
          </Tag>
        );
      },
      filters: [
        {
          text: "Đã thẩm định",
          value: "Đã thẩm định",
        },
        {
          text: "Đang thẩm định",
          value: "Đang thẩm định",
        },
        {
          text: "Chưa thẩm định",
          value: "Chưa thẩm định",
        },
      ],
      onFilter: (value, record) => record.appraiseStatus.indexOf(value) === 0,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button type="default" icon={<EyeOutlined />} onClick={showModal} />
            <Button danger icon={<DeleteOutlined />} />
          </Space>
        );
      },
    },
  ];

  return (
    <div className="bg-gray-100 h-[calc(100vh-56px)]">
      <div className="flex flex-col mx-32 py-6">
        <div className="mb-6 text-lg font-semibold">Quản lý đề tài</div>
        <div className="p-4 bg-white rounded-md">
          <Table
            columns={columns}
            dataSource={topics}
            pagination={{ pageSize: 7 }}
          />
        </div>
      </div>
      <Modal open={isModalOpen} onCancel={handleCancel} onOk={handleOk}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
}
