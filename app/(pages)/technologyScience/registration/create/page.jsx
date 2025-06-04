"use client";

import { useRouter } from "next/navigation";
import { FileTextIcon } from "lucide-react";
import { Form, Input, message, Space, DatePicker } from "antd";

import { createPeriod } from "@/service/registrationService";
import { SubmitButton } from "@/components/submit-button";

export default function CreatePeriodPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (formValues) => {
    let period = {
      title: formValues.title,
      startDate: formValues.startDate.format("YYYY-MM-DD"),
      endDate: formValues.endDate.format("YYYY-MM-DD"),
      reviewDeadline: formValues.reviewDeadline.format("YYYY-MM-DD"),
      submitDeadline: formValues.submitDeadline.format("YYYY-MM-DD"),
      appraiseDeadline: formValues.appraiseDeadline.format("YYYY-MM-DD"),
    };

    let res = await createPeriod(period);

    if (res.status === 201) {
      res = await res.json();
      const { message } = res;
      messageApi
        .open({
          type: "success",
          content: message,
          duration: 2,
        })
        .then(() => {
          router.push(`/technologyScience/registration`);
        });
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

  return (
    <>
      {contextHolder}
      <div className="bg-gray-100 ">
        <div className="py-6 mx-32">
          <div className="flex justify-center pb-6 text-xl font-semibold">
            Tạo Đợt Đăng ký Đề tài mới
          </div>
          <div className="flex justify-center">
            <Form
              form={form}
              name="create-new-period"
              className="py-2 px-4 w-[640px] bg-white rounded-md shadow-md"
              onFinish={onFinish}
              layout="vertical"
              autoComplete="off"
            >
              <Form.Item label="Tên" name="title" rules={[{ required: true }]}>
                <Input
                  prefix={<FileTextIcon className="mr-1 text-border size-4" />}
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
          </div>
        </div>
      </div>
    </>
  );
}
