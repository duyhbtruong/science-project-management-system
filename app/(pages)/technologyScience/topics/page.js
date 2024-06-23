"use client";

import {
  deleteTopicById,
  getTopics,
  searchTopic,
} from "@/service/topicService";
import { dateFormat } from "@/utils/format";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  ExportOutlined,
  PaperClipOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Button,
  Descriptions,
  Input,
  Modal,
  Space,
  Spin,
  Table,
  Tag,
  message,
} from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
const { Search } = Input;

export default function TopicsManagePage() {
  const [topics, setTopics] = useState();
  const [activeExpRow, setActiveExpRow] = useState([]);
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const loadTopics = async () => {
    setTopics(await getTopics());
  };

  const deleteTopic = async (id) => {
    const confirmed = await modal.confirm({
      title: "Xóa đề tài",
      content: "Bạn có chắc chắn muốn xóa đề tài này không?",
    });
    if (confirmed) {
      const res = await deleteTopicById(id);
      messageApi.open({
        type: "success",
        content: "Bạn đã xóa thành công đề tài!",
      });
      loadTopics();
    }
  };

  const handleSearchTopic = async (searchValue) => {
    const res = await searchTopic(searchValue);
    setTopics(res);
  };

  const handleSearchChange = async (event) => {
    if (event.target.value === "") {
      loadTopics();
    }
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
      render: (_, { createdAt }) => {
        return <p>{dateFormat(new Date(createdAt))}</p>;
      },
    },
    {
      title: "Trạng thái kiểm duyệt",
      dataIndex: "isReviewed",
      key: "isReviewed",
      render: (_, { isReviewed }) => {
        let color, icon, text;
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
      dataIndex: "isAppraised",
      key: "isAppraised",
      render: (_, { isAppraised }) => {
        let color, icon, text;
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
            expandable={{
              expandedRowRender: (record) => {
                if (record._id === activeExpRow[0]) {
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
                          target="_blank"
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${record.instructor.email}`}
                        >
                          <ExportOutlined className="mr-1" />
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
                    {
                      label: "Tài liệu",
                      key: "fileRef",
                      children: (
                        <div>
                          {!record.fileRef && "Chưa có"}
                          {record.fileRef && (
                            <Link target="_blank" href={record.fileRef}>
                              <PaperClipOutlined className="mr-1" />
                              Tài liệu đã nộp
                            </Link>
                          )}
                        </div>
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
      {messageContextHolder}
      {modalContextHolder}
    </div>
  );
}
