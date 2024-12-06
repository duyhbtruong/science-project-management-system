"use client";

import { getTopics, searchTopic } from "@/service/topicService";
import {
  CheckOutlined,
  DeleteOutlined,
  HighlightOutlined,
  PaperClipOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Modal, Spin, Table, message, Input, Tag, Space, Button } from "antd";
const { Search } = Input;
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { storage } from "@/lib/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import Link from "next/link";
import { deleteAppraiseGradeByTopicId } from "@/service/appraiseGradeService";

export default function AppraiseTopicPage() {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const [topics, setTopics] = useState();
  const router = useRouter();
  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();

  const config = {
    title: "Hủy kết quả thẩm định?",
    content: <p>Bạn có muốn hủy kết quả thẩm định của đề tài này không?</p>,
  };

  const loadTopics = async () => {
    setTopics(await getTopics());
  };

  const handleSearchChange = (event) => {
    if (event.target.value === "") {
      loadTopics();
    }
  };

  const handleSearchTopic = async (searchValue) => {
    const res = await searchTopic(searchValue);
    setTopics(res);
  };

  const deleteAppraiseGrade = async (topicId, appraisalBoardId) => {
    const res = await deleteAppraiseGradeByTopicId(topicId, appraisalBoardId);
    const { message } = res;
    if (message === "Chưa thẩm định đề tài này!") {
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
      title: "Tài liệu",
      dataIndex: "fileRef",
      key: "fileRef",
      render: (_, record) => {
        if (!record.fileRef) return <span>Chưa nộp</span>;
        return (
          <Link target="_blank" href={record.fileRef}>
            <PaperClipOutlined /> Đường dẫn tài liệu
          </Link>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "isAppraised",
      key: "isAppraised",
      render: (_, record) => {
        return (
          <Tag
            color={record.isAppraised ? "success" : "default"}
            icon={
              record.isAppraised ? <CheckOutlined /> : <SyncOutlined spin />
            }
          >
            {record.isAppraised ? "Đã thẩm định" : "Chưa thẩm định"}
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
              disabled={!record.fileRef}
              onClick={() => router.push(`/appraise/topics/${record._id}`)}
              icon={<HighlightOutlined />}
            />
            <Button
              disabled={!record.fileRef}
              onClick={async () => {
                const confirmed = await modal.confirm(config);
                if (confirmed) {
                  deleteAppraiseGrade(record._id, userId);
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
    <div className="min-h-[calc(100vh-45.8px)] bg-gray-100">
      <div className="flex flex-col py-6 mx-32">
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
