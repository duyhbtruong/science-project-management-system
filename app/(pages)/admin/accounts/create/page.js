"use client";

import { postAppraiseAccount } from "@/service/appraiseService";
import { postStudentAccount } from "@/service/studentService";
import { postTechnologyScienceAccount } from "@/service/technologyScienceService";
import {
  CodeOutlined,
  IdcardOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Form, Input, Select, message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateAccount() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [role, setRole] = useState("student");

  const onFinish = async (values) => {
    try {
      switch (role) {
        case "student": {
          const res = await postStudentAccount(values);
          if (res.status === 201) {
            const { message } = await res.json();
            messageApi
              .open({
                type: "success",
                content: message,
                duration: 2,
              })
              .then(() => router.push("/admin/accounts"));
          } else {
            const { message } = await res.json();
            messageApi.open({
              type: "error",
              content: message,
            });
          }
          break;
        }
        case "technologyScience": {
          const res = await postTechnologyScienceAccount(values);
          if (res.status === 201) {
            const { message } = await res.json();
            messageApi
              .open({
                type: "success",
                content: message,
                duration: 2,
              })
              .then(() => router.push("/admin/accounts"));
          } else {
            const { message } = await res.json();
            messageApi.open({
              type: "error",
              content: message,
            });
          }
          break;
        }
        case "appraise": {
          const res = await postAppraiseAccount(values);
          if (res.status === 201) {
            const { message } = await res.json();
            messageApi
              .open({
                type: "success",
                content: message,
                duration: 2,
              })
              .then(() => router.push("/admin/accounts"));
          } else {
            const { message } = await res.json();
            messageApi.open({
              type: "error",
              content: message,
            });
          }
          break;
        }
        default:
          messageApi.error("Something went wrong!");
      }
    } catch (error) {
      console.log("Errors creating account: ", error);
    }
  };

  return (
    <div className="py-6 flex flex-col gap-6 items-center justify-center bg-gray-100 min-h-[calc(100vh-45.8px)]">
      {contextHolder}
      <div className="text-lg font-semibold">Tạo mới tài khoản</div>
      <Card>
        <Form
          style={{
            width: 500,
          }}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          initialValues={{ role: role }}
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
            hasFeedback
          >
            <Input
              prefix={<MailOutlined className="text-border" />}
              placeholder="Nhập email..."
            />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone" hasFeedback>
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
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined className="text-border" />} />
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
                <Input
                  prefix={<IdcardOutlined className="text-border" />}
                  placeholder="Nhập MSSV..."
                />
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
                label="Mã số Phòng Thẩm định"
                name="appraisalBoardId"
                rules={[
                  {
                    required: true,
                    message: "Chưa nhập Mã số Phòng Thẩm định.",
                  },
                ]}
                hasFeedback
              >
                <Input
                  prefix={<IdcardOutlined className="text-border" />}
                  placeholder="Nhập mã số Phòng Thẩm định..."
                />
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
                hasFeedback
              >
                <Input
                  prefix={<IdcardOutlined className="text-border" />}
                  placeholder="Nhập mã số Phòng Khoa học Công nghệ..."
                />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
