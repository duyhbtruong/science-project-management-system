"use client";

import { deleteTopicById, getTopicById } from "@/service/topicService";
import {
  CheckCircleOutlined,
  CloseOutlined,
  ExportOutlined,
  InboxOutlined,
  LinkOutlined,
  PaperClipOutlined,
  SyncOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Descriptions,
  Modal,
  Space,
  Spin,
  Tag,
  Tooltip,
  Upload,
  message,
} from "antd";
const { Dragger } = Upload;
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { uploadSubmitFile } from "@/service/upload";
import Link from "next/link";
import { TopicDetails } from "./topic-details";
import { StudentDetails } from "./student-details";
import { InstructorDetails } from "./instructor-details";

export const TOPIC_STATUS = {
  REVIEWED: "Đã kiểm duyệt",
  PENDING_REVIEW: "Chưa kiểm duyệt",
  APPRAISED: "Đã thẩm định",
  PENDING_APPRAISE: "Chưa thẩm định",
};

const MODAL_CONFIG = {
  title: "Bạn có chắc chắn hủy đăng ký đề tài?",
  content: "Hủy đề tài sẽ xóa toàn bộ thông tin đăng ký của đề tài.",
};

export default function TopicInformationPage({ params }) {
  const { topicId } = params;
  const [account, setAccount] = useState();
  const [student, setStudent] = useState();
  const [instructor, setInstructor] = useState();
  const [period, setPeriod] = useState();
  const [topic, setTopic] = useState();
  const [fileList, setFileList] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();
  const router = useRouter();

  const config = {
    title: "Bạn có chắc chắn hủy đăng ký đề tài?",
    content: (
      <>
        <p>Hủy đề tài sẽ xóa toàn bộ thông tin đăng ký của đề tài.</p>
      </>
    ),
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleImageUpload = () => {
    if (fileList.length === 0) {
      setIsUploadOpen(false);
      return;
    }
    let startDate = new Date(period.startDate);
    let endDate = new Date(period.endDate);
    startDate = startDate.toISOString().slice(0, 10).replace(/-/g, "");
    endDate = endDate.toISOString().slice(0, 10).replace(/-/g, "");
    const periodDir = `${period.title}-${startDate}-${endDate}`;
    const fileRef = ref(
      storage,
      `${periodDir}/${student?.studentId}/${fileList[0].name}`
    );
    uploadBytes(fileRef, fileList[0]?.originFileObj)
      .then((snapshot) => {
        const fileRef = snapshot.ref._location.path_;
        return getDownloadURL(ref(storage, fileRef));
      })
      .then((downloadLink) => uploadSubmitFile(topic._id, downloadLink))
      .then((res) => {
        const { message } = res;
        messageApi.success(message);
        setIsUploadOpen(false);
        loadTopic();
        setFileList([]);
      });
  };

  const loadTopic = async () => {
    let res = await getTopicById(topicId);
    res = await res.json();
    setTopic(res);
    setStudent(res.owner);
    setAccount(res.owner.accountId);
    setInstructor(res.instructor);
    setPeriod(res.registrationPeriod);
  };

  useEffect(() => {
    loadTopic();
  }, []);

  return (
    <div className="bg-gray-100 min-h-[100vh]">
      <div className="py-6 mx-32">
        <div className="flex justify-between p-4 mb-6 bg-white rounded-md">
          <span className="flex justify-center text-lg font-semibold">
            Quản lý Đề tài cá nhân
          </span>
          <Button
            onClick={async () => {
              const confirmed = await modal.confirm(config);
              if (confirmed) {
                await deleteTopicById(topicId);
                router.replace(`/student/topics`);
              }
            }}
            disabled={!topic?.reviews.length > 0 ? false : true}
            icon={<CloseOutlined />}
            danger
          >
            Hủy đăng ký
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {/* Thông tin Đề tài */}
          <Spin spinning={!topic}>
            <div className="flex flex-col gap-4 p-4 bg-white rounded-md">
              <TopicDetails
                topic={topic}
                onUpload={() => setIsUploadOpen(true)}
              />
            </div>
          </Spin>

          <div className="flex gap-4">
            {/* Thông tin chủ nhiệm đề tài */}
            <div className="flex flex-col flex-grow p-4 bg-white rounded-md">
              <Spin className="w-[500px]" spinning={!account || !student}>
                <StudentDetails student={student} account={account} />
              </Spin>
            </div>

            {/* Thông tin GVHD */}
            <div className="flex flex-col flex-grow p-4 bg-white rounded-md">
              <Spin className="flex flex-row" spinning={!instructor}>
                <InstructorDetails instructor={instructor} />
              </Spin>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Upload bản mềm"
        open={isUploadOpen}
        width={800}
        centered
        onOk={handleImageUpload}
        okText="Xác nhận"
        cancelText="Hủy"
        onCancel={() => {
          setFileList([]);
          setIsUploadOpen(false);
        }}
      >
        <Dragger
          name="file"
          accept=".pdf"
          multiple={false}
          maxCount={1}
          onChange={handleChange}
          fileList={fileList}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Nhấn hoặc thả file vào khu vực này để đăng tài liệu.
          </p>
          <p className="ant-upload-hint">
            Định dạng tên File là: MSSV_TEN_DE_TAI.
          </p>
        </Dragger>
      </Modal>
      {modalContextHolder}
      {messageContextHolder}
    </div>
  );
}
