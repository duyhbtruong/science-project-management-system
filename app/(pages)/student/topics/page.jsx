"use client";

import { useEffect, useState } from "react";
import TopicTable from "./topic-table";
import { getAccountById } from "@/service/accountService";
import { getTopicsByOwner } from "@/service/topicService";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { useCustomSession } from "@/hooks/use-custom-session";

export default function TopicsPage() {
  const { session, status } = useCustomSession();

  const [loading, setLoading] = useState(true);
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
    if (!session || status === "loading") return;
    setUser(session?.user);
  }, [session]);

  useEffect(() => {
    if (!user) return;
    loadStudent();
  }, [user]);

  useEffect(() => {
    if (!student) return;
    loadListTopic();
    setLoading(false);
  }, [student]);

  if (loading) return <FullscreenLoader label="List topic loading..." />;

  return (
    <div className="bg-gray-100 min-h-[100vh]">
      <div className="flex flex-col py-6 mx-32">
        <TopicTable listTopic={listTopic} />
      </div>
    </div>
  );
}
