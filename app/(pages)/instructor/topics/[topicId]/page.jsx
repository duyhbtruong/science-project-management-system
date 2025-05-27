"use client";

import { getTopicById } from "@/service/topicService";
import { Modal, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteRegisterFile } from "@/service/upload";
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
  const router = useRouter();

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
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Hướng dẫn đề tài</h1>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Spin spinning={!topic}>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <TopicDetails topic={topic} router={router} />
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
      </div>
    </div>
  );
}
