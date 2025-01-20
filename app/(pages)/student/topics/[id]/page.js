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

export default function TopicInformationPage({ params }) {
  const { id: topicId } = params;
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

  const studentItems = [
    {
      key: "1",
      label: "Email",
      children: (
        <Link
          target="_blank"
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${account?.email}`}
        >
          <ExportOutlined className="mr-2" />
          {account?.email}
        </Link>
      ),
    },
    {
      key: "2",
      label: "Họ và tên",
      children: <p>{account?.name}</p>,
    },
    {
      key: "3",
      label: "Mã số sinh viên",
      children: <p>{student?.studentId}</p>,
    },
    {
      key: "4",
      label: "Số điện thoại",
      children: <p>{account?.phone}</p>,
    },
    {
      key: "5",
      label: "Đơn vị",
      children: <p>{student?.faculty}</p>,
    },
    {
      key: "6",
      label: "Chương trình đào tạo",
      children: <p>{student?.educationProgram}</p>,
    },
  ];

  const topicItems = [
    {
      key: "1",
      label: "Tên tiếng Việt",
      children: <p>{topic?.vietnameseName}</p>,
      span: 2,
    },
    {
      key: "2",
      label: "Tên tiếng Anh",
      children: <p>{topic?.englishName}</p>,
      span: 2,
    },
    {
      key: "3",
      label: "Danh sách thành viên",
      children: (
        <ul>
          {topic &&
            topic.participants?.map((participant, index) => {
              return (
                <li key={`participant-${index}`}>{`${
                  index + 1
                } - ${participant}`}</li>
              );
            })}
        </ul>
      ),
      span: 1,
    },
    {
      key: "4",
      label: "Loại hình nghiên cứu",
      children: <p>{topic?.type}</p>,
      span: 1,
    },
    {
      key: "5",
      label: "Trạng thái kiểm duyệt",
      children: (
        <>
          <Tag
            icon={
              topic?.reviews.length > 0 ? (
                <CheckCircleOutlined />
              ) : (
                <SyncOutlined spin />
              )
            }
            color={topic?.reviews.length > 0 ? "success" : "default"}
          >
            {topic?.reviews.length > 0 ? "Đã kiểm duyệt" : "Chưa kiểm duyệt"}
          </Tag>

          {topic?.reviews.length > 0 && <Button>Test</Button>}
        </>
      ),
      span: 1,
    },
    {
      key: "6",
      label: "Trạng thái thẩm định",
      children: (
        <Tag
          icon={
            topic?.appraises.length ? (
              <CheckCircleOutlined />
            ) : (
              <SyncOutlined spin />
            )
          }
          color={topic?.appraises.length ? "success" : "default"}
        >
          {topic?.appraises.length ? "Đã thẩm định" : "Chưa thẩm định"}
        </Tag>
      ),
      span: 1,
    },
  ];

  const instructorItems = [
    {
      key: "1",
      label: "Email",
      children: (
        <Link
          target="_blank"
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${topic?.instructor?.email}`}
        >
          <ExportOutlined className="mr-2" />
          {instructor?.accountId.email}
        </Link>
      ),
    },
    {
      key: "2",
      label: "Họ và tên",
      children: <p>{instructor?.accountId.name}</p>,
    },
    {
      key: "3",
      label: "Học hàm, học vị",
      children: <p>{instructor?.academicRank}</p>,
    },
    {
      key: "4",
      label: "Khoa",
      children: <p>{instructor?.faculty}</p>,
    },
  ];

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
              <Descriptions
                column={2}
                bordered
                title="Thông tin Đề tài"
                items={topicItems}
                extra={
                  <Space>
                    {topic?.submitFile && (
                      <Link
                        target="_blank"
                        className="mr-2"
                        href={topic?.submitFile}
                      >
                        <PaperClipOutlined className="mr-1" />
                        Tài liệu đã tải lên
                      </Link>
                    )}
                    <Tooltip
                      title={
                        !topic?.isReviewed
                          ? "Bạn phải được kiểm duyệt trước khi nộp bản mềm!"
                          : ""
                      }
                    >
                      <Button
                        disabled={topic?.isReviewed ? false : true}
                        type="primary"
                        icon={<UploadOutlined />}
                        onClick={() => setIsUploadOpen(true)}
                      >
                        Nộp bản mềm
                      </Button>
                    </Tooltip>
                  </Space>
                }
              />
            </div>
          </Spin>

          <div className="flex gap-4">
            {/* Thông tin chủ nhiệm đề tài */}
            <div className="flex flex-col flex-grow p-4 bg-white rounded-md">
              <Spin className="w-[500px]" spinning={!account || !student}>
                <Descriptions
                  column={1}
                  bordered
                  title="Thông tin Chủ nhiệm đề tài"
                  items={studentItems}
                />
              </Spin>
            </div>

            {/* Thông tin GVHD */}
            <div className="flex flex-col flex-grow p-4 bg-white rounded-md">
              <Spin className="flex flex-row" spinning={!topic}>
                <Descriptions
                  column={1}
                  bordered
                  title="Thông tin Giảng viên hướng dẫn"
                  items={instructorItems}
                />
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
