"use client";

import { useEffect, useState } from "react";
import TopicTable from "./topic-table";
import { useSession } from "next-auth/react";
import { getAccountById } from "@/service/accountService";
import { getTopicsByOwner } from "@/service/topicService";
import { FullscreenLoader } from "@/components/fullscreen-loader";

export default function TopicsPage() {
  const session = useSession();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState();
  const [student, setStudent] = useState();
  const [listTopic, setListTopic] = useState([]);

  const loadStudent = async () => {
    const res = await getAccountById(user.id);
    if (res.ok) {
      const { student } = await res.json();
      setStudent(student);
    }
  };

  const loadListTopic = async () => {
    const res = await getTopicsByOwner(student._id);
    if (res.ok) {
      setListTopic(await res.json());
    }
  };

  useEffect(() => {
    if (!session || session.status === "loading") return;
    setUser(session.data.user);
  }, [session]);

  useEffect(() => {
    if (!user) return;
    loadStudent();
  }, [user]);

  useEffect(() => {
    if (!student) return;
    loadListTopic();
    setIsLoading(false);
  }, [student]);

  if (isLoading) return <FullscreenLoader label="List topic loading..." />;

  return (
    <div className="bg-gray-100 min-h-[100vh]">
      <div className="flex flex-col py-6 mx-32">
        <TopicTable listTopic={listTopic} />
      </div>
    </div>
  );
}
