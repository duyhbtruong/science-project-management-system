"use client";

import { getAccountById } from "@/service/accountService";
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
  Flex,
  Modal,
  Space,
  Spin,
  Tag,
  Tooltip,
  Upload,
  message,
} from "antd";
const { Dragger } = Upload;
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { uploadFile } from "@/service/upload";
import Link from "next/link";

export default function TopicInformationPage({ params }) {
  const { id: topicId } = params;
  const session = useSession();
  const accountId = session?.data?.user?.id;
  const [account, setAccount] = useState();
  const [student, setStudent] = useState();
  const [topic, setTopic] = useState();
  const [fileUpload, setFileUpload] = useState([]);
  // const [fileLink, setFileLink] = useState();
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
        <Tag
          icon={
            topic?.isReviewed ? <CheckCircleOutlined /> : <SyncOutlined spin />
          }
          color={topic?.isReviewed ? "success" : "default"}
        >
          {topic?.isReviewed ? "Đã kiểm duyệt" : "Chưa kiểm duyệt"}
        </Tag>
      ),
      span: 1,
    },
    {
      key: "6",
      label: "Trạng thái thẩm định",
      children: (
        <Tag
          icon={
            topic?.isAppraised ? <CheckCircleOutlined /> : <SyncOutlined spin />
          }
          color={topic?.isAppraised ? "success" : "default"}
        >
          {topic?.isAppraised ? "Đã thẩm định" : "Chưa thẩm định"}
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
          {topic?.instructor?.email}
        </Link>
      ),
    },
    {
      key: "2",
      label: "Họ và tên",
      children: <p>{topic?.instructor?.name}</p>,
    },
    {
      key: "3",
      label: "Học hàm, học vị",
      children: <p>{topic?.instructor?.academicRank}</p>,
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

  const handleChange = ({ fileList: newFile }) => {
    setFileUpload(newFile);
  };

  const handleImageUpload = () => {
    if (fileUpload.length === 0) {
      setIsUploadOpen(false);
      return;
    }
    // const dateTime = giveCurrentDateTime();
    const fileRef = ref(storage, `${student?.studentId}/${fileUpload[0].name}`);
    uploadBytes(fileRef, fileUpload[0]?.originFileObj)
      .then((snapshot) => {
        const fileRef = snapshot.ref._location.path_;
        return getDownloadURL(ref(storage, fileRef));
      })
      .then((downloadLink) => uploadFile(topic._id, downloadLink))
      .then((res) => {
        const { message } = res;
        messageApi.success(message);
        setIsUploadOpen(false);
        loadTopic();
        setFileUpload([]);
      });
  };

  const loadAccount = async () => {
    const res = await getAccountById(accountId);
    setAccount(res.account);
    setStudent(res.student);
  };

  const loadTopic = async () => {
    const res = await getTopicById(topicId);
    setTopic(res);
  };

  useEffect(() => {
    if (!accountId) return;
    loadAccount();
  }, [accountId]);

  useEffect(() => {
    loadTopic();
  }, []);

  // useEffect(() => {
  //   if (!topic) return;
  //   if (!topic.fileRef) return;
  //   getDownloadURL(ref(storage, topic?.fileRef)).then((url) =>
  //     setFileLink(url)
  //   );
  // }, [topic]);
  // console.log(topic);
  // console.log(fileUpload[0]?.originFileObj);
  // console.log(">>> topic: ", topic);

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-56px)]">
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
            disabled={!topic?.isReviewed ? false : true}
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
                    {topic?.fileRef && (
                      <Link
                        target="_blank"
                        className="mr-2"
                        href={topic?.fileRef}
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
          setFileUpload([]);
          setIsUploadOpen(false);
        }}
      >
        <Dragger
          name="file"
          accept=".pdf"
          multiple={false}
          maxCount={1}
          onChange={handleChange}
          fileList={fileUpload}
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
