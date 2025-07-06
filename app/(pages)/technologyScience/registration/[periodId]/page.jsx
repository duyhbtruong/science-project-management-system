"use client";

import {
  Form,
  Input,
  Space,
  Spin,
  DatePicker,
  App,
  Alert,
  Row,
  Col,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getPeriodById,
  updatePeriodById,
  getAllPeriods,
} from "@/service/registrationService";
import dayjs from "dayjs";
import { SubmitButton } from "@/components/submit-button";
import { FileTextIcon } from "lucide-react";

export default function EditPeriodScreen({ params }) {
  const periodId = params.periodId;
  const router = useRouter();
  const [form] = Form.useForm();
  const [period, setPeriod] = useState();
  const [existingPeriods, setExistingPeriods] = useState([]);
  const { message } = App.useApp();

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

    // Parse period and year from title (e.g., "Đợt 1-2025" -> period: "Đợt 1", year: "2025")
    const titleParts = period.title.split("-");
    const periodPart = titleParts[0]?.trim();
    const yearPart = titleParts[1]?.trim();

    form.setFieldsValue({
      period: periodPart,
      year: yearPart,
      startDate: dayjs(period.startDate),
      endDate: dayjs(period.endDate),
      reviewDeadline: dayjs(period.reviewDeadline),
      submitDeadline: dayjs(period.submitDeadline),
      appraiseDeadline: dayjs(period.appraiseDeadline),
    });
  }, [period]);

  const onFinish = async (formValues) => {
    // Combine period and year to create title
    const title = `${formValues.period}-${formValues.year}`;

    // Check if title already exists (excluding current period)
    const titleExists = existingPeriods.some(
      (existingPeriod) =>
        existingPeriod.title === title && existingPeriod._id !== periodId
    );
    if (titleExists) {
      message.open({
        type: "error",
        content: "Tên đợt đăng ký đã tồn tại. Vui lòng chọn đợt hoặc năm khác.",
        duration: 3,
      });
      return;
    }

    let updatedPeriod = {
      title: title,
      startDate: formValues.startDate.format("YYYY-MM-DD"),
      endDate: formValues.endDate.format("YYYY-MM-DD"),
      reviewDeadline: formValues.reviewDeadline.format("YYYY-MM-DD"),
      submitDeadline: formValues.submitDeadline.format("YYYY-MM-DD"),
      appraiseDeadline: formValues.appraiseDeadline.format("YYYY-MM-DD"),
    };

    let res = await updatePeriodById(periodId, updatedPeriod);

    if (res.status === 200) {
      res = await res.json();
      const { message: messageApi } = res;
      message
        .open({
          type: "success",
          content: messageApi,
          duration: 2,
        })
        .then(() => router.back());
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
                        {
                          required: true,
                          message: "Vui lòng chọn đợt đăng ký",
                        },
                        {
                          validator: (_, value) => {
                            const year = form.getFieldValue("year");
                            if (value && year) {
                              const title = `${value}-${year}`;
                              const titleExists = existingPeriods.some(
                                (existingPeriod) =>
                                  existingPeriod.title === title &&
                                  existingPeriod._id !== periodId
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
                                (existingPeriod) =>
                                  existingPeriod.title === title &&
                                  existingPeriod._id !== periodId
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
                    <SubmitButton form={form}>Cập nhật</SubmitButton>
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
