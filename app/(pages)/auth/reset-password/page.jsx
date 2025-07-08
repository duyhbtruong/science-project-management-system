"use client";

import { useState, useEffect } from "react";
import { Alert, Button, Card, Form, Input } from "antd";
import { LockIcon } from "lucide-react";
import { AppLogo } from "@/components/logo";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/service/accountService";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [token, setToken] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      setStatus({
        type: "error",
        message: "Không tìm thấy token đặt lại mật khẩu. Vui lòng thử lại.",
      });
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const onFinish = async (values) => {
    if (!token) {
      setStatus({
        type: "error",
        message: "Không tìm thấy token đặt lại mật khẩu. Vui lòng thử lại.",
      });
      return;
    }

    if (values.newPassword !== values.confirmPassword) {
      setStatus({
        type: "error",
        message: "Mật khẩu xác nhận không khớp.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await resetPassword(token, values.newPassword);
      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Mật khẩu đã được đặt lại thành công.",
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
          Đặt lại mật khẩu
        </h2>

        {status?.type === "success" ? (
          <div className="space-y-4">
            <Alert
              message="Đặt lại mật khẩu thành công"
              description="Mật khẩu của bạn đã được đặt lại thành công. Bạn có thể đăng nhập bằng mật khẩu mới."
              type="success"
              showIcon
            />

            <div className="mt-4 text-center">
              <Link
                href="/auth/login"
                className="text-blue-600 hover:underline"
              >
                Đăng nhập
              </Link>
            </div>
          </div>
        ) : token ? (
          <>
            <p className="text-gray-600 mb-4 text-center">
              Nhập mật khẩu mới của bạn.
            </p>

            <Form onFinish={onFinish} autoComplete="off" layout="vertical">
              <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                ]}
              >
                <Input.Password
                  prefix={<LockIcon className="mr-1 text-border size-4" />}
                  placeholder="Nhập mật khẩu mới..."
                  disabled={isLoading}
                />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                rules={[
                  { required: true, message: "Vui lòng xác nhận mật khẩu" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                ]}
              >
                <Input.Password
                  prefix={<LockIcon className="mr-1 text-border size-4" />}
                  placeholder="Xác nhận mật khẩu mới..."
                  disabled={isLoading}
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
                  Đặt lại mật khẩu
                </Button>
              </Form.Item>
            </Form>
          </>
        ) : (
          <div className="space-y-4">
            <Alert
              message="Token không hợp lệ"
              description={
                status?.message ||
                "Không tìm thấy token đặt lại mật khẩu. Vui lòng thử lại."
              }
              type="error"
              showIcon
            />

            <div className="mt-4 text-center">
              <Link
                href="/auth/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Yêu cầu đặt lại mật khẩu
              </Link>
            </div>
          </div>
        )}

        <div className="text-center mt-4">
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Quay lại đăng nhập
          </Link>
        </div>
      </Card>
    </div>
  );
}
