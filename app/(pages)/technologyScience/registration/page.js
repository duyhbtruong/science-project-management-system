"use client";

import {
  deletePeriodById,
  getAllPeriods,
  searchPeriods,
} from "@/service/registrationService";
import { dateFormat } from "@/utils/format";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const { Search } = Input;

export default function RegistrationPeriodPage() {
  const router = useRouter();
  const [periods, setPeriods] = useState();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modal, modalContextHolder] = Modal.useModal();

  const handleEditButton = (periodId) => {
    router.push(`/technologyScience/registration/${periodId}`);
  };

  const handleDeleteButton = async (periodId) => {
    const confirmed = await modal.confirm({
      title: "Xóa đợt đăng ký",
      content: "Bạn có chắc chắn muốn xóa đợt đăng ký này không?",
    });

    if (!confirmed) return;

    let res = await deletePeriodById(periodId);

    if (res.status === 200) {
      res = await res.json();
      const { message } = res;
      messageApi
        .open({
          type: "success",
          content: message,
          duration: 2,
        })
        .then(() => loadPeriods());
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

  const columns = [
    {
      title: "Tên",
      dataIndex: "title",
      key: "title",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      ellipsis: true,
      render: (date) => dateFormat(new Date(date)),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      ellipsis: true,
      render: (date) => dateFormat(new Date(date)),
    },
    {
      title: "Hạn kiểm duyệt",
      dataIndex: "reviewDeadline",
      key: "reviewDeadline",
      ellipsis: true,
      render: (date) => dateFormat(new Date(date)),
    },
    {
      title: "Hạn nộp bài",
      dataIndex: "submitDeadline",
      key: "submitDeadline",
      ellipsis: true,
      render: (date) => dateFormat(new Date(date)),
    },
    {
      title: "Hạn thẩm định",
      dataIndex: "appraiseDeadline",
      key: "appraiseDeadline",
      ellipsis: true,
      render: (date) => dateFormat(new Date(date)),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        return (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                handleEditButton(record._id);
              }}
            />
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteButton(record._id)}
            />
          </Space>
        );
      },
    },
  ];

  const loadPeriods = async () => {
    var res = await getAllPeriods();
    res = await res.json();
    setPeriods(res);
  };

  const handleAddPeriod = () => {
    router.push(`registration/create`);
  };

  const handleSearchPeriods = async (searchValue) => {
    var res = await searchPeriods(searchValue);
    res = await res.json();
    setPeriods(res);
  };

  const handleSearchChange = async (event) => {
    if (event.target.value === "") {
      loadPeriods();
    }
  };

  useEffect(() => {
    loadPeriods();
  }, []);

  console.log(">>> periods: ", periods);

  return (
    <>
      <div className="bg-gray-100 min-h-[100vh]">
        <div className="flex flex-col py-6 mx-32">
          <div className="flex justify-between">
            <Search
              className="w-[450px] mb-4"
              placeholder="Tìm kiếm đợt đăng ký..."
              enterButton
              onSearch={handleSearchPeriods}
              onChange={handleSearchChange}
            />
            <Button
              loading={!periods}
              onClick={handleAddPeriod}
              icon={<PlusOutlined />}
              type="primary"
            >
              Tạo đợt đăng ký
            </Button>
          </div>

          <Spin spinning={!periods}>
            <Table
              rowKey={(record) => record._id}
              tableLayout="fixed"
              columns={columns}
              dataSource={periods}
              pagination={{ pageSize: 8 }}
            />
          </Spin>
        </div>
        {messageContextHolder}
        {modalContextHolder}
      </div>
    </>
  );
}
