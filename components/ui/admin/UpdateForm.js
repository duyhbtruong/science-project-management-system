"use client";

import { Form, Button, Input } from "antd";
import { useRouter } from "next/navigation";

const UpdateForm = ({ id, name, email, phone, password, role }) => {
  const router = useRouter();

  const onFinish = async (values) => {
    try {
      const res = await fetch(`http://localhost:3000/api/accounts/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Failed to update account!");
      }

      router.refresh();
      router.push("/admin/accounts");
    } catch (error) {
      console.log("Errors: ", error);
    }
  };

  const onFinishFailed = (error) => {
    console.log("Errors: ", error);
  };

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      initialValues={{
        name: name,
        email: email,
        phone: phone,
        password: password,
        role: role,
      }}
      className="flex flex-col mx-auto mt-4"
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input your name!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your email!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Phone" name="phone">
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Role"
        name="role"
        rules={[
          {
            required: true,
            message: "Please input your name!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 4,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateForm;
