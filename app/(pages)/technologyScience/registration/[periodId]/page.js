"use client";

import { AlignLeftOutlined } from "@ant-design/icons";
import { Form, Input, message, Space, Button, Spin, DatePicker } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPeriodById, updatePeriodById } from "@/service/registrationService";
import dayjs from "dayjs";

export default function EditPeriodScreen({ params }) {
  const periodId = params.periodId;
  const router = useRouter();
  const [form] = Form.useForm();
  const [period, setPeriod] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const loadPeriod = async () => {
    let res = await getPeriodById(periodId);
    res = await res.json();
    setPeriod(res);
  };

  useEffect(() => {
    loadPeriod();
  }, []);

  useEffect(() => {
    if (!period) return;

    form.setFieldsValue({
      title: period.title,
      startDate: dayjs(period.startDate),
      endDate: dayjs(period.endDate),
      reviewDeadline: dayjs(period.reviewDeadline),
      submitDeadline: dayjs(period.submitDeadline),
      appraiseDeadline: dayjs(period.appraiseDeadline),
    });
  }, [period]);

  const onFinish = async (formValues) => {
    let updatedPeriod = {
      title: formValues.title,
      startDate: formValues.startDate.format("YYYY-MM-DD"),
      endDate: formValues.endDate.format("YYYY-MM-DD"),
      reviewDeadline: formValues.reviewDeadline.format("YYYY-MM-DD"),
      submitDeadline: formValues.submitDeadline.format("YYYY-MM-DD"),
      appraiseDeadline: formValues.appraiseDeadline.format("YYYY-MM-DD"),
    };

    let res = await updatePeriodById(periodId, updatedPeriod);

    if (res.status === 200) {
      res = await res.json();
      const { message } = res;
      messageApi
        .open({
          type: "success",
          content: message,
          duration: 2,
        })
        .then(() => router.back());
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

  console.log(">>> period: ", period);

  return (
    <>
      <div className="bg-gray-100 min-h-[100vh]">
        {contextHolder}
        <div className="py-6 mx-32">
          <div className="flex justify-center pb-6 text-xl font-semibold">
            Cập nhật Đợt đăng ký
          </div>
          <div className="flex justify-center">
            <Spin spinning={!period}>
              <Form
                form={form}
                name="update-period"
                className="py-2 px-4 w-[640px] bg-white rounded-md shadow-md"
                onFinish={(formValues) => onFinish(formValues)}
                layout="vertical"
                autoComplete="off"
              >
                <Form.Item
                  label="Tên"
                  name="title"
                  rules={[{ required: true }]}
                >
                  <Input
                    prefix={<AlignLeftOutlined className="text-border" />}
                    placeholder="Nhập tên đợt đăng ký..."
                  />
                </Form.Item>

                <Form.Item
                  label="Ngày bắt đầu"
                  name="startDate"
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    className="w-full"
                    placeholder="Chọn ngày bắt đầu..."
                  />
                </Form.Item>

                <Form.Item
                  label="Ngày kết thúc"
                  name="endDate"
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    className="w-full"
                    placeholder="Chọn ngày kết thúc..."
                  />
                </Form.Item>

                <Form.Item
                  label="Hạn kiểm duyệt"
                  name="reviewDeadline"
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    className="w-full"
                    placeholder="Chọn hạn kiểm duyệt..."
                  />
                </Form.Item>

                <Form.Item
                  label="Hạn nộp bài"
                  name="submitDeadline"
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    className="w-full"
                    placeholder="Chọn hạn nộp bài..."
                  />
                </Form.Item>

                <Form.Item
                  label="Hạn thẩm định"
                  name="appraiseDeadline"
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    className="w-full"
                    placeholder="Chọn hạn thẩm định..."
                  />
                </Form.Item>

                <Form.Item>
                  <Space>
                    <SubmitButton form={form}>Tạo</SubmitButton>
                  </Space>
                </Form.Item>
              </Form>
            </Spin>
          </div>
        </div>
      </div>
    </>
  );
}

const SubmitButton = ({ form, children }) => {
  const [submittable, setSubmittable] = useState(false);

  // Watch all values
  const values = Form.useWatch([], form);
  useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);
  return (
    <Button type="primary" htmlType="submit" disabled={!submittable}>
      {children}
    </Button>
  );
};
