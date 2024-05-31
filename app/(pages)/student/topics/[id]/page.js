"use client";

import {
  CloseOutlined,
  MinusCircleOutlined,
  SyncOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Descriptions, FloatButton, Tag } from "antd";

export default function TopicInformationPage() {
  const studentItems = [
    {
      key: "1",
      label: "Email",
      children: <p>21520789@gm.uit.edu.vn</p>,
    },
    {
      key: "2",
      label: "Họ và tên",
      children: <p>Trương Hoàng Bảo Duy</p>,
    },
    {
      key: "3",
      label: "Số điện thoại",
      children: <p>0818122003</p>,
    },
    {
      key: "4",
      label: "Đơn vị",
      children: <p>Công nghệ Phần mềm</p>,
    },
    {
      key: "5",
      label: "Chương trình đào tạo",
      children: <p>Chất lượng cao</p>,
    },
  ];

  const topicItems = [
    {
      key: "1",
      label: "Tên tiếng Việt",
      children: <p>QUẢN LÝ QUY TRÌNH THỰC HIỆN ĐỀ TÀI NGHIÊN CỨU KHOA HỌC</p>,
      span: 2,
    },
    {
      key: "2",
      label: "Tên tiếng Anh",
      children: (
        <p>
          APPLICATION FOR MANAGEMENT OF THE PROCESS OF STUDENT SCIENTIFIC
          RESEARCHING PROJECTS
        </p>
      ),
      span: 2,
    },
    {
      key: "3",
      label: "Danh sách thành viên",
      children: (
        <ul>
          <li>1. Trương Hoàng Bảo Duy</li>
          <li>2. Nguyễn Văn A</li>
        </ul>
      ),
      span: 1,
    },
    {
      key: "4",
      label: "Loại hình nghiên cứu",
      children: <p>Nghiên cứu cơ bản</p>,
      span: 2,
    },
    {
      key: "5",
      label: "Trạng thái kiểm duyệt",
      children: (
        <Tag icon={<SyncOutlined spin />} color="processing">
          Đang kiểm duyệt
        </Tag>
      ),
      span: 1,
    },
    {
      key: "6",
      label: "Trạng thái thẩm định",
      children: (
        <Tag icon={<MinusCircleOutlined />} color="default">
          Chưa thẩm định
        </Tag>
      ),
      span: 1,
    },
  ];

  const instructorItems = [
    {
      key: "1",
      label: "Email",
      children: <p>tronglt@uit.edu.vn</p>,
    },
    {
      key: "2",
      label: "Họ và tên",
      children: <p>Lê Thanh Trọng</p>,
    },
    {
      key: "3",
      label: "Học hàm, học vị",
      children: <p>Thạc sĩ</p>,
    },
    {
      key: "4",
      label: "Khoa",
      children: <p>Công nghệ Phần mềm</p>,
    },
  ];

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-56px)]">
      <div className="mx-32 py-6">
        <div className="flex justify-between mb-6 bg-white rounded-md p-4">
          <span className="text-xl font-semibold text-blue-600">
            Quản lý Đề tài cá nhân
          </span>
          <Button icon={<CloseOutlined />} danger>
            Hủy đăng ký
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          {/* Thông tin Đề tài */}
          <div className="flex flex-grow flex-col p-4 rounded-md bg-white">
            <Descriptions
              column={2}
              bordered
              title="Thông tin Đề tài"
              items={topicItems}
              extra={
                <Button type="primary" icon={<UploadOutlined />}>
                  Nộp bản mềm
                </Button>
              }
            />
          </div>

          <div className="flex gap-4">
            {/* Thông tin chủ nhiệm đề tài */}
            <div className="flex flex-grow flex-col p-4 rounded-md bg-white">
              <Descriptions
                column={1}
                bordered
                title="Thông tin Chủ nhiệm đề tài"
                items={studentItems}
              />
            </div>

            {/* Thông tin GVHD */}
            <div className="flex flex-grow flex-col p-4 rounded-md bg-white">
              <Descriptions
                column={1}
                bordered
                title="Thông tin Giảng viên hướng dẫn"
                items={instructorItems}
              />
            </div>
          </div>
        </div>
      </div>
      <FloatButton.BackTop />
    </div>
  );
}
