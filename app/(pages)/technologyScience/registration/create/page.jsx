"use client";

import { useRouter } from "next/navigation";
import { FileTextIcon, CalendarIcon } from "lucide-react";
import {
  Form,
  Input,
  Space,
  DatePicker,
  App,
  Alert,
  Row,
  Col,
  Select,
} from "antd";
import { useEffect, useState } from "react";

import { createPeriod, getAllPeriods } from "@/service/registrationService";
import { SubmitButton } from "@/components/submit-button";

export default function CreatePeriodPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [existingPeriods, setExistingPeriods] = useState([]);

  // Load existing periods on component mount
  useEffect(() => {
    const loadExistingPeriods = async () => {
      try {
        const response = await getAllPeriods();
        const periods = await response.json();
        setExistingPeriods(periods);
      } catch (error) {
        console.error("Error loading existing periods:", error);
      }
    };
    loadExistingPeriods();
  }, []);

  const onFinish = async (formValues) => {
    // Combine period and year to create title
    const title = `${formValues.period}-${formValues.year}`;

    // Check if title already exists
    const titleExists = existingPeriods.some(
      (period) => period.title === title
    );
    if (titleExists) {
      message.open({
        type: "error",
        content: "Tên đợt đăng ký đã tồn tại. Vui lòng chọn đợt hoặc năm khác.",
        duration: 3,
      });
      return;
    }

    let period = {
      title: title,
      startDate: formValues.startDate.format("YYYY-MM-DD"),
      endDate: formValues.endDate.format("YYYY-MM-DD"),
      reviewDeadline: formValues.reviewDeadline.format("YYYY-MM-DD"),
      submitDeadline: formValues.submitDeadline.format("YYYY-MM-DD"),
      appraiseDeadline: formValues.appraiseDeadline.format("YYYY-MM-DD"),
    };

    let res = await createPeriod(period);

    if (res.status === 201) {
      res = await res.json();
      const { message: messageApi } = res;
      message
        .open({
          type: "success",
          content: messageApi,
          duration: 2,
        })
        .then(() => {
          router.push(`/technologyScience/registration`);
        });
    } else {
      res = await res.json();
      const { message: messageApi } = res;
      message.open({
        type: "error",
        content: messageApi,
        duration: 2,
      });
    }
  };

  return (
    <>
      <div className="bg-gray-100">
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
              <Alert
                message="Thông tin về tên đợt đăng ký"
                description="Tên đợt đăng ký sẽ được tạo tự động từ đợt và năm bạn chọn. Format: 'Đợt 1-2025', 'Đợt 2-2025', etc."
                type="info"
                showIcon
                className="mb-4"
              />

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Đợt đăng ký"
                    name="period"
                    dependencies={["year"]}
                    rules={[
                      { required: true, message: "Vui lòng chọn đợt đăng ký" },
                      {
                        validator: (_, value) => {
                          const year = form.getFieldValue("year");
                          if (value && year) {
                            const title = `${value}-${year}`;
                            const titleExists = existingPeriods.some(
                              (period) => period.title === title
                            );
                            if (titleExists) {
                              return Promise.reject(
                                new Error(
                                  "Đợt đăng ký này đã tồn tại trong năm đã chọn"
                                )
                              );
                            }
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Select
                      placeholder="Chọn đợt đăng ký..."
                      onChange={() => {
                        // Trigger validation for year field when period changes
                        form.validateFields(["year"]);
                      }}
                      options={[
                        { label: "Đợt 1", value: "Đợt 1" },
                        { label: "Đợt 2", value: "Đợt 2" },
                        { label: "Đợt 3", value: "Đợt 3" },
                        { label: "Đợt 4", value: "Đợt 4" },
                        { label: "Đợt 5", value: "Đợt 5" },
                        { label: "Đợt 6", value: "Đợt 6" },
                        { label: "Đợt 7", value: "Đợt 7" },
                        { label: "Đợt 8", value: "Đợt 8" },
                        { label: "Đợt 9", value: "Đợt 9" },
                        { label: "Đợt 10", value: "Đợt 10" },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Năm học"
                    name="year"
                    dependencies={["period"]}
                    rules={[
                      { required: true, message: "Vui lòng chọn năm học" },
                      {
                        validator: (_, value) => {
                          const period = form.getFieldValue("period");
                          if (value && period) {
                            const title = `${period}-${value}`;
                            const titleExists = existingPeriods.some(
                              (period) => period.title === title
                            );
                            if (titleExists) {
                              return Promise.reject(
                                new Error(
                                  "Đợt đăng ký này đã tồn tại trong năm đã chọn"
                                )
                              );
                            }
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Select
                      placeholder="Chọn năm học..."
                      onChange={() => {
                        // Trigger validation for period field when year changes
                        form.validateFields(["period"]);
                      }}
                      options={(() => {
                        const currentYear = new Date().getFullYear();
                        const years = [];
                        // Generate options for current year and next 5 years
                        for (let i = 0; i < 6; i++) {
                          const year = currentYear + i;
                          years.push({
                            label: year.toString(),
                            value: year.toString(),
                          });
                        }
                        return years;
                      })()}
                    />
                  </Form.Item>
                </Col>
              </Row>

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
