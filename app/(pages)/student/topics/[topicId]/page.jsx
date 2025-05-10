"use client";

import { deleteTopicById, getTopicById } from "@/service/topicService";
import { CloseOutlined, InboxOutlined } from "@ant-design/icons";
import { Button, Modal, Spin, Upload, message } from "antd";
const { Dragger } = Upload;
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { deleteRegisterFile, uploadSubmitFile } from "@/service/upload";
import { TopicDetails } from "./topic-details";
import { StudentDetails } from "./student-details";
import { InstructorDetails } from "./instructor-details";
import { FullscreenLoader } from "@/components/fullscreen-loader";

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

  const handleUploadFile = () => {
    if (fileList.length === 0) {
      setIsUploadOpen(false);
      return;
    }
    let startDate = new Date(period.startDate);
    let endDate = new Date(period.endDate);
    startDate = startDate.toISOString().slice(0, 10).replace(/-/g, "");
    endDate = endDate.toISOString().slice(0, 10).replace(/-/g, "");
    const periodDir = `${period.title}-${startDate}-${endDate}`;

    const file = listFile[0];
    const fileName = file.name;
    const fileRef = ref(
      storage,
      `${periodDir}/${student?.studentId}/${fileList[0].name}`
    );
    uploadBytes(fileRef, file?.originFileObj)
      .then((snapshot) => {
        const fileRef = snapshot.ref._location.path_;
        return getDownloadURL(ref(storage, fileRef));
      })
      .then((downloadLink) => {
        const submitFile = {
          name: fileName,
          url: downloadLink,
        };
        uploadSubmitFile(topic._id, submitFile);
      })
      .then((res) => {
        const { message } = res;
        messageApi.success(message);
        setIsUploadOpen(false);
        loadTopic();
        setFileList([]);
      });
  };

  const handleDeleteFile = async (filePath) => {
    try {
      const res = await deleteRegisterFile(filePath);
      if (res.ok) {
        console.log("Xóa file thành công.");
      } else {
        console.error("Lỗi xóa file.");
      }
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

  console.log("TOPIC: ", topic);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý Đề tài cá nhân
          </h1>
          <Button
            onClick={async () => {
              const confirmed = await modal.confirm(config);
              if (confirmed) {
                await deleteTopicById(topicId).finally(() =>
                  handleDeleteFile(topic.registerFile)
                );
                router.replace(`/student/topics`);
              }
            }}
            disabled={!topic || topic.reviewAssignments.length > 0}
            icon={<CloseOutlined />}
            danger
            className="flex items-center gap-2"
          >
            Hủy đăng ký
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Spin spinning={!topic}>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <TopicDetails
                topic={topic}
                onUpload={() => setIsUploadOpen(true)}
              />
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

      <Modal
        title={
          <div className="text-lg font-semibold text-gray-800">
            Upload bản mềm
          </div>
        }
        open={isUploadOpen}
        width={800}
        centered
        onOk={handleUploadFile}
        okText="Xác nhận"
        cancelText="Hủy"
        onCancel={() => {
          setFileList([]);
          setIsUploadOpen(false);
        }}
        className="upload-modal"
      >
        <Dragger
          name="file"
          accept=".pdf"
          multiple={false}
          maxCount={1}
          onChange={handleChange}
          fileList={fileList}
          className="upload-dragger"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined className="text-4xl text-blue-500" />
          </p>
          <p className="text-lg font-medium text-gray-700 ant-upload-text">
            Nhấn hoặc thả file vào khu vực này để đăng tài liệu
          </p>
          <p className="text-gray-500 ant-upload-hint">
            Định dạng tên File là: MSSV_TEN_DE_TAI
          </p>
        </Dragger>
      </Modal>
      {modalContextHolder}
      {messageContextHolder}
    </div>
  );
}
