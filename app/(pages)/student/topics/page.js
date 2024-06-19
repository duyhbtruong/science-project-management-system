"use client";

import { useSession } from "next-auth/react";
import {
  AlignLeftOutlined,
  ArrowRightOutlined,
  CodeOutlined,
  IdcardOutlined,
  MailOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  message,
} from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStudentAccount } from "@/service/studentService";
import { createTopic } from "@/service/topicService";

export default function TopicPage() {
  const router = useRouter();
  const session = useSession();
  const account = session.data?.user;
  const [form] = Form.useForm();
  const [student, setStudent] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  async function fetchUserData() {
    setStudent(await getStudentAccount(account.id));
  }

  useEffect(() => {
    if (!account) return;
    fetchUserData();
  }, [account]);

  useEffect(() => {
    if (!student) return;

    form.setFieldsValue({
      name: account.name,
      email: account.email,
      faculty: student.faculty,
      educationProgram: student.educationProgram,
    });
  }, [student]);

  const onFinish = async (values) => {
    const formData = {
      vietnameseName: values.vietnameseName,
      englishName: values.englishName,
      type: values.type,
      summary: values.summary,
      reference: values.references,
      expectedResult: values.expectedResult,
      participants: values.participants,
      owner: student._id,
      instructor: {
        name: values.instructorName,
        email: values.instructorEmail,
        academicRank: values.instructorAcademicRank,
      },
    };

    const res = await createTopic(formData);
    const { message } = res;
    messageApi
      .open({
        type: "success",
        content: message,
        duration: 2,
      })
      .then(() => {
        fetchUserData();
      });
  };
  console.log(student);

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-45.8px)]">
      {/* Column */}
      {contextHolder}
      <div className="mx-32 py-6">
        <div className="flex justify-center text-xl font-semibold pb-6">
          Đăng ký Đề tài
        </div>
        <Spin spinning={student ? false : true}>
          <div className="flex justify-center">
            <Form
              form={form}
              name="register-topic"
              className="py-2 px-4 w-[640px] bg-white rounded-md shadow-md"
              onFinish={onFinish}
              layout="vertical"
              autoComplete="off"
              initialValues={{
                email: account?.email,
                name: account?.name,
                educationProgram: student?.educationProgram,
                faculty: student?.faculty,
                references: [""],
                participants: [""],
              }}
            >
              <Divider orientation="center">Thông tin Chủ nhiệm đề tài</Divider>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true }]}
              >
                <Input
                  disabled
                  prefix={<MailOutlined className="text-border" />}
                />
              </Form.Item>
              <Form.Item
                label="Họ và tên"
                name="name"
                rules={[{ required: true }]}
              >
                <Input
                  disabled
                  prefix={<UserOutlined className="text-border" />}
                />
              </Form.Item>
              <Form.Item
                label="Đơn vị"
                name="faculty"
                rules={[{ required: true }]}
              >
                <Input
                  disabled
                  prefix={<CodeOutlined className="text-border" />}
                />
              </Form.Item>
              <Form.Item
                label="Chương trình đào tạo"
                name="educationProgram"
                rules={[{ required: true }]}
              >
                <Input
                  disabled
                  prefix={<IdcardOutlined className="text-border" />}
                />
              </Form.Item>

              <Divider orientation="center">Thông tin Đề tài</Divider>
              <Form.Item
                label="Tên đề tài (tiếng Việt) - ghi bằng IN HOA"
                name="vietnameseName"
                hasFeedback
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
                <Input
                  placeholder="Nhập tên tiếng Việt của đề tài..."
                  prefix={<AlignLeftOutlined className="text-border" />}
                />
              </Form.Item>

              <Form.Item
                label="Tên đề tài (tiếng Anh) - ghi bằng IN HOA"
                name="englishName"
                hasFeedback
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
                <Input
                  placeholder="Nhập tên tiếng Anh của đề tài..."
                  prefix={<AlignLeftOutlined className="text-border" />}
                />
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
                  placeholder="Chọn loại hình nghiên cứu..."
                  options={[
                    { value: "Nghiên cứu cơ bản", label: "Nghiên cứu cơ bản" },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Tóm tắt nội dung đề tài"
                name="summary"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Không được để trống tóm tắt đề tài.",
                  },
                  {
                    max: 300,
                    message: "Không được dài quá 300 chữ!",
                  },
                ]}
              >
                <Input.TextArea
                  showCount
                  maxLength={300}
                  rows={5}
                  style={{ resize: "none" }}
                />
              </Form.Item>

              <Form.List
                name="references"
                hasFeedback
                rules={[
                  {
                    validator: async (_, references) => {
                      if (!references) {
                        return Promise.reject(
                          new Error(
                            "Phải có ít nhất 1 tài liệu tham khảo chính."
                          )
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
                    {references.map((reference, index) => {
                      const { key, ...restProps } = reference;
                      return (
                        <Form.Item
                          label={index == 0 ? "Tài liệu tham khảo" : null}
                          required={true}
                          key={key}
                        >
                          <Form.Item
                            {...restProps}
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
                              placeholder={`[${
                                index + 1
                              }] Tài liệu tham khảo...`}
                              style={{
                                width: references.length < 2 ? "100%" : "95%",
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
                      );
                    })}
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
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Không được để trống nội dung dự kiến kết quả.",
                  },
                  {
                    max: 300,
                    message: "Không được dài quá 300 chữ!",
                  },
                ]}
              >
                <Input.TextArea
                  showCount
                  maxLength={300}
                  rows={5}
                  style={{ resize: "none" }}
                />
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
                    {fields.map((field, index) => {
                      const { key, ...restProps } = field;
                      return (
                        <Form.Item
                          label={
                            index == 0
                              ? "Danh sách thành viên đề tài (Kể cả CNĐT) - mỗi dòng một thành viên"
                              : null
                          }
                          required={true}
                          key={key}
                        >
                          <Form.Item
                            {...restProps}
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
                                width: fields.length < 2 ? "100%" : "95%",
                              }}
                              prefix={<TeamOutlined className="text-border" />}
                            />
                          </Form.Item>
                          {fields.length > 1 && (
                            <MinusCircleOutlined
                              className="ml-2"
                              onClick={() => remove(field.name)}
                            />
                          )}
                        </Form.Item>
                      );
                    })}
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
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Không được để trống email GVHD!",
                  },
                  {
                    type: "email",
                    message: "Sai định dạng email!",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-border" />}
                  placeholder="Nhập email giáo viên hướng dẫn..."
                />
              </Form.Item>
              <Form.Item
                label="Họ và Tên GVHD"
                name="instructorName"
                rules={[
                  {
                    required: true,
                    message: "Không được để trống tên GVHD!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-border" />}
                  placeholder="Nhập tên giáo viên hướng dẫn..."
                />
              </Form.Item>
              <Form.Item
                label="Học hàm, học vị của GVHD"
                name="instructorAcademicRank"
                rules={[
                  {
                    required: true,
                    message: "Chọn học hàm, học vị của GVHD...",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn học hàm, học vị..."
                  options={[
                    { title: "ThS", value: "ThS" },
                    { title: "TS", value: "TS" },
                    { title: "GS.TS", value: "GS.TS" },
                    { title: "PGS.TS", value: "PGS.TS" },
                  ]}
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <SubmitButton form={form}>Đăng ký</SubmitButton>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </Spin>
      </div>

      <Modal
        title="Đăng ký đề tài"
        open={student ? (student.topicId === null ? false : true) : false}
        closable={false}
        footer={[
          <Button
            icon={<ArrowRightOutlined />}
            key="link"
            type="primary"
            href={student ? `/student/topics/${student.topicId}` : ``}
          >
            Đến trang Quản lý đề tài cá nhân
          </Button>,
        ]}
      >
        <p>Bạn đã đăng ký đề tài Nghiên cứu khoa học!</p>
        <p>Vui lòng đến trang Quản lý đề tài cá nhân.</p>
      </Modal>
    </div>
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
