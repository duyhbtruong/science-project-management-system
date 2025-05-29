"use client";

import { useState, useTransition } from "react";
import { Alert, Button, Form, Input } from "antd";
import { login } from "@/app/(pages)/auth/login/page";
import { LockIcon, MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const ROLE_DEFAULT_PATH = {
  admin: "/admin/accounts",
  student: "/student/topics",
  instructor: "/instructor/topics",
  technologyScience: "/technologyScience/dashboard",
  "appraisal-board": "/appraisal-board/appraise",
};

export const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const [loginError, setLoginError] = useState();
  const router = useRouter();

  const onFinish = (values) => {
    startTransition(async () => {
      const result = await login(values);
      if (result.error) {
        setLoginError(result.error);
      } else if (result.success) {
        // First push to root to trigger middleware
        router.push("/");
        // Then refresh to update the session
        router.refresh();
      }
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
            prefix={<MailIcon className="mr-1 text-border size-4" />}
            placeholder="Nhập tên tài khoản..."
            disabled={isPending}
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Chưa nhập mật khẩu!" }]}
          onFocus={() => setLoginError()}
        >
          <Input.Password
            prefix={<LockIcon className="mr-1 text-border size-4" />}
            placeholder="Nhập mật khẩu..."
            disabled={isPending}
          />
        </Form.Item>

        {loginError && (
          <Alert message={loginError} type="error" showIcon className="mb-4" />
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={isPending}
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
