"use client";

import { deleteTopicById, getTopicById } from "@/service/topicService";
import { XIcon } from "lucide-react";
import { Button, Modal, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteFile } from "@/service/uploadService";
import { TopicDetails } from "./topic-details";
import { StudentDetails } from "./student-details";
import { InstructorDetails } from "./instructor-details";

export default function TopicInformationPage({ params }) {
  const { topicId } = params;

  const [account, setAccount] = useState();
  const [student, setStudent] = useState();
  const [instructor, setInstructor] = useState();
  const [period, setPeriod] = useState();
  const [topic, setTopic] = useState();
  const [modal, modalContextHolder] = Modal.useModal();
  const router = useRouter();

  const config = {
    title: "Bạn có chắc chắn hủy đăng ký đề tài?",
    content: (
      <>
        <p>Hủy đề tài sẽ xóa toàn bộ thông tin đăng ký của đề tài.</p>
      </>
    ),
  };

  const handleDeleteFile = async () => {
    try {
      await deleteFile(topicId, "register");
    } catch (error) {
      console.error("Lỗi xóa file ", error);
    }
  };

  const loadTopic = async () => {
    let res = await getTopicById(topicId);
    if (res.ok) {
      res = await res.json();
      setTopic(res);
      setStudent(res.owner);
      setAccount(res.owner.accountId);
      setInstructor(res.instructor);
      setPeriod(res.registrationPeriod);
    }
  };

  useEffect(() => {
    loadTopic();
  }, []);

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản lý Đề tài cá nhân
        </h1>
        <Button
          onClick={async () => {
            const confirmed = await modal.confirm(config);
            if (confirmed) {
              await deleteTopicById(topicId).finally(() => handleDeleteFile());
              router.replace(`/student/topics`);
            }
          }}
          disabled={!topic || topic.reviewAssignments.length > 0}
          danger
          className="flex items-center gap-2"
        >
          <XIcon className="size-4" />
          Hủy đăng ký
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Spin spinning={!topic}>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <TopicDetails topic={topic} router={router} loadTopic={loadTopic} />
          </div>
        </Spin>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <Spin spinning={!account || !student}>
              <StudentDetails student={student} account={account} />
            </Spin>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <Spin spinning={!instructor}>
              <InstructorDetails instructor={instructor} />
            </Spin>
          </div>
        </div>
      </div>
      {modalContextHolder}
    </div>
  );
}
