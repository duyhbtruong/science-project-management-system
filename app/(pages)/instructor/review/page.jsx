"use client";

import { getAccountById } from "@/service/accountService";
import { getAllPeriods } from "@/service/registrationService";
import {
  getReviewsByTopicId,
  deleteReviewById,
  getReviewsByInstructorId,
} from "@/service/reviewService";
import { getTopicsByReviewInstructorId } from "@/service/topicService";
import { Spin, Table, Modal, message, Select } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTableColumns } from "./table-columns";
const { Option } = Select;

export default function ReviewPage() {
  const session = useSession();
  const userId = session?.data?.user?.id;

  const router = useRouter();

  const [account, setAccount] = useState();
  const [instructor, setInstructor] = useState();
  const [listReview, setListReview] = useState();
  const [listPeriod, setListPeriod] = useState();
  const [selectedPeriod, setSelectedPeriod] = useState();
  const [loading, setLoading] = useState(false);

  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();

  const config = {
    title: "Hủy kết quả kiểm duyệt?",
    content: <p>Bạn có muốn hủy kết quả kiểm duyệt của đề tài này không?</p>,
    okText: "Xác nhận",
    cancelText: "Hủy",
  };

  const loadAccount = async () => {
    try {
      setLoading(true);
      let res = await getAccountById(userId);
      res = await res.json();
      setInstructor(res.instructor);
      setAccount(res.account);
    } catch (error) {
      messageApi.error("Không thể tải thông tin tài khoản");
    } finally {
      setLoading(false);
    }
  };

  const loadListReview = async () => {
    try {
      setLoading(true);
      let res = await getReviewsByInstructorId(selectedPeriod, instructor._id);
      res = await res.json();
      setListReview(res);
    } catch (error) {
      messageApi.error("Không thể tải danh sách kiểm duyệt");
    } finally {
      setLoading(false);
    }
  };

  const loadPeriod = async () => {
    try {
      setLoading(true);
      let res = await getAllPeriods();
      res = await res.json();
      setListPeriod(res);
    } catch (error) {
      messageApi.error("Không thể tải danh sách đợt đăng ký");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (record) => {
    try {
      const confirmed = await modal.confirm(config);
      if (confirmed) {
        setLoading(true);
        const reviewId = record.reviews[0];
        let res = await deleteReviewById(reviewId);
        if (res.ok) {
          const data = await res.json();
          messageApi.success(data.message || "Hủy kiểm duyệt thành công");
          loadTopics();
        } else {
          const data = await res.json();
          messageApi.error(data.message || "Không thể hủy kiểm duyệt");
        }
      }
    } catch (error) {
      messageApi.error("Có lỗi xảy ra khi hủy kiểm duyệt");
    } finally {
      setLoading(false);
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
    if (!selectedPeriod || !instructor?._id) return;
    loadListReview();
  }, [selectedPeriod, instructor]);

  const columns = getTableColumns(router, handleDelete);

  return (
    <>
      {modalContextHolder}
      {messageContextHolder}
      <div className="bg-gray-50 min-h-[100vh]">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Kiểm duyệt đề tài
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Quản lý và kiểm duyệt các đề tài nghiên cứu khoa học
            </p>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 max-w-sm">
                  <Select
                    className="w-full"
                    placeholder="Chọn đợt đăng ký..."
                    onChange={handlePeriodChange}
                    value={selectedPeriod}
                    size="large"
                    loading={loading}
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
                </div>
              </div>
            </div>

            <div className="p-6">
              {!selectedPeriod ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      Chưa chọn đợt đăng ký
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Vui lòng chọn đợt đăng ký để xem danh sách kiểm duyệt đề
                      tài
                    </p>
                  </div>
                </div>
              ) : (
                <Spin spinning={loading}>
                  <Table
                    rowKey={(record) => record._id}
                    tableLayout="fixed"
                    columns={columns}
                    dataSource={listReview}
                    pagination={{
                      pageSize: 8,
                      showSizeChanger: true,
                      showTotal: (total) => `Tổng số ${total} đề tài`,
                    }}
                    className="review-table"
                  />
                </Spin>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
