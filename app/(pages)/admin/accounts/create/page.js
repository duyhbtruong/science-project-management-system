"use client";

import { postAppraiseAccount } from "@/service/appraiseService";
import { postStudentAccount } from "@/service/studentService";
import { postTechnologyScienceAccount } from "@/service/technologyScienceService";
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
              type: "info",
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
              type: "info",
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
              type: "info",
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

  const onFinishFailed = (errorInfo) => {
    messageApi.error("Chưa nhập đầy đủ thông tin.");
  };

  return (
    <div className="py-6 flex flex-col gap-6 items-center justify-center bg-gray-100">
      {contextHolder}
      <div className="text-lg font-semibold">Form đăng ký đề tài</div>
      <Card>
        <Form
          style={{
            width: 500,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
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
                label="Mã số Phòng Thẩm định"
                name="appraiseId"
                rules={[
                  {
                    required: true,
                    message: "Chưa nhập Mã số Phòng Thẩm định.",
                  },
                ]}
              >
                <Input placeholder="Nhập mã số Phòng Thẩm định..." />
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
      </Card>
    </div>
  );
}
