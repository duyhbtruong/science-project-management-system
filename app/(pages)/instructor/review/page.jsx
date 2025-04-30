"use client";

import { getAccountById } from "@/service/accountService";
import { getAllPeriods } from "@/service/registrationService";
import { deleteReviewById } from "@/service/reviewService";
import { getTopicsByReviewInstructorId } from "@/service/topicService";
import { Spin, Table, Modal, message, Select } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTableColumns } from "./table-columns";
const { Option } = Select;

export default function ReviewPage() {
  const router = useRouter();
  const session = useSession();
  const userId = session?.data?.user?.id;

  const [account, setAccount] = useState();
  const [instructor, setInstructor] = useState();
  const [listTopic, setTopics] = useState();
  const [listPeriod, setListPeriod] = useState();
  const [selectedPeriod, setSelectedPeriod] = useState();

  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();

  const config = {
    title: "Hủy kết quả kiểm duyệt?",
    content: <p>Bạn có muốn hủy kết quả kiểm duyệt của đề tài này không?</p>,
  };

  const loadAccount = async () => {
    let res = await getAccountById(userId);
    res = await res.json();
    setInstructor(res.instructor);
    setAccount(res.account);
  };

  const loadTopics = async () => {
    let res = await getTopicsByReviewInstructorId(
      selectedPeriod,
      instructor._id
    );
    res = await res.json();
    setTopics(res);
  };

  const loadPeriod = async () => {
    let res = await getAllPeriods();
    res = await res.json();
    setListPeriod(res);
  };

  const handleDelete = async (record) => {
    const confirmed = await modal.confirm(config);
    if (confirmed) {
      deleteReview(record.reviews[0]);
    }
  };

  const deleteReview = async (reviewId) => {
    let res = await deleteReviewById(reviewId);
    if (res.status === 200) {
      res = await res.json();
      const { message } = res;
      messageApi.open({
        type: "success",
        content: message,
        duration: 2,
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
    if (!selectedPeriod || !instructor) return;

    loadTopics();
  }, [selectedPeriod]);

  const columns = getTableColumns(router, handleDelete);

  return (
    <>
      {modalContextHolder}
      {messageContextHolder}
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
                {listPeriod.map((period, index) => (
                  <Option
                    key={`registration-period-${index}`}
                    value={period._id}
                  >
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
                  <Option
                    key={`registration-period-${index}`}
                    value={period._id}
                  >
                    {period.title}
                  </Option>
                ))}
              </Select>
              <p className="text-gray-500">
                Vui lòng chọn đợt đăng ký để xem danh sách kiểm duyệt đề tài
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
    </>
  );
}
