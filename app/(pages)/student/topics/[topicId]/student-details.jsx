import { Descriptions, Card, Typography } from "antd";
import {
  LinkIcon,
  UserIcon,
  IdCardIcon,
  PhoneIcon,
  BuildingIcon,
  GraduationCapIcon,
} from "lucide-react";
import Link from "next/link";

const { Title, Text } = Typography;

export const StudentDetails = ({ account, student }) => {
  const studentItems = [
    {
      key: "1",
      label: "Email",
      children: (
        <Link
          target="_blank"
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${account?.email}`}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <LinkIcon className="size-4" />
          <Text className="text-blue-600 hover:text-blue-800">
            {account?.email}
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
          <Text>{account?.name}</Text>
        </div>
      ),
    },
    {
      key: "3",
      label: "Mã số sinh viên",
      children: (
        <div className="flex items-center space-x-2">
          <IdCardIcon className="text-gray-500 size-4" />
          <Text>{student?.studentId}</Text>
        </div>
      ),
    },
    {
      key: "4",
      label: "Số điện thoại",
      children: (
        <div className="flex items-center space-x-2">
          <PhoneIcon className="text-gray-500 size-4" />
          <Text>{account?.phone ? account?.phone : "Không có"}</Text>
        </div>
      ),
    },
    {
      key: "5",
      label: "Đơn vị",
      children: (
        <div className="flex items-center space-x-2">
          <BuildingIcon className="text-gray-500 size-4" />
          <Text>{student?.faculty}</Text>
        </div>
      ),
    },
    {
      key: "6",
      label: "Chương trình đào tạo",
      children: (
        <div className="flex items-center space-x-2">
          <GraduationCapIcon className="text-gray-500 size-4" />
          <Text>{student?.educationProgram}</Text>
        </div>
      ),
    },
  ];

  return (
    <Card className="shadow-sm">
      <Title level={4} className="mb-4">
        Thông tin Chủ nhiệm đề tài
      </Title>
      <Descriptions
        column={1}
        bordered
        items={studentItems}
        className="student-descriptions"
      />
    </Card>
  );
};
