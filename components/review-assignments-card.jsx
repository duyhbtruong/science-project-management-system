import { Card, Tag, Space, Typography } from "antd";
import StatusIcon from "@/components/status-icon";
import { ClipboardCheck } from "lucide-react";

const { Title } = Typography;

export default function ReviewAssignmentsCard({ reviewAssignments }) {
  if (
    !reviewAssignments?.length ||
    reviewAssignments.every((a) => a.status === "removed")
  ) {
    return (
      <Card className="shadow-sm">
        <div className="flex items-center mb-4 space-x-2">
          <ClipboardCheck className="text-gray-500 size-5" />
          <Title level={4} className="!mb-0">
            Kết quả kiểm duyệt
          </Title>
        </div>
        <p>Chưa có giảng viên kiểm duyệt</p>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <div className="flex items-center mb-4 space-x-2">
        <ClipboardCheck className="text-gray-500 size-5" />
        <Title level={4} className="!mb-0">
          Kết quả kiểm duyệt
        </Title>
      </div>
      <div className="grid overflow-auto grid-cols-1 gap-4 md:grid-cols-2">
        {reviewAssignments
          .filter((assignment) => assignment.status !== "removed")
          .map((assignment, index) => (
            <Card key={`review-${index}`} size="small" className="shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">
                  Giảng viên kiểm duyệt {index + 1}
                </h4>
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
                Phân công:{" "}
                {new Date(assignment.assignedAt).toLocaleDateString()}
              </p>
              {assignment.reviewGrade.status === "completed" && (
                <p className="text-sm text-gray-600">Đã có đánh giá</p>
              )}
            </Card>
          ))}
      </div>
    </Card>
  );
}
