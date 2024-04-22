"use client";

import { Button, Card, Form, Input, Select, message } from "antd";
import { useRouter } from "next/navigation";

const CreateAccount = () => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    console.log("values: ", JSON.stringify(values));
    try {
      const res = await fetch(`http://localhost:3000/api/accounts`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (res.status === 409) {
        messageApi.open({
          type: "error",
          content: "Email aleady in use!",
        });
      } else {
        router.refresh();
        router.push("/admin/accounts");
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
            <Input placeholder="John Doe" />
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
            <Input placeholder="johndoe@gmail.com" />
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
              allowClear
              options={[
                { value: "student", label: "Sinh viên" },
                { value: "instructor", label: "GVHD" },
                { value: "training", label: "Phòng Đào tạo" },
                { value: "appraise", label: "Phòng thẩm định" },
                { value: "admin", label: "Quản trị viên" },
              ]}
            />
          </Form.Item>

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
};

export default CreateAccount;
