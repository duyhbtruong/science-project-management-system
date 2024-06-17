"use client";

import { getAccountById } from "@/service/accountService";
import { Form, Button, Input, message, Card, Select } from "antd";
import { useEffect, useState } from "react";

export default function UpdateAccount({ params }) {
  const id = params.id;
  const [messageApi, contextHolder] = message.useMessage();
  const [account, setAccount] = useState();
  const [student, setStudent] = useState();
  const [technologyScience, setTechnologyScience] = useState();
  const [appraise, setAppraise] = useState();
  const [role, setRole] = useState();

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

  const onFinish = async (values) => {};

  return (
    <div className="mt-8 flex items-center justify-center">
      {contextHolder}
      <Card>
        {account && (
          <Form
            style={{
              width: 500,
            }}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            initialValues={{
              name: account.name,
              email: account.email,
              phone: account.phone,
              role: account.role,
              studentId: student?.studentId,
              technologyScienceId: technologyScience?.technologyScienceId,
              appraisalBoardId: appraise?.appraisalBoardId,
              faculty: student?.faculty,
              educationProgram: student?.educationProgram,
            }}
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
            >
              <Input placeholder="Nhập tên tài khoản..." />
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
              <Input placeholder="Nhập email..." />
            </Form.Item>

            <Form.Item label="Số điện thoại" name="phone">
              <Input placeholder="123456789" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Chưa nhập mật khẩu!",
                },
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
            >
              <Input.Password />
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
                >
                  <Input placeholder="Nhập MSSV..." />
                </Form.Item>

                <Form.Item
                  label="Khoa"
                  name="faculty"
                  rules={[{ required: true, message: "Chưa chọn khoa." }]}
                >
                  <Input placeholder="Nhập đơn vị khoa..." />
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
                  <Input placeholder="Nhập chương trình đào tạo..." />
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
                  <Input placeholder="Nhập mã số Phòng thẩm định..." />
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
                  <Input placeholder="Nhập mã số Phòng Khoa học Công nghệ..." />
                </Form.Item>
              </>
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Submit
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
}
