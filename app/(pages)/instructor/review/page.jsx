"use client";

import { getAccountById } from "@/service/accountService";
import { getAllPeriods } from "@/service/registrationService";
import {
  getReviewsByInstructorId,
  deleteReviewById,
} from "@/service/reviewService";
import { Spin, Table, Select, App, Alert } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTableColumns } from "./table-columns";
import { useCustomSession } from "@/hooks/use-custom-session";
import RegistrationPeriodTimeline from "@/components/registration-period-timeline";
import { isWithinReviewPeriod } from "@/utils/validator";
const { Option } = Select;

export default function ReviewPage() {
  const { session } = useCustomSession();
  const userId = session?.user?.id;

  const router = useRouter();

  const [account, setAccount] = useState();
  const [instructor, setInstructor] = useState();
  const [listReview, setListReview] = useState();
  const [listPeriod, setListPeriod] = useState();
  const [selectedPeriod, setSelectedPeriod] = useState();
  const [loading, setLoading] = useState(false);
  const [isReviewPeriod, setIsReviewPeriod] = useState(false);

  const { message, modal } = App.useApp();

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
      message.error("Không thể tải thông tin tài khoản");
    } finally {
      setLoading(false);
    }
  };

  const loadListReview = async () => {
    try {
      setLoading(true);
      let res = await getReviewsByInstructorId(selectedPeriod, instructor._id);
      if (res.ok) {
        res = await res.json();
        setListReview(res);
      } else {
        const errorData = await res.json();
        message.error(
          errorData.message || "Không thể tải danh sách kiểm duyệt"
        );
      }
    } catch (error) {
      message.error("Không thể tải danh sách kiểm duyệt");
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
      message.error("Không thể tải danh sách đợt đăng ký");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (record) => {
    if (!isReviewPeriod) {
      message.error(
        "Không trong thời gian kiểm duyệt. Chỉ có thể hủy kiểm duyệt đề tài trong khoảng thời gian từ ngày kết thúc đăng ký đến hạn kiểm duyệt."
      );
      return;
    }

    try {
      const confirmed = await modal.confirm(config);
      if (confirmed) {
        setLoading(true);
        let res = await deleteReviewById(record._id);
        if (res.ok) {
          const data = await res.json();
          message.success(data.message || "Hủy kiểm duyệt thành công");
          loadListReview();
        } else {
          const data = await res.json();
          message.error(data.message || "Không thể hủy kiểm duyệt");
        }
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi hủy kiểm duyệt");
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (value) => {
    setSelectedPeriod(value);
    const period = listPeriod?.find((p) => p._id === value);
    if (period) {
      setIsReviewPeriod(isWithinReviewPeriod(period));
    }
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

  const columns = getTableColumns(router, handleDelete, !isReviewPeriod);

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-100 px-32 py-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Kiểm duyệt đề tài
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Quản lý và kiểm duyệt các đề tài nghiên cứu khoa học
          </p>
        </div>
        <div className="flex items-center">
          <span className="mr-2">Đợt đăng ký:</span>
          <Select
            value={selectedPeriod}
            placeholder="Chọn đợt đăng ký"
            style={{ width: 220 }}
            onChange={handlePeriodChange}
          >
            {listPeriod?.map((period) => (
              <Option key={period._id} value={period._id}>
                {period.title}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {selectedPeriod && (
        <div className="my-4">
          <RegistrationPeriodTimeline
            period={listPeriod?.find((p) => p._id === selectedPeriod)}
          />
        </div>
      )}

      {selectedPeriod && !isReviewPeriod && (
        <Alert
          message="Không trong thời gian kiểm duyệt"
          description="Chỉ có thể kiểm duyệt đề tài trong khoảng thời gian từ ngày kết thúc đăng ký đến hạn kiểm duyệt."
          type="warning"
          showIcon
          className="mb-4"
        />
      )}

      {!selectedPeriod ? (
        <div className="flex flex-col justify-center items-center py-12 bg-white rounded-lg shadow">
          <div className="text-center">
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Chưa chọn đợt đăng ký
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Vui lòng chọn đợt đăng ký để xem danh sách kiểm duyệt đề tài
            </p>
          </div>
        </div>
      ) : (
        <Spin spinning={loading}>
          <Table
            className="mt-4"
            rowKey="_id"
            columns={columns}
            dataSource={listReview}
            pagination={{
              pageSize: 8,
              showTotal: (total) => `Tổng số ${total} đề tài`,
            }}
          />
        </Spin>
      )}
    </div>
  );
}
