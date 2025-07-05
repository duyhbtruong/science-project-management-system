"use client";

import { createAppraisalBoard } from "@/service/appraiseService";
import { createInstructor } from "@/service/instructorService";
import { createStudent } from "@/service/studentService";
import { createTechnologyScience } from "@/service/technologyScienceService";
import { Button, Card, Form, Input, Select, App } from "antd";
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
  const { message } = App.useApp();
  const [role, setRole] = useState("student");

  const onFinish = async (values) => {
    try {
      switch (role) {
        case "student": {
          const res = await createStudent(values);
          if (res.status === 201) {
            const { message: apiMessage } = await res.json();
            message
              .success(apiMessage)
              .then(() => router.push("/admin/accounts"));
          } else {
            const { message: apiMessage } = await res.json();
            message.error(apiMessage);
          }
          break;
        }
        case "instructor": {
          const res = await createInstructor(values);
          if (res.status === 201) {
            const { message: apiMessage } = await res.json();
            message
              .success(apiMessage)
              .then(() => router.push("/admin/accounts"));
          } else {
            const { message: apiMessage } = await res.json();
            message.error(apiMessage);
          }
          break;
        }
        case "technologyScience": {
          const res = await createTechnologyScience(values);
          if (res.status === 201) {
            const { message: apiMessage } = await res.json();
            message
              .success(apiMessage)
              .then(() => router.push("/admin/accounts"));
          } else {
            const { message: apiMessage } = await res.json();
            message.error(apiMessage);
          }
          break;
        }
        case "appraisal-board": {
          const res = await createAppraisalBoard(values);
          if (res.status === 201) {
            const { message: apiMessage } = await res.json();
            message
              .success(apiMessage)
              .then(() => router.push("/admin/accounts"));
          } else {
            const { message: apiMessage } = await res.json();
            message.error(apiMessage);
          }
          break;
        }
        default:
          message.error("Có gì đó sai sai...");
      }
    } catch (error) {
      console.log("Lỗi tạo tài khoản: ", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 justify-center items-center py-6 bg-gray-100">
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
                message: "Vui lòng nhập tên tài khoản",
              },
            ]}
          >
            <Input
              prefix={<User2Icon className="mr-1 text-border size-4" />}
              placeholder="Nhập tên tài khoản..."
              spellCheck={false}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập email",
              },
              {
                type: "email",
                message: "Email không đúng định dạng",
              },
            ]}
          >
            <Input
              prefix={<MailIcon className="mr-1 text-border size-4" />}
              placeholder="Nhập email..."
              spellCheck={false}
            />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              {
                pattern: /^[0-9]*$/,
                message: "Vui lòng chỉ nhập số",
              },
              {
                pattern:
                  /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/,
                message: "Số điện thoại không hợp lệ",
              },
            ]}
          >
            <Input
              prefix={<PhoneIcon className="mr-1 text-border size-4" />}
              placeholder="Nhập số điện thoại..."
              onKeyDown={(e) => {
                if (
                  !/[0-9]/.test(e.key) &&
                  ![
                    "Backspace",
                    "Delete",
                    "Tab",
                    "Escape",
                    "Enter",
                    "ArrowLeft",
                    "ArrowRight",
                    "ArrowUp",
                    "ArrowDown",
                  ].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }}
              spellCheck={false}
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu",
              },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password
              prefix={<LockIcon className="mr-1 text-border size-4" />}
              placeholder="Nhập mật khẩu..."
              spellCheck={false}
            />
          </Form.Item>

          <Form.Item
            label="Chức năng"
            name="role"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn chức năng",
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
                  { required: true, message: "Vui lòng nhập mã số sinh viên" },
                ]}
              >
                <Input
                  prefix={<IdCardIcon className="mr-1 size-4 text-border" />}
                  placeholder="Nhập MSSV..."
                  spellCheck={false}
                />
              </Form.Item>

              <Form.Item
                label="Khoa"
                name="faculty"
                rules={[{ required: true, message: "Vui lòng chọn khoa" }]}
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
                  spellCheck={false}
                />
              </Form.Item>

              <Form.Item
                label="Chương trình đào tạo"
                name="educationProgram"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn chương trình đào tạo",
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
                  spellCheck={false}
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
                    message: "Vui lòng nhập mã số Phòng Thẩm định",
                  },
                ]}
              >
                <Input
                  prefix={<IdCardIcon className="mr-1 size-4 text-border" />}
                  placeholder="Nhập mã số Phòng Thẩm định..."
                  spellCheck={false}
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
                    message: "Vui lòng nhập mã số Phòng Khoa học Công nghệ",
                  },
                ]}
              >
                <Input
                  prefix={<IdCardIcon className="mr-1 size-4 text-border" />}
                  placeholder="Nhập mã số Phòng Khoa học Công nghệ..."
                  spellCheck={false}
                />
              </Form.Item>
            </>
          )}

          {role === "instructor" && (
            <>
              <Form.Item
                label="Mã số giảng viên"
                name="instructorId"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mã số giảng viên",
                  },
                ]}
              >
                <Input
                  prefix={<IdCardIcon className="mr-1 size-4 text-border" />}
                  placeholder="Nhập mã số giảng viên..."
                  spellCheck={false}
                />
              </Form.Item>

              <Form.Item
                label="Học hàm, học vị"
                name="academicRank"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn học hàm, học vị",
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
                  spellCheck={false}
                />
              </Form.Item>

              <Form.Item
                label="Khoa"
                name="faculty"
                rules={[{ required: true, message: "Vui lòng chọn khoa" }]}
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
                  spellCheck={false}
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
