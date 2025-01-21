"use client";

import { getAccountById } from "@/service/accountService";
import { getAllPeriods } from "@/service/registrationService";
import { getTopicsByInstructorId } from "@/service/topicService";
import { dateFormat } from "@/utils/format";
import { Select, Spin, Table, Tag } from "antd";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CheckOutlined, SyncOutlined } from "@ant-design/icons";
const { Option } = Select;

export default function TopicsPage() {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const [topics, setTopics] = useState();
  const [account, setAccount] = useState();
  const [instructor, setInstructor] = useState();
  const [listPeriod, setListPeriod] = useState();
  const [selectedPeriod, setSelectedPeriod] = useState();

  const loadTopics = async () => {
    let res = await getTopicsByInstructorId(selectedPeriod, instructor._id);
    res = await res.json();
    setTopics(res);
  };

  const loadAccount = async () => {
    let res = await getAccountById(userId);
    res = await res.json();
    setInstructor(res.instructor);
    setAccount(res.account);
  };

  const loadPeriod = async () => {
    let res = await getAllPeriods();
    res = await res.json();
    setListPeriod(res);
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

  const handlePeriodChange = (value) => {
    setSelectedPeriod(value);
  };

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
      title: "Trạng thái kiểm duyệt",
      dataIndex: "reviews",
      key: "reviews",
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
      title: "Trạng thái thẩm định",
      dataIndex: "appraises",
      key: "appraises",
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
    </div>
  );
}
