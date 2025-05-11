import Link from "next/link";
import { Descriptions, Card, Tag, Space } from "antd";
import {
  LinkIcon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon,
} from "lucide-react";

const StatusIcon = ({ status }) => {
  switch (status) {
    case "completed":
      return <CheckCircle2Icon className="text-green-500 size-4" />;
    case "pending":
      return <ClockIcon className="text-yellow-500 size-4" />;
    case "removed":
      return <XCircleIcon className="text-red-500 size-4" />;
    default:
      return null;
  }
};

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

  const renderReviewAssignments = () => {
    if (!record.reviewAssignments?.length) {
      return <p>Chưa có giảng viên kiểm duyệt</p>;
    }

    return (
      <div className="grid grid-cols-1 gap-4 overflow-auto md:grid-cols-2">
        {record.reviewAssignments.map((assignment, index) => (
          <Card key={`review-${index}`} size="small" className="shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Giảng viên kiểm duyệt {index + 1}</h4>
              <Space>
                <StatusIcon status={assignment.status} />
                <Tag
                  color={
                    assignment.status === "completed"
                      ? "success"
                      : assignment.status === "pending"
                      ? "warning"
                      : "error"
                  }
                >
                  {assignment.status === "completed"
                    ? "Hoàn thành"
                    : assignment.status === "pending"
                    ? "Đang chờ"
                    : "Đã hủy"}
                </Tag>
              </Space>
            </div>
            <p className="text-sm text-gray-600">
              Phân công: {new Date(assignment.assignedAt).toLocaleDateString()}
            </p>
            {assignment.reviewGrade.status === "completed" && (
              <p className="text-sm text-gray-600">Đã có đánh giá</p>
            )}
          </Card>
        ))}
      </div>
    );
  };

  const renderAppraiseAssignments = () => {
    if (!record.appraiseAssignments?.length) {
      return <p>Chưa có hội đồng thẩm định</p>;
    }

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {record.appraiseAssignments.map((assignment, index) => (
          <Card key={`appraise-${index}`} size="small" className="shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Hội đồng thẩm định {index + 1}</h4>
              <Space>
                <StatusIcon status={assignment.status} />
                <Tag
                  color={
                    assignment.status === "completed"
                      ? "success"
                      : assignment.status === "pending"
                      ? "warning"
                      : "error"
                  }
                >
                  {assignment.status === "completed"
                    ? "Hoàn thành"
                    : assignment.status === "pending"
                    ? "Đang chờ"
                    : "Đã hủy"}
                </Tag>
              </Space>
            </div>
            <p className="text-sm text-gray-600">
              Phân công: {new Date(assignment.assignedAt).toLocaleDateString()}
            </p>
            {assignment.appraiseGrade.status === "completed" && (
              <p className="text-sm text-gray-600">Đã có đánh giá</p>
            )}
          </Card>
        ))}
      </div>
    );
  };

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
        {renderReviewAssignments()}
      </div>
      <div>
        <h3 className="mb-4 text-lg font-medium">Thông tin Thẩm định</h3>
        {renderAppraiseAssignments()}
      </div>
    </div>
  );
};

export default ExpandedRow;
