import Link from "next/link";
import { Descriptions, Typography } from "antd";
import { LinkIcon } from "lucide-react";
import ReviewAssignmentsCard from "@/components/review-assignments-card";
import AppraiseAssignmentsCard from "@/components/appraise-assignments-card";
const { Text } = Typography;

const ExpandedRow = ({ record }) => {
  const instructorItems = [
    {
      label: "Tên",
      key: "name",
      children: <p>{record.instructor.accountId.name}</p>,
    },
    {
      label: "Email",
      key: "email",
      children: (
        <Link
          target="_blank"
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${record.instructor.email}`}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <LinkIcon className="size-4" />
          <Text className="text-blue-600 hover:text-blue-800">
            {record.instructor.accountId.email}
          </Text>
        </Link>
      ),
    },
    {
      label: "Học hàm, học vị",
      key: "academicRank",
      children: <p>{record.instructor.academicRank}</p>,
    },
    {
      label: "Khoa",
      key: "faculty",
      children: <p>{record.instructor.faculty}</p>,
    },
  ];

  const topicDataItems = [
    {
      label: "Loại hình nghiên cứu",
      key: "type",
      children: <p>{record.type}</p>,
    },
    {
      label: "Thành viên",
      key: "participants",
      children: (
        <p>
          {record.participants.map((participant, index) => (
            <span key={`participant-${index}`}>
              {index + 1}. {participant}
              <br />
            </span>
          ))}
        </p>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Descriptions
        title="Thông tin Giảng viên Hướng dẫn"
        items={instructorItems}
      />
      <Descriptions
        title="Thông tin Đề tài"
        items={topicDataItems}
        column={2}
      />
      <div>
        <h3 className="mb-4 text-lg font-medium">Thông tin Kiểm duyệt</h3>
        <ReviewAssignmentsCard reviewAssignments={record.reviewAssignments} />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-medium">Thông tin Thẩm định</h3>
        <AppraiseAssignmentsCard
          appraiseAssignments={record.appraiseAssignments}
        />
      </div>
    </div>
  );
};

export default ExpandedRow;
