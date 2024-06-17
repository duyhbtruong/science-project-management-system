"use client";

import { useState, useTransition } from "react";
import { Alert, Button, Form, Input } from "antd";
import { login } from "@/app/(pages)/auth/login/page";
import { LockOutlined, MailOutlined } from "@ant-design/icons";

export const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [loginError, setLoginError] = useState();

  const onFinish = (values) => {
    startTransition(async () => {
      setLoginError(await login(values));
    });
  };

  return (
    <div className="mx-auto my-8 w-[400px] space-y-4">
      <Form
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
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
          onFocus={() => setLoginError()}
        >
          <Input
            prefix={<MailOutlined className="text-border" />}
            placeholder="Nhập tên tài khoản..."
            disabled={isPending}
          />
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
          onFocus={() => setLoginError()}
        >
          <Input.Password
            prefix={<LockOutlined className="text-border" />}
            placeholder="Nhập mật khẩu..."
            disabled={isPending}
          />
        </Form.Item>
        {loginError && loginError?.error && (
          <Form.Item>
            <Alert message={loginError.error} type="error" showIcon />
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" block disabled={isPending} htmlType="submit">
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
