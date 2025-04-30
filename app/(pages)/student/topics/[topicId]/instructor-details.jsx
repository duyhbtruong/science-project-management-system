import Link from "next/link";
import { Descriptions } from "antd";
import { LinkIcon } from "lucide-react";

export const InstructorDetails = ({ instructor }) => {
  const instructorItems = [
    {
      key: "1",
      label: "Email",
      children: (
        <Link
          target="_blank"
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${instructor?.accountId.email}`}
          className="flex items-center"
        >
          <LinkIcon className="mr-2 size-4" />
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

  return (
    <Descriptions
      column={1}
      bordered
      title="Thông tin Giảng viên hướng dẫn"
      items={instructorItems}
    />
  );
};
