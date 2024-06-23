"use client";

import { getAccountById, updateAccountById } from "@/service/accountService";
import { validatePhoneNumber } from "@/utils/validator";
import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Form, Button, Input, message, Card, Select, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateAccount({ params }) {
  const id = params.id;
  const [messageApi, contextHolder] = message.useMessage();
  const [account, setAccount] = useState();
  const [student, setStudent] = useState();
  const [technologyScience, setTechnologyScience] = useState();
  const [appraise, setAppraise] = useState();
  const [role, setRole] = useState();
  const [form] = Form.useForm();

  const router = useRouter();

  const loadAccount = async () => {
    const response = await getAccountById(id);
    setAccount(response.account);
    setRole(response.account.role);
    setStudent(response.student);
    setTechnologyScience(response.technologyScience);
    setAppraise(response.appraise);
  };

  useEffect(() => {
    loadAccount();
  }, []);

  useEffect(() => {
    if (!account) return;

    form.setFieldsValue({
      name: account?.name,
      email: account?.email,
      phone: account?.phone,
      role: account?.role,
      studentId: student?.studentId,
      technologyScienceId: technologyScience?.technologyScienceId,
      appraisalBoardId: appraise?.appraisalBoardId,
      faculty: student?.faculty,
      educationProgram: student?.educationProgram,
    });
  }, [account]);

  const onFinish = async (values) => {
    const res = await updateAccountById(id, values);
    const { message } = res;
    messageApi
      .open({
        type: "success",
        content: message,
        duration: 2,
      })
      .then(() => router.push("/admin/accounts"));
  };

  return (
    <div className="py-6 flex flex-col gap-6 items-center justify-center bg-gray-100 min-h-[calc(100vh-45.8px)]">
      {contextHolder}
      <div className="text-lg font-semibold">Cập nhật tài khoản</div>
      <Card className="shadow-md">
        <Spin spinning={!account}>
          <Form
            form={form}
            style={{
              width: 500,
            }}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Tên tài khoản"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Chưa nhập tên tài khoản!",
                },
              ]}
              hasFeedback
            >
              <Input
                prefix={<UserOutlined className="text-border" />}
                placeholder="Nhập tên tài khoản..."
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Chưa nhập email",
                },
                {
                  type: "email",
                  message: "Sai định dạng email",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-border" />}
                placeholder="Nhập email..."
                disabled
              />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.resolve();
                    }
                    if (!validatePhoneNumber(value)) {
                      return Promise.reject(
                        new Error("Số điện thoại chỉ được chứa chữ số!")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              hasFeedback
            >
              <Input
                prefix={<PhoneOutlined rotate={90} className="text-border" />}
                placeholder="Nhập số điện thoại..."
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                {
                  validator(_, value) {
                    if (!value || value.length > 6) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu phải dài hơn 6 ký tự!")
                    );
                  },
                },
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="text-border" />}
              />
            </Form.Item>

            <Form.Item
              label="Chức năng"
              name="role"
              rules={[
                {
                  required: true,
                  message: "Chưa chọn chức năng!",
                },
              ]}
            >
              <Select
                placeholder="Chọn 1 chức năng"
                onChange={(value) => setRole(value)}
                options={[
                  { value: "student", label: "Sinh viên" },
                  {
                    value: "technologyScience",
                    label: "Phòng Khoa học Công nghệ",
                  },
                  { value: "appraise", label: "Phòng thẩm định" },
                ]}
                disabled
              />
            </Form.Item>

            {role === "student" && (
              <>
                <Form.Item
                  label="Mã số sinh viên"
                  name="studentId"
                  rules={[
                    { required: true, message: "Chưa nhập Mã số sinh viên." },
                  ]}
                  hasFeedback
                >
                  <Input placeholder="Nhập MSSV..." disabled />
                </Form.Item>

                <Form.Item
                  label="Khoa"
                  name="faculty"
                  rules={[{ required: true, message: "Chưa chọn khoa." }]}
                >
                  <Select
                    placeholder="Chọn khoa..."
                    options={[
                      {
                        value: "Công nghệ Phần mềm",
                        label: "Công nghệ Phần mềm",
                      },
                      {
                        value: "Hệ thống Thông tin",
                        label: "Hệ thống Thông tin",
                      },
                      {
                        value: "Kỹ thuật Máy tính",
                        label: "Kỹ thuật Máy tính",
                      },
                      {
                        value: "Mạng Máy tính và Truyền thông",
                        label: "Mạng Máy tính và Truyền thông",
                      },
                      {
                        value: "Khoa học Máy tính",
                        label: "Khoa học Máy tính",
                      },
                      {
                        value: "Khoa học và Kỹ thuật Thông tin",
                        label: "Khoa học và Kỹ thuật Thông tin",
                      },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label="Chương trình đào tạo"
                  name="educationProgram"
                  rules={[
                    {
                      required: true,
                      message: "Chưa chọn chương trình đào tạo.",
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn chương trình đào tạo..."
                    options={[
                      {
                        value: "Chất lượng cao",
                        label: "Chất lượng cao",
                      },
                      {
                        value: "Đại trà",
                        label: "Đại trà",
                      },
                    ]}
                  />
                </Form.Item>
              </>
            )}

            {role === "appraise" && (
              <>
                <Form.Item
                  label="Mã số Phòng thẩm định"
                  name="appraisalBoardId"
                  rules={[
                    {
                      required: true,
                      message: "Chưa nhập Mã số Phòng thẩm định.",
                    },
                  ]}
                >
                  <Input placeholder="Nhập mã số Phòng thẩm định..." disabled />
                </Form.Item>
              </>
            )}

            {role === "technologyScience" && (
              <>
                <Form.Item
                  label="Mã số Phòng Khoa học Công nghệ"
                  name="technologyScienceId"
                  rules={[
                    {
                      required: true,
                      message: "Chưa nhập Mã số Phòng Khoa học Công nghệ.",
                    },
                  ]}
                >
                  <Input
                    disabled
                    placeholder="Nhập mã số Phòng Khoa học Công nghệ..."
                  />
                </Form.Item>
              </>
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
}
