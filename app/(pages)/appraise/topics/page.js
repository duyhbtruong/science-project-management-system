"use client";

import {
  getTopics,
  getTopicsByAppraisalBoardStaffId,
  searchTopic,
} from "@/service/topicService";
import {
  CheckOutlined,
  DeleteOutlined,
  HighlightOutlined,
  PaperClipOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Modal,
  Spin,
  Table,
  message,
  Input,
  Tag,
  Space,
  Button,
  Select,
} from "antd";
const { Search } = Input;
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { storage } from "@/lib/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import Link from "next/link";
import { deleteAppraiseById } from "@/service/appraiseGradeService";
import { getAccountById } from "@/service/accountService";
import { getAllPeriods } from "@/service/registrationService";
const { Option } = Select;

export default function AppraiseTopicPage() {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const [topics, setTopics] = useState();
  const [account, setAccount] = useState();
  const [appraisalBoard, setAppraisalBoard] = useState();
  const [listPeriod, setListPeriod] = useState();
  const [selectedPeriod, setSelectedPeriod] = useState();
  const router = useRouter();
  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();

  const config = {
    title: "Hủy kết quả thẩm định?",
    content: <p>Bạn có muốn hủy kết quả thẩm định của đề tài này không?</p>,
  };

  const loadAccount = async () => {
    let res = await getAccountById(userId);
    res = await res.json();
    setAppraisalBoard(res.appraise);
    setAccount(res.account);
  };

  const loadTopics = async () => {
    let res = await getTopicsByAppraisalBoardStaffId(
      selectedPeriod,
      appraisalBoard._id
    );
    res = await res.json();
    setTopics(res);
  };

  const loadPeriod = async () => {
    let res = await getAllPeriods();
    res = await res.json();
    setListPeriod(res);
  };

  const handleSearchChange = (event) => {
    if (event.target.value === "") {
      loadTopics();
    }
  };

  const handleSearchTopic = async (searchValue) => {
    let res = await searchTopic(searchValue);
    setTopics(res);
  };

  const deleteAppraiseGrade = async (appraiseId) => {
    let res = await deleteAppraiseById(appraiseId);
    if (res.status === 200) {
      res = await res.json();
      const { message } = res;
      messageApi.open({
        type: "success",
        content: message,
        dutation: 2,
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
    if (!selectedPeriod || !appraisalBoard) return;

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
      title: "Tài liệu",
      dataIndex: "submitFile",
      key: "submitFile",
      render: (_, record) => {
        if (!record.submitFile) return <span>Chưa nộp</span>;
        return (
          <Link target="_blank" href={record.submitFile}>
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
        const isAppraised = record.appraises.length > 0;
        return (
          <Tag
            color={isAppraised ? "success" : "default"}
            icon={isAppraised ? <CheckOutlined /> : <SyncOutlined spin />}
          >
            {isAppraised ? "Đã thẩm định" : "Chưa thẩm định"}
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
              disabled={!record.submitFile}
              onClick={() => router.push(`/appraise/topics/${record._id}`)}
              icon={<HighlightOutlined />}
            />
            <Button
              disabled={record.appraises.length === 0}
              onClick={async () => {
                const confirmed = await modal.confirm(config);
                if (confirmed) {
                  deleteAppraiseGrade(record.appraises[0]);
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
        </div>

        {/* <Search
          className="w-[450px] mb-4"
          placeholder="Tìm kiếm đề tài..."
          enterButton
          onSearch={handleSearchTopic}
          onChange={handleSearchChange}
        /> */}
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
