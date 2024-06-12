"use client";

import { useSession } from "next-auth/react";
import {
  AlignLeftOutlined,
  CodeOutlined,
  IdcardOutlined,
  MailOutlined,
  MinusCircleOutlined,
  PhoneOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Divider, Form, Input, Select, Space } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStudentAccount } from "@/service/studentService";
import { getAccountByEmail } from "@/service/accountService";
import { createTopic } from "@/service/topicService";

const emailRegex = /\S+@\S+\.\S+/;

export default function TopicPage() {
  const router = useRouter();
  const session = useSession();
  const account = session.data?.user;
  const [form] = Form.useForm();
  const [student, setStudent] = useState();
  const [instructor, setInstructor] = useState();
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    if (!account) return;

    async function fetchUserData() {
      setStudent(await getStudentAccount(account.id));
    }
    fetchUserData();
  }, [account]);

  const onFinish = (values) => {
    // console.log(values.educationProgram);

    const formData = {
      vietnameseName: values.vietnameseName,
      englishName: values.englishName,
      type: values.type,
      summary: values.summary,
      reference: values.references,
      expectedResult: values.expectedResult,
      participants: values.participants,
      owner: account.id,
      instructor: instructor.instructor._id,
    };

    // console.log(formData);
    const res = createTopic(formData);
    console.log(">>> topic create res: ", res);
  };

  const handleInstructorEmailOnChange = async (event) => {
    console.log(event.target.value);
    if (event.target.value === "") {
      setErrorMessage("Không được để trống email GVHD.");
      return;
    }

    // console.log(emailRegex.test(event.target.value));

    if (!emailRegex.test(event.target.value)) {
      setErrorMessage("Sai định dạng email!");
      return;
    }

    // console.log(">>>> ins email: ", event.target.value);

    const res = await getAccountByEmail(event.target.value);
    // console.log(res);
    if (res.message) {
      setErrorMessage("Email không tồn tại!");
      return;
    }

    if (res.account?.role !== "instructor") {
      setErrorMessage("Email không phải của GVHD!");
      return;
    }

    setInstructor(res);
    setErrorMessage(null);
  };

  // console.log(student);
  // console.log(instructor);

  return (
    <div className="bg-gray-100">
      {/* Column */}
      <div className="mx-32 py-6">
        <div className="flex justify-center text-xl font-semibold pb-6">
          ĐĂNG KÝ ĐỀ TÀI
        </div>
        {student && (
          <div className="flex justify-center">
            <Form
              form={form}
              name="register-topic"
              className="py-2 px-4 w-[640px] bg-white rounded-md"
              onFinish={onFinish}
              layout="vertical"
              autoComplete="off"
              initialValues={{
                email: account?.email,
                name: account?.name,
                phone: student?.phone,
                educationProgram: student?.educationProgram,
                faculty: student?.faculty,
                references: [""],
                participants: [""],
                instructorName: instructor?.account.name,
                instructorAcademicRank: instructor?.instructor.academicRank,
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
                  prefix={
                    <PhoneOutlined className="text-gray-400" rotate={90} />
                  }
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
                  prefix={<AlignLeftOutlined className="text-gray-400" />}
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
                  prefix={<AlignLeftOutlined className="text-gray-400" />}
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
                  options={[{ value: "basic", label: "Nghiên cứu cơ bản" }]}
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
                ]}
              >
                <Input.TextArea showCount rows={5} style={{ resize: "none" }} />
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
                    {references.map((reference, index) => (
                      <Form.Item
                        label={index == 0 ? "Tài liệu tham khảo" : null}
                        required={true}
                        key={reference.key}
                      >
                        <Form.Item
                          {...reference}
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
                hasFeedback
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
                          {...field}
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
                            prefix={<TeamOutlined className="text-gray-400" />}
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
                hasFeedback
                help={errorMessage}
                validateStatus={errorMessage ? "error" : "success"}
                rules={[{ required: true }]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  onChange={handleInstructorEmailOnChange}
                  onSubmit={(event) => {
                    if (event.target.value === "") {
                      setErrorMessage("Không được để trống email GVHD.");
                      return;
                    }
                  }}
                />
              </Form.Item>
              {/* <Form.Item label="Họ và Tên GVHD" name="instructorName">
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
              </Form.Item> */}

              <Form.Item>
                <Space>
                  <SubmitButton form={form}>Submit</SubmitButton>
                  <Button
                    type="link"
                    onClick={() => router.push("/student/topics/1")}
                  >
                    Tới trang Quản lý Đồ án
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </div>
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
