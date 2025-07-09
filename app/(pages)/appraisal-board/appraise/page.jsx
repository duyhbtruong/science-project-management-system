"use client";

import { Spin, Table, Select, App, Alert } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  deleteAppraiseById,
  getAppraisesByAppraisalBoardId,
} from "@/service/appraiseGradeService";
import { getAccountById } from "@/service/accountService";
import { getAllPeriods } from "@/service/registrationService";
import { getTableColumns } from "./table-columns";
import { useCustomSession } from "@/hooks/use-custom-session";
import { isWithinAppraisalPeriod } from "@/utils/validator";
import RegistrationPeriodTimeline from "@/components/registration-period-timeline";
const { Option } = Select;

export default function AppraiseTopicPage() {
  const { session } = useCustomSession();
  const userId = session?.user?.id;
  const router = useRouter();

  const [account, setAccount] = useState();
  const [appraisalBoard, setAppraisalBoard] = useState();
  const [listPeriod, setListPeriod] = useState();
  const [listAppraise, setListAppraise] = useState();
  const [selectedPeriod, setSelectedPeriod] = useState();
  const [loading, setLoading] = useState(false);
  const [isAppraisalPeriod, setIsAppraisalPeriod] = useState(false);

  const { message, modal } = App.useApp();

  const config = {
    title: "Hủy kết quả thẩm định?",
    content: <p>Bạn có muốn hủy kết quả thẩm định của đề tài này không?</p>,
    okText: "Xác nhận",
    cancelText: "Hủy",
  };

  const loadAccount = async () => {
    try {
      setLoading(true);
      let res = await getAccountById(userId);
      res = await res.json();
      setAppraisalBoard(res.appraisalBoard);
      setAccount(res.account);
    } catch (error) {
      message.error("Không thể tải thông tin tài khoản");
    } finally {
      setLoading(false);
    }
  };

  const loadListAppraise = async () => {
    try {
      setLoading(true);
      let res = await getAppraisesByAppraisalBoardId(
        selectedPeriod,
        appraisalBoard._id
      );
      res = await res.json();
      setListAppraise(res);
    } catch (error) {
      message.error("Không thể tải danh sách thẩm định");
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
    if (!isAppraisalPeriod) {
      message.error(
        "Không trong thời gian thẩm định. Chỉ có thể hủy thẩm định đề tài trong khoảng thời gian từ ngày kết thúc nộp báo cáo đến hạn thẩm định."
      );
      return;
    }

    try {
      const confirmed = await modal.confirm(config);
      if (confirmed) {
        setLoading(true);
        let res = await deleteAppraiseById(record._id);
        if (res.ok) {
          const data = await res.json();
          message.success(data.message || "Hủy thẩm định thành công");
          loadListAppraise();
        } else {
          const data = await res.json();
          message.error(data.message || "Không thể hủy thẩm định");
        }
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi hủy thẩm định");
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (value) => {
    setSelectedPeriod(value);
    const period = listPeriod?.find((p) => p._id === value);
    if (period) {
      const isInAppraisalPeriod = isWithinAppraisalPeriod(period);
      setIsAppraisalPeriod(isInAppraisalPeriod);
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
    if (!selectedPeriod || !appraisalBoard?._id) return;
    loadListAppraise();
  }, [selectedPeriod, appraisalBoard]);

  const columns = getTableColumns(router, handleDelete, !isAppraisalPeriod);

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-100 px-32 py-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Thẩm định đề tài
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Quản lý và thẩm định các đề tài nghiên cứu khoa học
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

      {selectedPeriod && !isAppraisalPeriod && (
        <Alert
          message="Không trong thời gian thẩm định"
          description="Chỉ có thể thẩm định đề tài trong khoảng thời gian từ ngày kết thúc nộp báo cáo đến hạn thẩm định."
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
              Vui lòng chọn đợt đăng ký để xem danh sách thẩm định đề tài
            </p>
          </div>
        </div>
      ) : (
        <Spin spinning={loading}>
          <Table
            className="mt-4"
            dataSource={listAppraise}
            columns={columns}
            pagination={{
              pageSize: 8,
              showTotal: (total) => `Tổng số ${total} đề tài`,
            }}
            rowKey="_id"
          />
        </Spin>
      )}
    </div>
  );
}
