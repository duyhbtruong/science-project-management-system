import Link from "next/link";
import { Descriptions, Card, Typography } from "antd";
import {
  LinkIcon,
  UserIcon,
  GraduationCapIcon,
  BuildingIcon,
} from "lucide-react";

const { Title, Text } = Typography;

export const InstructorDetails = ({ instructor }) => {
  const instructorItems = [
    {
      key: "1",
      label: "Email",
      children: (
        <Link
          target="_blank"
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${instructor?.accountId.email}`}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <LinkIcon className="size-4" />
          <Text className="text-blue-600 hover:text-blue-800">
            {instructor?.accountId.email}
          </Text>
        </Link>
      ),
    },
    {
      key: "2",
      label: "Họ và tên",
      children: (
        <div className="flex items-center space-x-2">
          <UserIcon className="text-gray-500 size-4" />
          <Text>{instructor?.accountId.name}</Text>
        </div>
      ),
    },
    {
      key: "3",
      label: "Học hàm, học vị",
      children: (
        <div className="flex items-center space-x-2">
          <GraduationCapIcon className="text-gray-500 size-4" />
          <Text>{instructor?.academicRank}</Text>
        </div>
      ),
    },
    {
      key: "4",
      label: "Khoa",
      children: (
        <div className="flex items-center space-x-2">
          <BuildingIcon className="text-gray-500 size-4" />
          <Text>{instructor?.faculty}</Text>
        </div>
      ),
    },
  ];

  return (
    <Card className="shadow-sm">
      <Title level={4} className="mb-4">
        Thông tin Giảng viên hướng dẫn
      </Title>
      <Descriptions
        column={1}
        bordered
        items={instructorItems}
        className="instructor-descriptions"
      />
    </Card>
  );
};
