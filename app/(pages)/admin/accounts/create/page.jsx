"use client";

import { createAppraisalBoard } from "@/service/appraiseService";
import { createInstructor } from "@/service/instructorService";
import { createStudent } from "@/service/studentService";
import { createTechnologyScience } from "@/service/technologyScienceService";
import { Button, Card, Form, Input, Select, message } from "antd";
import {
  IdCardIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
  User2Icon,
} from "lucide-react";
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
          const res = await createStudent(values);
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
              type: "error",
              content: message,
            });
          }
          break;
        }
        case "instructor": {
          const res = await createInstructor(values);
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
              type: "error",
              content: message,
            });
          }
          break;
        }
        case "technologyScience": {
          const res = await createTechnologyScience(values);
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
              type: "error",
              content: message,
            });
          }
          break;
        }
        case "appraisal-board": {
          const res = await createAppraisalBoard(values);
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
              type: "error",
              content: message,
            });
          }
          break;
        }
        default:
          messageApi.error("Có gì đó sai sai...");
      }
    } catch (error) {
      console.log("Lỗi tạo tài khoản: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-6 bg-gray-100 ">
      {contextHolder}
      <div className="text-lg font-semibold">Tạo mới tài khoản</div>
      <Card className="shadow-md">
        <Form
          style={{
            width: 500,
          }}
          onFinish={onFinish}
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
            hasFeedback
          >
            <Input
              prefix={<User2Icon className="mr-1 text-border size-4" />}
              placeholder="Nhập tên tài khoản..."
            />
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
            hasFeedback
          >
            <Input
              prefix={<MailIcon className="mr-1 text-border size-4" />}
              placeholder="Nhập email..."
            />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone" hasFeedback>
            <Input
              prefix={<PhoneIcon className="mr-1 text-border size-4" />}
              placeholder="Nhập số điện thoại..."
            />
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
            hasFeedback
          >
            <Input.Password
              prefix={<LockIcon className="mr-1 text-border size-4" />}
            />
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
                { value: "instructor", label: "Giảng viên" },
                {
                  value: "technologyScience",
                  label: "Phòng Khoa học Công nghệ",
                },
                { value: "appraisal-board", label: "Phòng thẩm định" },
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
                hasFeedback
              >
                <Input
                  prefix={<IdCardIcon className="mr-1 size-4 text-border" />}
                  placeholder="Nhập MSSV..."
                />
              </Form.Item>

              <Form.Item
                label="Khoa"
                name="faculty"
                rules={[{ required: true, message: "Chưa chọn khoa." }]}
              >
                <Select
                  placeholder="Chọn khoa..."
                  options={[
                    {
                      value: "Công nghệ Phần mềm",
                      label: "Công nghệ Phần mềm",
                    },
                    {
                      value: "Hệ thống Thông tin",
                      label: "Hệ thống Thông tin",
                    },
                    {
                      value: "Kỹ thuật Máy tính",
                      label: "Kỹ thuật Máy tính",
                    },
                    {
                      value: "Mạng Máy tính và Truyền thông",
                      label: "Mạng Máy tính và Truyền thông",
                    },
                    {
                      value: "Khoa học Máy tính",
                      label: "Khoa học Máy tính",
                    },
                    {
                      value: "Khoa học và Kỹ thuật Thông tin",
                      label: "Khoa học và Kỹ thuật Thông tin",
                    },
                  ]}
                />
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
                <Select
                  placeholder="Chọn chương trình đào tạo..."
                  options={[
                    {
                      value: "Chất lượng cao",
                      label: "Chất lượng cao",
                    },
                    {
                      value: "Đại trà",
                      label: "Đại trà",
                    },
                  ]}
                />
              </Form.Item>
            </>
          )}

          {role === "appraisal-board" && (
            <>
              <Form.Item
                label="Mã số Phòng Thẩm định"
                name="appraisalBoardId"
                rules={[
                  {
                    required: true,
                    message: "Chưa nhập Mã số Phòng Thẩm định.",
                  },
                ]}
                hasFeedback
              >
                <Input
                  prefix={<IdCardIcon className="mr-1 size-4 text-border" />}
                  placeholder="Nhập mã số Phòng Thẩm định..."
                />
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
                hasFeedback
              >
                <Input
                  prefix={<IdCardIcon className="mr-1 size-4 text-border" />}
                  placeholder="Nhập mã số Phòng Khoa học Công nghệ..."
                />
              </Form.Item>
            </>
          )}

          {role === "instructor" && (
            <>
              <Form.Item
                label="Mã số Giảng viên"
                name="instructorId"
                rules={[
                  {
                    required: true,
                    message: "Chưa nhập Mã số Giảng viên.",
                  },
                ]}
                hasFeedback
              >
                <Input
                  prefix={<IdCardIcon className="mr-1 size-4 text-border" />}
                  placeholder="Nhập mã số Giảng viên..."
                />
              </Form.Item>

              <Form.Item
                label="Học hàm, học vị"
                name="academicRank"
                rules={[
                  {
                    required: true,
                    message: "Chọn học hàm, học vị của GVHD...",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn học hàm, học vị..."
                  options={[
                    { title: "ThS", value: "ThS" },
                    { title: "TS", value: "TS" },
                    { title: "GS.TS", value: "GS.TS" },
                    { title: "PGS.TS", value: "PGS.TS" },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Khoa"
                name="faculty"
                rules={[{ required: true, message: "Chưa chọn khoa." }]}
              >
                <Select
                  placeholder="Chọn khoa..."
                  options={[
                    {
                      value: "Công nghệ Phần mềm",
                      label: "Công nghệ Phần mềm",
                    },
                    {
                      value: "Hệ thống Thông tin",
                      label: "Hệ thống Thông tin",
                    },
                    {
                      value: "Kỹ thuật Máy tính",
                      label: "Kỹ thuật Máy tính",
                    },
                    {
                      value: "Mạng Máy tính và Truyền thông",
                      label: "Mạng Máy tính và Truyền thông",
                    },
                    {
                      value: "Khoa học Máy tính",
                      label: "Khoa học Máy tính",
                    },
                    {
                      value: "Khoa học và Kỹ thuật Thông tin",
                      label: "Khoa học và Kỹ thuật Thông tin",
                    },
                  ]}
                />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Tạo
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
