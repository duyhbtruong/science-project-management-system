import { Descriptions } from "antd";
import { LinkIcon } from "lucide-react";
import Link from "next/link";

export const StudentDetails = ({ account, student }) => {
  const studentItems = [
    {
      key: "1",
      label: "Email",
      children: (
        <Link
          target="_blank"
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${account?.email}`}
          className="flex items-center"
        >
          <LinkIcon className="mr-2 size-4" />
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

  return (
    <Descriptions
      column={1}
      bordered
      title="Thông tin Chủ nhiệm đề tài"
      items={studentItems}
    />
  );
};
