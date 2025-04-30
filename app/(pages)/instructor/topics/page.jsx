"use client";

import { getAccountById } from "@/service/accountService";
import { getAllPeriods } from "@/service/registrationService";
import { getTopicsByInstructorId } from "@/service/topicService";
import { Select, Spin, Table, Tag } from "antd";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getTableColumns } from "./table-columns";
const { Option } = Select;

export default function TopicsPage() {
  const session = useSession();
  const userId = session?.data?.user?.id;

  const [listTopic, setListTopic] = useState();
  const [listPeriod, setListPeriod] = useState();
  const [account, setAccount] = useState();
  const [instructor, setInstructor] = useState();
  const [selectedPeriod, setSelectedPeriod] = useState();

  const loadTopics = async () => {
    let res = await getTopicsByInstructorId(selectedPeriod, instructor._id);
    res = await res.json();
    setListTopic(res);
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
    if (!selectedPeriod || !instructor) return;

    loadTopics();
  }, [selectedPeriod, instructor]);

  const handlePeriodChange = (value) => {
    setSelectedPeriod(value);
  };

  const columns = getTableColumns();

  return (
    <div className="bg-gray-100 min-h-[100vh]">
      <div className="flex flex-col py-6 mx-32">
        <div className="mb-4 space-x-4">
          {selectedPeriod && (
            <Select
              className="w-64"
              placeholder="Chọn đợt đăng ký..."
              onChange={handlePeriodChange}
              value={selectedPeriod}
            >
              {listPeriod?.map((period, index) => (
                <Option key={`registration-period-${index}`} value={period._id}>
                  {period.title}
                </Option>
              ))}
            </Select>
          )}
        </div>

        {!selectedPeriod ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow">
            <Select
              className="w-64 mb-4"
              placeholder="Chọn đợt đăng ký..."
              onChange={handlePeriodChange}
              value={selectedPeriod}
            >
              {listPeriod?.map((period, index) => (
                <Option key={`registration-period-${index}`} value={period._id}>
                  {period.title}
                </Option>
              ))}
            </Select>
            <p className="text-gray-500">
              Vui lòng chọn đợt đăng ký để xem danh sách hướng dẫn đề tài
            </p>
          </div>
        ) : (
          <Spin spinning={!listTopic}>
            <Table
              rowKey={(record) => record._id}
              tableLayout="fixed"
              columns={columns}
              dataSource={listTopic}
              pagination={{ pageSize: 8 }}
            />
          </Spin>
        )}
      </div>
    </div>
  );
}
