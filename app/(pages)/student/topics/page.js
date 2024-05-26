"use client";

import {
  AlignLeftOutlined,
  CodeOutlined,
  IdcardOutlined,
  MailOutlined,
  MinusCircleOutlined,
  PhoneOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Divider, FloatButton, Form, Input, Select, Space } from "antd";

export default function TopicPage() {
  const onFinish = () => {};
  const onFinishFailed = () => {};

  return (
    <div className="bg-gray-100">
      {/* Column */}
      <div className="mx-32 py-6">
        <div className="flex justify-center text-xl font-semibold pb-6">
          ĐĂNG KÝ ĐỀ TÀI
        </div>

        <div className="flex justify-center">
          <Form
            name="register-topic"
            className="py-2 px-4 w-[640px] bg-white rounded-md"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            autoComplete="off"
            initialValues={{ references: [{}], participants: [{}] }}
          >
            <Divider orientation="center">Thông tin Chủ nhiệm đề tài</Divider>
            <Form.Item label="Email" name="email" rules={[{ required: true }]}>
              <Input
                disabled
                prefix={<MailOutlined className="text-gray-400" />}
              />
            </Form.Item>
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[{ required: true }]}
            >
              <Input
                disabled
                prefix={<UserOutlined className="text-gray-400" />}
              />
            </Form.Item>
            <Form.Item label="Số điện thoại liên lạc" name="phone">
              <Input
                prefix={<PhoneOutlined className="text-gray-400" rotate={90} />}
              />
            </Form.Item>
            <Form.Item
              label="Đơn vị"
              name="faculty"
              rules={[{ required: true }]}
            >
              <Input
                disabled
                prefix={<CodeOutlined className="text-gray-400" />}
              />
            </Form.Item>
            <Form.Item
              label="Chương trình đào tạo"
              name="educationProgram"
              rules={[{ required: true }]}
            >
              <Input
                disabled
                prefix={<IdcardOutlined className="text-gray-400" />}
              />
            </Form.Item>

            <Divider orientation="center">Thông tin Đề tài</Divider>
            <Form.Item
              label="Tên đề tài (tiếng Việt) - ghi bằng IN HOA"
              name="vietnameseName"
              rules={[
                {
                  required: true,
                  message: "Tên đề tài không được để trống.",
                },
                {
                  validator(_, value) {
                    if (value !== value?.toUpperCase()) {
                      return Promise.reject(
                        new Error("Tên đề tài phải là chữ in hoa.")
                      );
                    } else return Promise.resolve();
                  },
                },
              ]}
            >
              <Input prefix={<AlignLeftOutlined className="text-gray-400" />} />
            </Form.Item>

            <Form.Item
              label="Tên đề tài (tiếng Anh) - ghi bằng IN HOA"
              name="englishName"
              rules={[
                {
                  required: true,
                  message: "Tên đề tài không được để trống.",
                },
                {
                  validator(_, value) {
                    if (value !== value?.toUpperCase()) {
                      return Promise.reject(
                        new Error("Tên đề tài phải là chữ in hoa.")
                      );
                    } else return Promise.resolve();
                  },
                },
              ]}
            >
              <Input prefix={<AlignLeftOutlined className="text-gray-400" />} />
            </Form.Item>

            <Form.Item
              label="Loại hình nghiên cứu"
              name="type"
              rules={[
                {
                  required: true,
                  message: "Không được để trống loại hình nghiên cứu.",
                },
              ]}
            >
              <Select
                options={[{ value: "basic", label: "Nghiên cứu cơ bản" }]}
              />
            </Form.Item>

            <Form.Item
              label="Tóm tắt nội dung đề tài"
              name="summary"
              rules={[
                {
                  required: true,
                  message: "Không được để trống tóm tắt đề tài.",
                },
              ]}
            >
              <Input.TextArea showCount rows={5} style={{ resize: "none" }} />
            </Form.Item>

            <Form.List
              name="references"
              rules={[
                {
                  validator: async (_, references) => {
                    if (!references) {
                      return Promise.reject(
                        new Error("Phải có ít nhất 1 tài liệu tham khảo chính.")
                      );
                    } else if (references.length > 5) {
                      return Promise.reject(
                        new Error("Tối đa nhập 5 tài liệu tham khảo chính.")
                      );
                    }
                  },
                },
              ]}
            >
              {(references, { add, remove }, { errors }) => (
                <>
                  {references.map((reference, index) => (
                    <Form.Item
                      label={index == 0 ? "Tài liệu tham khảo" : null}
                      required={true}
                    >
                      <Form.Item
                        key={reference.key}
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message:
                              "Nhập tài liệu tham khảo hoặc xóa trường này đi.",
                          },
                        ]}
                        noStyle
                      >
                        <Input
                          placeholder={`[${index + 1}] Tài liệu tham khảo...`}
                          style={{
                            width: "95%",
                          }}
                        />
                      </Form.Item>
                      {references.length > 1 && (
                        <MinusCircleOutlined
                          className="ml-2"
                          onClick={() => remove(reference.name)}
                        />
                      )}
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{
                        width: "60%",
                      }}
                      icon={<PlusOutlined />}
                    >
                      Thêm tài liệu
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.Item
              label="Dự kiến kết quả"
              name="expectedResult"
              rules={[
                {
                  required: true,
                  message: "Không được để trống nội dung dự kiến kết quả.",
                },
              ]}
            >
              <Input.TextArea showCount rows={5} style={{ resize: "none" }} />
            </Form.Item>

            <Form.List
              name="participants"
              rules={[
                {
                  validator: async (_, participants) => {
                    if (!participants) {
                      return Promise.reject(
                        new Error("Phải có ít nhất 1 thành viên tham gia")
                      );
                    } else if (participants.length > 3) {
                      return Promise.reject(
                        new Error(
                          "Tối đa được 3 thành viên tham gia nghiên cứu đề tài."
                        )
                      );
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item
                      label={
                        index == 0
                          ? "Danh sách thành viên đề tài (Kể cả CNĐT) - mỗi dòng một thành viên"
                          : null
                      }
                      required={true}
                      key={field.key}
                    >
                      <Form.Item
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message:
                              "Nhập tên thành viên hoặc xóa dòng này nếu không cần thiết.",
                          },
                        ]}
                        noStyle
                      >
                        <Input
                          placeholder={`Nhập tên thành viên thứ ${
                            index + 1
                          }... `}
                          style={{
                            width: "95%",
                          }}
                        />
                      </Form.Item>
                      {fields.length > 1 && (
                        <MinusCircleOutlined
                          className="ml-2"
                          onClick={() => remove(field.name)}
                        />
                      )}
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{
                        width: "60%",
                      }}
                      icon={<PlusOutlined />}
                    >
                      Thêm thành viên
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Divider orientation="center">Thông tin GVHD</Divider>
            <Form.Item
              label="Email GVHD"
              name="instructorEmail"
              rules={[
                { required: true, message: "Không được để trống email GVHD." },
              ]}
            >
              <Input prefix={<MailOutlined className="text-gray-400" />} />
            </Form.Item>
            <Form.Item label="Họ và Tên GVHD" name="instructorName">
              <Input
                disabled
                prefix={<UserOutlined className="text-gray-400" />}
              />
            </Form.Item>
            <Form.Item
              label="Học hàm, học vị của GVHD"
              name="instructorAcademicRank"
            >
              <Input
                disabled
                prefix={<IdcardOutlined className="text-gray-400" />}
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button type="link">Tới trang Quản lý Đồ án</Button>
              </Space>
            </Form.Item>
          </Form>
          <FloatButton.BackTop />
        </div>
      </div>
    </div>
  );
}
