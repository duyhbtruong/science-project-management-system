"use client";

import { useState, useTransition } from "react";
import { Button, Form, Input } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

export const LoginForm = () => {
  const [isPending, startTransition] = useTransition();

  const onFinish = (values) => {
    startTransition(async () => {
      // const res = await fetch(`http://localhost:3000/api/auth`, {
      //   method:
      // })
    });
  };

  const onFinishFailed = (error) => {
    console.log("Error: ", error);
  };

  return (
    <div className="mx-auto my-4 w-[400px] space-y-4">
      <Form
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Chưa nhập email!" },
            { type: "email", message: "Sai định dạng email!" },
          ]}
        >
          <Input placeholder="testing@example.com" disabled={isPending} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Chưa nhập mật khẩu!" },
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
          <Input.Password placeholder="123456" disabled={isPending} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" block disabled={isPending}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
