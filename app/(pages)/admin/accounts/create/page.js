"use client";

import { Button, Card, Form, Input, Select, message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateAccount() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [role, setRole] = useState("student");

  // console.log(role);

  const onFinish = async (values) => {
    const { name, email, password, phone, role } = values;
    console.log("values: ", JSON.stringify(values));
    try {
      const accountRes = await fetch(`http://localhost:3000/api/accounts`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ name, email, password, phone, role }),
      });

      if (accountRes.status === 409) {
        messageApi.open({
          type: "error",
          content: "Email aleady in use!",
        });
      } else if (accountRes.status === 201) {
        const accountId = await accountRes.json();
        if (role === "student") {
          const { studentId, faculty, educationProgram } = values;
          const studentRes = await fetch(`http://localhost:3000/api/students`, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              studentId,
              faculty,
              educationProgram,
              accountId,
            }),
          });

          if (studentRes.status === 409) {
            messageApi.open({
              type: "error",
              content: "Student ID aleady exists!",
            });
          } else {
            router.refresh();
            router.push("/admin/accounts");
          }
        }

        if (role === "instructor") {
          const { instructorId, faculty, academicRank } = values;
          const instructorRes = await fetch(
            `http://localhost:3000/api/instructors`,
            {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                instructorId,
                faculty,
                academicRank,
                accountId,
              }),
            }
          );

          if (instructorRes.status === 409) {
            messageApi.open({
              type: "error",
              content: "Instructor ID aleady exists!",
            });
          } else {
            router.refresh();
            router.push("/admin/accounts");
          }
        }
      }
    } catch (error) {
      console.log("Errors creating account: ", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="mt-8 flex items-center justify-center">
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
                { value: "instructor", label: "GVHD" },
                { value: "training", label: "Phòng Đào tạo" },
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

          {role === "instructor" && (
            <>
              <Form.Item
                label="Mã số GVHD"
                name="instructorId"
                rules={[{ required: true, message: "Chưa nhập Mã số GVHD." }]}
              >
                <Input placeholder="Nhập mã số GVHD..." />
              </Form.Item>

              <Form.Item
                label="Khoa"
                name="faculty"
                rules={[{ required: true, message: "Chưa nhập khoa." }]}
              >
                <Input placeholder="Nhập đơn vị khoa..." />
              </Form.Item>

              <Form.Item
                label="Học hàm, học vị"
                name="academicRank"
                rules={[
                  { required: true, message: "Chưa nhập học hàm, học vị." },
                ]}
              >
                <Input placeholder="Nhập học hàm, học vị..." />
              </Form.Item>
            </>
          )}

          <Form.Item>
            {contextHolder}
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
