import Link from "next/link";
import { Descriptions, Card, Tag, Space } from "antd";
import { LinkIcon } from "lucide-react";
import ReviewAssignmentsCard from "@/components/review-assignments-card";
import AppraiseAssignmentsCard from "@/components/appraise-assignments-card";

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
          className="flex items-center justify-center"
        >
          <LinkIcon className="mr-1 size-4" />
          {record.instructor.accountId.email}
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
      label: "Tóm tắt",
      key: "summary",
      children: <p>{record.summary}</p>,
    },
    {
      label: "Kết quả mong đợi",
      key: "expectedResult",
      children: <p>{record.expectedResult}</p>,
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
    {
      label: "Tài liệu tham khảo",
      key: "reference",
      children: (
        <p>
          {record.reference.map((ref, index) => (
            <span key={`reference-${index}`}>
              {index + 1}. {ref}
              <br />
            </span>
          ))}
        </p>
      ),
    },
  ];

  return (
    <div className="space-y-6">
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
