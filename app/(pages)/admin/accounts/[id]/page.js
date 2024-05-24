"use client";

import { getAccountById } from "@/service/accountService";
import { Form, Button, Input, message, Card, Select } from "antd";
import { useEffect, useState } from "react";

export default function UpdateAccount({ params }) {
  const id = params.id;
  const [messageApi, contextHolder] = message.useMessage();
  const [account, setAccount] = useState();
  const [student, setStudent] = useState();
  const [instructor, setInstructor] = useState();
  const [training, setTraining] = useState();
  const [appraise, setAppraise] = useState();
  const [role, setRole] = useState();

  const loadAccount = async () => {
    const response = await getAccountById(id);
    setAccount(response.account);
    setRole(response.account.role);
    setStudent(response.student);
    setInstructor(response.instructor);
    setTraining(response.training);
    setAppraise(response.appraise);
  };

  useEffect(() => {
    loadAccount();
  }, []);

  const onFinish = async (values) => {
    try {
      switch (role) {
        case "student": {
          const res = await postStudentAccount(values);
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
              type: "info",
              content: message,
            });
          }
          break;
        }
        case "instructor": {
          const res = await postInstructorService(values);
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
              type: "info",
              content: message,
            });
          }
          break;
        }
        case "training": {
          const res = await postTrainingAccount(values);
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
              type: "info",
              content: message,
            });
          }
          break;
        }
        case "appraise": {
          const res = await postAppraiseAccount(values);
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
              type: "info",
              content: message,
            });
          }
          break;
        }
        default:
          messageApi.error("Something went wrong!");
      }
    } catch (error) {
      console.log("Errors creating account: ", error);
    }
  };

  const onFinishFailed = (errorInfo) => {};

  return (
    <div className="mt-8 flex items-center justify-center">
      {contextHolder}
      <Card>
        {account && (
          <Form
            style={{
              width: 500,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            initialValues={{
              name: account.name,
              email: account.email,
              phone: account.phone,
              role: account.role,
              studentId: student?.studentId,
              instructorId: instructor?.instructorId,
              trainingId: training?.trainingId,
              appraiseId: appraise?.appraiseId,
              faculty: student ? student?.faculty : instructor?.faculty,
              educationProgram: student?.educationProgram,
              academicRank: instructor?.academicRank,
            }}
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
              <Input placeholder="Nhập tên tài khoản..." />
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
              <Input placeholder="Nhập email..." />
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
                onChange={(value) => setRole(value)}
                options={[
                  { value: "student", label: "Sinh viên" },
                  { value: "instructor", label: "GVHD" },
                  { value: "training", label: "Phòng Đào tạo" },
                  { value: "appraise", label: "Phòng thẩm định" },
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
                >
                  <Input placeholder="Nhập MSSV..." />
                </Form.Item>

                <Form.Item
                  label="Khoa"
                  name="faculty"
                  rules={[{ required: true, message: "Chưa chọn khoa." }]}
                >
                  <Input placeholder="Nhập đơn vị khoa..." />
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
                  <Input placeholder="Nhập chương trình đào tạo..." />
                </Form.Item>
              </>
            )}

            {role === "instructor" && (
              <>
                <Form.Item
                  label="Mã số GVHD"
                  name="instructorId"
                  rules={[{ required: true, message: "Chưa nhập Mã số GVHD." }]}
                >
                  <Input placeholder="Nhập mã số GVHD..." />
                </Form.Item>

                <Form.Item
                  label="Khoa"
                  name="faculty"
                  rules={[{ required: true, message: "Chưa nhập khoa." }]}
                >
                  <Input placeholder="Nhập đơn vị khoa..." />
                </Form.Item>

                <Form.Item
                  label="Học hàm, học vị"
                  name="academicRank"
                  rules={[
                    { required: true, message: "Chưa nhập học hàm, học vị." },
                  ]}
                >
                  <Input placeholder="Nhập học hàm, học vị..." />
                </Form.Item>
              </>
            )}

            {role === "appraise" && (
              <>
                <Form.Item
                  label="Mã số Phòng thẩm định"
                  name="appraiseId"
                  rules={[
                    {
                      required: true,
                      message: "Chưa nhập Mã số Phòng thẩm định.",
                    },
                  ]}
                >
                  <Input placeholder="Nhập mã số Phòng thẩm định..." />
                </Form.Item>
              </>
            )}

            {role === "training" && (
              <>
                <Form.Item
                  label="Mã số Phòng Đào tạo"
                  name="trainingId"
                  rules={[
                    {
                      required: true,
                      message: "Chưa nhập Mã số Phòng đào tạo.",
                    },
                  ]}
                >
                  <Input placeholder="Nhập mã số Phòng đào tạo..." />
                </Form.Item>
              </>
            )}

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Submit
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
}
