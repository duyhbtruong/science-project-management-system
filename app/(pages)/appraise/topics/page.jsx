"use client";

import { getTopicsByAppraisalBoardStaffId } from "@/service/topicService";
import { Modal, Spin, Table, message, Tag, Space, Button, Select } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteAppraiseById } from "@/service/appraiseGradeService";
import { getAccountById } from "@/service/accountService";
import { getAllPeriods } from "@/service/registrationService";
import {
  CheckIcon,
  EditIcon,
  LoaderIcon,
  PaperclipIcon,
  TrashIcon,
} from "lucide-react";
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
      ellipsis: true,
    },
    {
      title: "Tên tiếng Anh",
      dataIndex: "englishName",
      key: "englishName",
      ellipsis: true,
    },
    {
      title: "Tài liệu",
      dataIndex: "submitFile",
      key: "submitFile",
      render: (_, record) => {
        if (!record.submitFile) return <span>Chưa nộp</span>;
        return (
          <Link
            target="_blank"
            href={record.submitFile}
            className="flex items-center gap-x-1"
          >
            <PaperclipIcon className="size-4" /> Đường dẫn tài liệu
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
            icon={
              isAppraised ? (
                <CheckIcon className="inline-block mr-1 size-4" />
              ) : (
                <LoaderIcon className="inline-block mr-1 animate-spin size-4" />
              )
            }
          >
            {isAppraised ? "Đã thẩm định" : "Chưa thẩm định"}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button
              disabled={!record.submitFile}
              onClick={() => router.push(`/appraise/topics/${record._id}`)}
              icon={<EditIcon className="size-4" />}
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
              icon={<TrashIcon className="size-4" />}
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
