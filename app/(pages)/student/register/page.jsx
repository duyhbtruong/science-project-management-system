"use client";

import { useEffect, useState } from "react";
import { useCustomSession } from "@/hooks/use-custom-session";

import { Divider, Form, Space, Spin, message } from "antd";

import { createTopic, getTopicsByPeriod } from "@/service/topicService";
import { getAccountById } from "@/service/accountService";
import { getAllPeriods } from "@/service/registrationService";
import { getAllInstructors } from "@/service/instructorService";

import { TopicInfoSection } from "./topic-info-section";
import { RegistrationModal } from "./registration-modal";
import { SubmitButton } from "@/components/submit-button";
import { StudentInfoSection } from "./student-info-section";
import { NoRegistrationPeriod } from "./no-registration-period";
import { InstructorInfoSection } from "./instructor-info-section";
import { uploadFile } from "@/service/uploadService";

export default function TopicPage() {
  const { session } = useCustomSession();
  const account = session?.user;
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [redirect, setRedirect] = useState("");
  const [period, setPeriod] = useState();
  const [student, setStudent] = useState();
  const [listFile, setListFile] = useState([]);
  const [listPeriod, setListPeriod] = useState();
  const [listInstructor, setListInstructor] = useState();
  const [messageApi, contextHolder] = message.useMessage();

  const loadStudent = async () => {
    try {
      setIsLoading(true);
      let res = await getAccountById(account.id);
      res = await res.json();
      setStudent(res.student);
    } finally {
      setIsLoading(false);
    }
  };

  const loadListPeriod = async () => {
    let res = await getAllPeriods();
    res = await res.json();
    setListPeriod(res);
  };

  const loadListInstructor = async () => {
    let res = await getAllInstructors();
    res = await res.json();
    setListInstructor(res);
  };

  const loadTopicsByPeriod = async () => {
    let res = await getTopicsByPeriod(period._id);
    const listTopic = await res.json();
    const topic = listTopic.find((topic) => topic.owner._id === student._id);
    if (topic) {
      setIsRegistered(true);
      setRedirect(`/student/topics/${topic._id}`);
    }
  };

  useEffect(() => {
    loadListPeriod();
  }, []);

  useEffect(() => {
    if (!listPeriod) return;

    setPeriod(isDateWithinRange(listPeriod));
  }, [listPeriod]);

  useEffect(() => {
    if (!account || !period) return;

    loadStudent();
    loadListInstructor();
  }, [account, period]);

  useEffect(() => {
    if (!student) return;

    loadTopicsByPeriod();
  }, [student]);

  useEffect(() => {
    if (!student || !listInstructor) return;

    form.setFieldsValue({
      studentName: account.name,
      studentEmail: account.email,
      studentFaculty: student.faculty,
      educationProgram: student.educationProgram,
    });
  }, [student, listInstructor]);

  const filteredInstructors = listInstructor?.filter(
    (instructor) => instructor?.faculty === student?.faculty
  );

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
      const { topicId, message } = res;
      handleRegisterFileUpload(topicId);
      messageApi
        .open({
          type: "success",
          content: message,
          duration: 2,
        })
        .then(() => {
          loadStudent();
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

  const handleRegisterFileUpload = async (topicId) => {
    if (listFile.length === 0) {
      return;
    }
    let startDate = new Date(period.startDate);
    let endDate = new Date(period.endDate);
    startDate = startDate.toISOString().slice(0, 10).replace(/-/g, "");
    endDate = endDate.toISOString().slice(0, 10).replace(/-/g, "");
    const periodDir = `${period.title}-${startDate}-${endDate}`;

    const file = listFile[0];
    const formData = new FormData();
    formData.append("file", file.originFileObj);
    formData.append("fileType", "register");
    formData.append("fileName", file.name);
    formData.append("periodDir", periodDir);
    formData.append("studentId", student?.studentId);

    const res = await uploadFile(topicId, formData);
    if (res.ok) {
      const data = await res.json();
      messageApi.open({
        type: "success",
        content: data.message,
        duration: 2,
      });
    } else {
      const data = await res.json();
      messageApi.open({
        type: "error",
        content: data.message,
        duration: 2,
      });
    }
  };

  if (listPeriod && !period) return <NoRegistrationPeriod />;

  return (
    <div className="bg-gray-100 ">
      {contextHolder}

      {listPeriod && period && (
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
                <Divider orientation="center">
                  Thông tin Chủ nhiệm đề tài
                </Divider>
                <StudentInfoSection />
                <Divider orientation="center">Thông tin Đề tài</Divider>
                <TopicInfoSection
                  listFile={listFile}
                  setListFile={setListFile}
                />
                <Divider orientation="center">
                  Thông tin Giảng viên Hướng dẫn
                </Divider>
                <InstructorInfoSection
                  form={form}
                  listInstructor={filteredInstructors}
                />
                <Form.Item>
                  <Space>
                    <SubmitButton form={form}>Đăng ký</SubmitButton>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          </Spin>
        </div>
      )}

      {!isLoading && (
        <RegistrationModal redirect={redirect} visible={isRegistered} />
      )}
    </div>
  );
}
