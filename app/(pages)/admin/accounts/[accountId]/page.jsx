"use client";

import { getAccountById } from "@/service/accountService";
import { updateAppraisalBoardById } from "@/service/appraiseService";
import { updateInstructorById } from "@/service/instructorService";
import { updateStudentById } from "@/service/studentService";
import { updateTechnologyScienceById } from "@/service/technologyScienceService";
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

    const { message: apiMessage } = await res.json();

    if (res.status === 200) {
      messageApi.success(apiMessage).then(() => router.push(`/admin/accounts`));
    } else {
      messageApi.error(apiMessage);
    }
  };

  return (
    <div className="flex flex-col gap-6 justify-center items-center py-6 bg-gray-100">
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
                  min: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
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
                    {
                      required: true,
                      message: "Vui lòng nhập mã số sinh viên",
                    },
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
                  label="Mã số Phòng thẩm định"
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
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
}
