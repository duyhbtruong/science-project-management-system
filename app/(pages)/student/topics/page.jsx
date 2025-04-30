"use client";

import { useEffect, useState } from "react";
import { useCustomSession } from "@/hooks/use-custom-session";

import { Divider, Form, Space, Spin, message } from "antd";

import { createTopic } from "@/service/topicService";
import { uploadRegisterFile } from "@/service/upload";
import { getAccountById } from "@/service/accountService";
import { getAllPeriods } from "@/service/registrationService";
import { getAllInstructors } from "@/service/instructorService";

import { storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { TopicInfoSection } from "./topic-info-section";
import { RegistrationModal } from "./registration-modal";
import { SubmitButton } from "@/components/submit-button";
import { StudentInfoSection } from "./student-info-section";
import { NoRegistrationPeriod } from "./no-registration-period";
import { InstructorInfoSection } from "./instructor-info-section";

export default function TopicPage() {
  const { session } = useCustomSession();
  const account = session?.user;
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState(true);
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
    if (!student || !listInstructor) return;

    form.setFieldsValue({
      studentName: account.name,
      studentEmail: account.email,
      studentFaculty: student.faculty,
      educationProgram: student.educationProgram,
    });
  }, [student, listInstructor]);

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

  const handleRegisterFileUpload = (topicId) => {
    if (listFile.length === 0) {
      return;
    }
    let startDate = new Date(period.startDate);
    let endDate = new Date(period.endDate);
    startDate = startDate.toISOString().slice(0, 10).replace(/-/g, "");
    endDate = endDate.toISOString().slice(0, 10).replace(/-/g, "");
    const periodDir = `${period.title}-${startDate}-${endDate}`;
    const fileRef = ref(
      storage,
      `${periodDir}/${student?.studentId}/${listFile[0].name}`
    );
    uploadBytes(fileRef, listFile[0]?.originFileObj)
      .then((snapshot) => {
        const fileRef = snapshot.ref._location.path_;
        return getDownloadURL(ref(storage, fileRef));
      })
      .then((downloadLink) => {
        uploadRegisterFile(topicId, downloadLink);
      });
  };

  if (listPeriod && !period) return <NoRegistrationPeriod />;

  return (
    <div className="bg-gray-100 min-h-[100vh]">
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
                  listInstructor={listInstructor}
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
        <RegistrationModal
          student={student}
          visible={student?.topicId !== null}
        />
      )}
    </div>
  );
}
