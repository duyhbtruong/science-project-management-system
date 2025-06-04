"use client";

import { getAccountById } from "@/service/accountService";
import { updateAppraisalBoardById } from "@/service/appraiseService";
import { updateInstructorById } from "@/service/instructorService";
import { updateStudentById } from "@/service/studentService";
import { updateTechnologyScienceById } from "@/service/technologyScienceService";
import { validatePhoneNumber } from "@/utils/validator";
import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Form, Button, Input, message, Card, Select, Spin } from "antd";
import {
  IdCardIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
  User2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateAccount({ params }) {
  const id = params.accountId;
  const [messageApi, contextHolder] = message.useMessage();
  const [account, setAccount] = useState();
  const [student, setStudent] = useState();
  const [technologyScience, setTechnologyScience] = useState();
  const [appraisalBoard, setAppraisalBoard] = useState();
  const [instructor, setInstructor] = useState();
  const [role, setRole] = useState();
  const [form] = Form.useForm();

  const router = useRouter();

  const loadAccount = async () => {
    var response = await getAccountById(id);
    response = await response.json();
    setAccount(response.account);
    setRole(response.account.role);
    setStudent(response.student);
    setTechnologyScience(response.technologyScience);
    setAppraisalBoard(response.appraisalBoard);
    setInstructor(response.instructor);
  };

  useEffect(() => {
    loadAccount();
  }, []);

  useEffect(() => {
    if (!account) return;

    form.setFieldsValue({
      name: account?.name,
      email: account?.email,
      phone: account?.phone,
      role: account?.role,
      studentId: student?.studentId,
      technologyScienceId: technologyScience?.technologyScienceId,
      appraisalBoardId: appraisalBoard?.appraisalBoardId,
      instructorId: instructor?.instructorId,
      faculty: student?.faculty ?? instructor?.faculty,
      academicRank: instructor?.academicRank,
      educationProgram: student?.educationProgram,
    });
  }, [account]);

  const onFinish = async (values) => {
    var res;
    if (account.role === "student") {
      res = await updateStudentById(student._id, values);
    }

    if (account.role === "instructor") {
      res = await updateInstructorById(instructor._id, values);
    }

    if (account.role === "technologyScience") {
      res = await updateTechnologyScienceById(technologyScience._id, values);
    }

    if (account.role === "appraisal-board") {
      res = await updateAppraisalBoardById(appraisalBoard._id, values);
    }

    const { message } = await res.json();

    if (res.status === 200) {
      messageApi
        .open({
          type: "success",
          content: message,
          duration: 2,
        })
        .then(() => router.push(`/admin/accounts`));
    } else {
      messageApi.open({
        type: "error",
        content: message,
        duration: 2,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-6 bg-gray-100">
      {contextHolder}
      <div className="text-lg font-semibold">Cập nhật tài khoản</div>
      <Card className="shadow-md">
        <Spin spinning={!account}>
          <Form
            form={form}
            style={{
              width: 500,
            }}
            onFinish={onFinish}
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
            >
              <Input
                prefix={<MailIcon className="mr-1 text-border size-4" />}
                placeholder="Nhập email..."
              />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.resolve();
                    }
                    if (!validatePhoneNumber(value)) {
                      return Promise.reject(
                        new Error("Số điện thoại chỉ được chứa chữ số!")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              hasFeedback
            >
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
                  {
                    value: "instructor",
                    label: "Giảng viên",
                  },
                  {
                    value: "technologyScience",
                    label: "Phòng Khoa học Công nghệ",
                  },
                  { value: "appraisal-board", label: "Phòng thẩm định" },
                ]}
                disabled
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
                  label="Mã số Phòng thẩm định"
                  name="appraisalBoardId"
                  rules={[
                    {
                      required: true,
                      message: "Chưa nhập Mã số Phòng thẩm định.",
                    },
                  ]}
                >
                  <Input
                    prefix={<IdCardIcon className="mr-1 size-4 text-border" />}
                    placeholder="Nhập mã số Phòng thẩm định..."
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
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
}
