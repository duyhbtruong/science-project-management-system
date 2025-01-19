"use client";

import { useSession } from "next-auth/react";
import {
  AlignLeftOutlined,
  ArrowRightOutlined,
  CodeOutlined,
  IdcardOutlined,
  MailOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Upload,
  message,
} from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createTopic } from "@/service/topicService";
import { getAccountById } from "@/service/accountService";
import { getAllInstructors } from "@/service/instructorService";
import { getAllPeriods } from "@/service/registrationService";
import { storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { uploadRegisterFile } from "@/service/upload";

export default function TopicPage() {
  const router = useRouter();
  const session = useSession();
  const account = session.data?.user;
  const [form] = Form.useForm();
  const [period, setPeriod] = useState();
  const [listPeriod, setListPeriod] = useState();
  const [student, setStudent] = useState();
  const [fileList, setFileList] = useState([]);
  const [listIntructor, setListIntructor] = useState();
  const [messageApi, contextHolder] = message.useMessage();

  const loadUserInfo = async () => {
    let res = await getAccountById(account.id);
    res = await res.json();
    setStudent(res.student);
  };

  const loadListIntructor = async () => {
    let res = await getAllInstructors();
    res = await res.json();
    setListIntructor(res);
  };

  const loadPeriod = async () => {
    let res = await getAllPeriods();
    res = await res.json();
    setListPeriod(res);
  };

  useEffect(() => {
    if (!account) return;

    loadUserInfo();
  }, [account]);

  useEffect(() => {
    if (!listPeriod) return;

    setPeriod(isDateWithinRange(listPeriod));
  }, [listPeriod]);

  useEffect(() => {
    loadListIntructor();
    loadPeriod();
  }, []);

  useEffect(() => {
    if (!student || !listIntructor) return;

    form.setFieldsValue({
      studentName: account.name,
      studentEmail: account.email,
      studentFaculty: student.faculty,
      educationProgram: student.educationProgram,
    });
  }, [student]);

  const isDateWithinRange = (periods) => {
    const today = new Date();

    for (let period of periods) {
      const start = new Date(period.startDate);
      const end = new Date(period.endDate);

      if (today >= start && today <= end) {
        return period;
      }
    }

    return null;
  };

  const handleFinish = async (values) => {
    const formData = {
      vietnameseName: values.vietnameseName,
      englishName: values.englishName,
      type: values.type,
      summary: values.summary,
      reference: values.references,
      expectedResult: values.expectedResult,
      participants: values.participants,
      registrationPeriod: period._id,
      owner: student._id,
      instructor: values.listInstructor,
    };

    let res = await createTopic(formData);

    if (res.status === 201) {
      res = await res.json();
      const { newTopicId, message } = res;
      handleRegisterFileUpload(newTopicId);
      messageApi
        .open({
          type: "success",
          content: message,
          duration: 2,
        })
        .then(() => {
          loadUserInfo();
        });
    } else {
      res = await res.json();
      const { message } = res;
      messageApi.open({
        type: "error",
        content: message,
        duration: 2,
      });
    }
  };

  const handleInstructorChange = (instructorId) => {
    if (instructorId === undefined) {
      form.setFieldsValue({
        instructorEmail: "",
        instructorFaculty: "",
        instructorAcademicRank: "",
      });
      return;
    }

    let selectedInstructor = listIntructor.find(
      (intructor) => intructor._id === instructorId
    );

    form.setFieldsValue({
      instructorEmail: selectedInstructor.account.email,
      instructorFaculty: selectedInstructor.faculty,
      instructorAcademicRank: selectedInstructor.academicRank,
    });
  };

  const handleRegisterFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleRegisterFileUpload = (topicId) => {
    if (fileList.length === 0) {
      return;
    }
    // const dateTime = giveCurrentDateTime();
    // console.log(">>> student: ", student);
    // console.log(">>> fileList: ", fileList);
    const fileRef = ref(storage, `${student?.studentId}/${fileList[0].name}`);
    // console.log("fileRef: ", fileRef);
    uploadBytes(fileRef, fileList[0]?.originFileObj)
      .then((snapshot) => {
        const fileRef = snapshot.ref._location.path_;
        return getDownloadURL(ref(storage, fileRef));
      })
      .then((downloadLink) => {
        uploadRegisterFile(topicId, downloadLink);
      });
  };

  return (
    <div className="bg-gray-100 min-h-[100vh]">
      {contextHolder}

      {listPeriod && !period && (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <Card
            className="w-full max-w-md rounded-lg shadow-lg"
            bordered={false}
            style={{
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div className="p-4">
              <h2 className="mb-4 text-2xl font-semibold text-center text-gray-800">
                📢 Chưa mở đợt đăng ký đề tài
              </h2>
              <p className="mb-6 text-center text-gray-600">
                Hiện không nằm trong thời gian đăng ký đề tài nghiên cứu khoa
                học. Sinh viên vui lòng quay lại sau.
              </p>
            </div>
          </Card>
        </div>
      )}

      {listPeriod && period && (
        <>
          <div className="py-6 mx-32">
            <div className="flex justify-center pb-6 text-xl font-semibold">
              Đăng ký Đề tài
            </div>
            <Spin spinning={student ? false : true}>
              <div className="flex justify-center">
                <Form
                  form={form}
                  name="register-topic"
                  className="py-2 px-4 w-[640px] bg-white rounded-md shadow-md"
                  onFinish={handleFinish}
                  layout="vertical"
                  autoComplete="off"
                  initialValues={{
                    references: [""],
                    participants: [""],
                  }}
                >
                  {/* ---------------------------- CHỦ NHIỆM ĐỀ TÀI ---------------------------- */}

                  <Divider orientation="center">
                    Thông tin Chủ nhiệm đề tài
                  </Divider>

                  <Form.Item label="Email" name="studentEmail" required={true}>
                    <Input
                      disabled
                      prefix={<MailOutlined className="text-border" />}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Họ và tên"
                    name="studentName"
                    required={true}
                  >
                    <Input
                      disabled
                      prefix={<UserOutlined className="text-border" />}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Đơn vị"
                    name="studentFaculty"
                    required={true}
                  >
                    <Input
                      disabled
                      prefix={<CodeOutlined className="text-border" />}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Chương trình đào tạo"
                    name="educationProgram"
                    required={true}
                  >
                    <Input
                      disabled
                      prefix={<IdcardOutlined className="text-border" />}
                    />
                  </Form.Item>

                  {/* ---------------------------- THÔNG TIN ĐỀ TÀI ---------------------------- */}

                  <Divider orientation="center">Thông tin Đề tài</Divider>

                  <Form.Item
                    label="Tên đề tài (tiếng Việt) - ghi bằng IN HOA"
                    name="vietnameseName"
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Tên đề tài không được để trống.",
                      },
                      {
                        validator(_, value) {
                          if (value !== value?.toUpperCase()) {
                            return Promise.reject(
                              new Error("Tên đề tài phải là chữ in hoa.")
                            );
                          } else return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập tên tiếng Việt của đề tài..."
                      prefix={<AlignLeftOutlined className="text-border" />}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Tên đề tài (tiếng Anh) - ghi bằng IN HOA"
                    name="englishName"
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Tên đề tài không được để trống.",
                      },
                      {
                        validator(_, value) {
                          if (value !== value?.toUpperCase()) {
                            return Promise.reject(
                              new Error("Tên đề tài phải là chữ in hoa.")
                            );
                          } else return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập tên tiếng Anh của đề tài..."
                      prefix={<AlignLeftOutlined className="text-border" />}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Loại hình nghiên cứu"
                    name="type"
                    rules={[
                      {
                        required: true,
                        message: "Không được để trống loại hình nghiên cứu.",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Chọn loại hình nghiên cứu..."
                      options={[
                        {
                          value: "Nghiên cứu cơ bản",
                          label: "Nghiên cứu cơ bản",
                        },
                      ]}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Tóm tắt nội dung đề tài"
                    name="summary"
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Không được để trống tóm tắt đề tài.",
                      },
                      {
                        max: 300,
                        message: "Không được dài quá 300 chữ!",
                      },
                    ]}
                  >
                    <Input.TextArea
                      showCount
                      maxLength={300}
                      rows={5}
                      style={{ resize: "none" }}
                      placeholder="Nhập tóm tắt nội dung đề tài..."
                    />
                  </Form.Item>

                  <Form.List
                    name="references"
                    hasFeedback
                    rules={[
                      {
                        validator: async (_, references) => {
                          if (!references) {
                            return Promise.reject(
                              new Error(
                                "Phải có ít nhất 1 tài liệu tham khảo chính."
                              )
                            );
                          } else if (references.length > 5) {
                            return Promise.reject(
                              new Error(
                                "Tối đa nhập 5 tài liệu tham khảo chính."
                              )
                            );
                          }
                        },
                      },
                    ]}
                  >
                    {(references, { add, remove }, { errors }) => (
                      <>
                        {references.map((reference, index) => {
                          const { key, ...restProps } = reference;
                          return (
                            <Form.Item
                              label={index == 0 ? "Tài liệu tham khảo" : null}
                              required={true}
                              key={key}
                            >
                              <Form.Item
                                {...restProps}
                                validateTrigger={["onChange", "onBlur"]}
                                rules={[
                                  {
                                    required: true,
                                    whitespace: true,
                                    message:
                                      "Nhập tài liệu tham khảo hoặc xóa trường này đi.",
                                  },
                                ]}
                                noStyle
                              >
                                <Input
                                  placeholder={`[${
                                    index + 1
                                  }] Nhập tài liệu tham khảo...`}
                                  style={{
                                    width:
                                      references.length < 2 ? "100%" : "95%",
                                  }}
                                />
                              </Form.Item>
                              {references.length > 1 && (
                                <MinusCircleOutlined
                                  className="ml-2"
                                  onClick={() => remove(reference.name)}
                                />
                              )}
                            </Form.Item>
                          );
                        })}
                        <Form.Item>
                          <Button
                            className="w-full "
                            type="dashed"
                            onClick={() => add()}
                            icon={<PlusOutlined />}
                          >
                            Thêm tài liệu
                          </Button>
                          <Form.ErrorList errors={errors} />
                        </Form.Item>
                      </>
                    )}
                  </Form.List>

                  <Form.Item
                    label="Dự kiến kết quả"
                    name="expectedResult"
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message:
                          "Không được để trống nội dung dự kiến kết quả.",
                      },
                      {
                        max: 300,
                        message: "Không được dài quá 300 chữ!",
                      },
                    ]}
                  >
                    <Input.TextArea
                      placeholder="Nhập kết quả dự kiến của đề tài..."
                      showCount
                      maxLength={300}
                      rows={5}
                      style={{ resize: "none" }}
                    />
                  </Form.Item>

                  <Form.List
                    name="participants"
                    rules={[
                      {
                        validator: async (_, participants) => {
                          if (!participants) {
                            return Promise.reject(
                              new Error("Phải có ít nhất 1 thành viên tham gia")
                            );
                          } else if (participants.length > 3) {
                            return Promise.reject(
                              new Error(
                                "Tối đa được 3 thành viên tham gia nghiên cứu đề tài."
                              )
                            );
                          }
                        },
                      },
                    ]}
                  >
                    {(fields, { add, remove }, { errors }) => (
                      <>
                        {fields.map((field, index) => {
                          const { key, ...restProps } = field;
                          return (
                            <Form.Item
                              label={
                                index == 0
                                  ? "Danh sách thành viên đề tài (Kể cả CNĐT) - mỗi dòng một thành viên"
                                  : null
                              }
                              required={true}
                              key={key}
                            >
                              <Form.Item
                                {...restProps}
                                validateTrigger={["onChange", "onBlur"]}
                                rules={[
                                  {
                                    required: true,
                                    whitespace: true,
                                    message:
                                      "Nhập tên thành viên hoặc xóa dòng này nếu không cần thiết.",
                                  },
                                ]}
                                noStyle
                              >
                                <Input
                                  placeholder={`Nhập tên thành viên thứ ${
                                    index + 1
                                  }... `}
                                  style={{
                                    width: fields.length < 2 ? "100%" : "95%",
                                  }}
                                  prefix={
                                    <TeamOutlined className="text-border" />
                                  }
                                />
                              </Form.Item>
                              {fields.length > 1 && (
                                <MinusCircleOutlined
                                  className="ml-2"
                                  onClick={() => remove(field.name)}
                                />
                              )}
                            </Form.Item>
                          );
                        })}
                        <Form.Item>
                          <Button
                            className="w-full"
                            type="dashed"
                            onClick={() => add()}
                            icon={<PlusOutlined />}
                          >
                            Thêm thành viên
                          </Button>
                          <Form.ErrorList errors={errors} />
                        </Form.Item>
                      </>
                    )}
                  </Form.List>

                  <Form.Item label="Hồ sơ đăng ký" required={true}>
                    <Upload
                      className="w-full"
                      accept=".pdf"
                      maxCount={1}
                      onChange={handleRegisterFileChange}
                      fileList={fileList}
                    >
                      <Button className="w-full" icon={<UploadOutlined />}>
                        Nộp hồ sơ
                      </Button>
                    </Upload>
                  </Form.Item>

                  {/* ---------------------------- THÔNG TIN GIẢNG VIÊN HƯỚNG DẪN ---------------------------- */}

                  <Divider orientation="center">
                    Thông tin Giảng viên Hướng dẫn
                  </Divider>

                  <Form.Item
                    label="Chọn giảng viên"
                    name="listInstructor"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn 1 giảng viên.",
                      },
                    ]}
                  >
                    <Select
                      allowClear
                      placeholder="Chọn 1 giảng viên..."
                      value={3}
                      onChange={handleInstructorChange}
                    >
                      {listIntructor?.map((instructor, index) => {
                        // console.log(">>> instructor: ", instructor);
                        return (
                          <Select.Option key={index} value={instructor._id}>
                            {instructor.account.name}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="instructorEmail"
                    rules={[
                      {
                        required: true,
                        message: "Không được để trống email GVHD!",
                      },
                      {
                        type: "email",
                        message: "Sai định dạng email!",
                      },
                    ]}
                  >
                    <Input
                      disabled
                      prefix={<MailOutlined className="text-border" />}
                      placeholder="Nhập email giáo viên hướng dẫn..."
                    />
                  </Form.Item>

                  <Form.Item
                    label="Khoa"
                    name="instructorFaculty"
                    rules={[
                      {
                        required: true,
                        message: "Không được để trống khoa của giảng viên.",
                      },
                    ]}
                  >
                    <Input
                      disabled
                      prefix={<UserOutlined className="text-border" />}
                      placeholder="Nhập tên khoa của giảng viên..."
                    />
                  </Form.Item>

                  <Form.Item
                    label="Học hàm, học vị"
                    name="instructorAcademicRank"
                    rules={[
                      {
                        required: true,
                        message: "Chọn học hàm, học vị của GVHD...",
                      },
                    ]}
                  >
                    <Select
                      disabled
                      placeholder="Chọn học hàm, học vị..."
                      options={[
                        { title: "ThS", value: "ThS" },
                        { title: "TS", value: "TS" },
                        { title: "GS.TS", value: "GS.TS" },
                        { title: "PGS.TS", value: "PGS.TS" },
                      ]}
                    />
                  </Form.Item>

                  {/* ---------------------------- NÚT ĐĂNG KÝ ĐỀ TÀI ---------------------------- */}

                  <Form.Item>
                    <Space>
                      <SubmitButton form={form}>Đăng ký</SubmitButton>
                    </Space>
                  </Form.Item>
                </Form>
              </div>
            </Spin>
          </div>

          <Modal
            title="Đăng ký đề tài"
            open={student ? (student.topicId === null ? false : true) : false}
            closable={false}
            footer={[
              <Button
                icon={<ArrowRightOutlined />}
                key="link"
                type="primary"
                href={student ? `/student/topics/${student.topicId}` : ``}
              >
                Đến trang Quản lý đề tài cá nhân
              </Button>,
            ]}
          >
            <p>Bạn đã đăng ký đề tài Nghiên cứu khoa học!</p>
            <p>Vui lòng đến trang Quản lý đề tài cá nhân.</p>
          </Modal>
        </>
      )}

      {/* <Modal
        title="Không trong đợt đăng ký đề tài"
        open={period ? (isDateWithinRange(period) ? false : true) : false}
        closable={false}
        footer={
          [
            // <Button
            //   icon={<ArrowRightOutlined />}
            //   key="link"
            //   type="primary"
            //   href={student ? `/student/topics/${student.topicId}` : ``}
            // >
            //   Đến trang Quản lý đề tài cá nhân
            // </Button>,
          ]
        }
      >
        <p>Hiện tại đang không trong đợt đăng ký nào.</p>
      </Modal> */}
    </div>
  );
}

const SubmitButton = ({ form, children }) => {
  const [submittable, setSubmittable] = useState(false);

  // Watch all values
  const values = Form.useWatch([], form);
  useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);
  return (
    <Button type="primary" htmlType="submit" disabled={!submittable}>
      {children}
    </Button>
  );
};
