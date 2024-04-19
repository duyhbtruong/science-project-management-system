"use client";

import { useState } from "react";
import { Button, Input } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <div className="mx-auto my-4 w-[400px] space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <Input
            type="email"
            placeholder="Nhập email..."
            onChange={(e) => setEmail(e.target.value)}
            prefix={<MailOutlined />}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <Input
            type="password"
            placeholder="Nhập password..."
            onChange={(e) => setPassword(e.target.value)}
            prefix={<LockOutlined />}
          />
        </div>
        <div className="flex justify-center">
          <Button type="primary">Login</Button>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
