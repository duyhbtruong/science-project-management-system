"use client";

import { useState } from "react";
import { Alert, Button, Card, Form, Input } from "antd";
import { MailIcon } from "lucide-react";
import { AppLogo } from "@/components/logo";
import Image from "next/image";
import Link from "next/link";
import { forgotPassword } from "@/service/accountService";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const response = await forgotPassword(values.email);
      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: data.message,
          resetLink: data.resetLink, // Only available in development
        });
      } else {
        setStatus({
          type: "error",
          message: data.message || "Đã xảy ra lỗi. Vui lòng thử lại.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Đã xảy ra lỗi. Vui lòng thử lại.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="shadow-md w-[400px]">
        <div className="flex gap-x-2 justify-center text-2xl font-bold mb-6">
          <Image
            src="/logo.svg"
            alt="logo"
            width="0"
            height="0"
            className="w-[50px] h-auto"
          />
          <AppLogo fontSize={`text-3xl`} />
        </div>

        <h2 className="text-xl font-semibold text-center mb-4">
          Quên mật khẩu
        </h2>

        {status?.type === "success" ? (
          <div className="space-y-4">
            <Alert
              message="Đã gửi email đặt lại mật khẩu"
              description={status.message}
              type="success"
              showIcon
            />

            {/* Only show in development */}
            {status.resetLink && process.env.NODE_ENV === "development" && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-sm break-all">
                <p className="font-semibold">
                  Link đặt lại mật khẩu (chỉ hiển thị trong môi trường phát
                  triển):
                </p>
                <a
                  href={status.resetLink}
                  className="text-blue-600 hover:underline"
                >
                  {status.resetLink}
                </a>
              </div>
            )}

            <div className="mt-4 text-center">
              <Link
                href="/auth/login"
                className="text-blue-600 hover:underline"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4 text-center">
              Nhập email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt
              lại mật khẩu.
            </p>

            <Form onFinish={onFinish} autoComplete="off" layout="vertical">
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không đúng định dạng" },
                ]}
              >
                <Input
                  prefix={<MailIcon className="mr-1 text-border size-4" />}
                  placeholder="Nhập email..."
                  disabled={isLoading}
                  spellCheck={false}
                />
              </Form.Item>

              {status?.type === "error" && (
                <Alert
                  message={status.message}
                  type="error"
                  showIcon
                  className="mb-4"
                />
              )}

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full"
                  loading={isLoading}
                >
                  Gửi liên kết đặt lại mật khẩu
                </Button>
              </Form.Item>

              <div className="text-center mt-4">
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:underline"
                >
                  Quay lại đăng nhập
                </Link>
              </div>
            </Form>
          </>
        )}
      </Card>
    </div>
  );
}
