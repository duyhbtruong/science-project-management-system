import { Card, Tag, Space, Typography } from "antd";
import StatusIcon from "@/components/status-icon";
import { ClipboardCheck } from "lucide-react";

const { Title } = Typography;

export default function AppraiseAssignmentsCard({ appraiseAssignments }) {
  if (
    !appraiseAssignments?.length ||
    appraiseAssignments.every((a) => a.status === "removed")
  ) {
    return (
      <Card className="shadow-sm">
        <div className="flex items-center mb-4 space-x-2">
          <ClipboardCheck className="text-gray-500 size-5" />
          <Title level={4} className="!mb-0">
            Kết quả thẩm định
          </Title>
        </div>
        <p>Chưa có hội đồng thẩm định</p>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <div className="flex items-center mb-4 space-x-2">
        <ClipboardCheck className="text-gray-500 size-5" />
        <Title level={4} className="!mb-0">
          Kết quả thẩm định
        </Title>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {appraiseAssignments
          .filter((assignment) => assignment.status !== "removed")
          .map((assignment, index) => (
            <Card
              key={`appraisal-board-${index}`}
              size="small"
              className="shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
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
                Phân công:{" "}
                {new Date(assignment.assignedAt).toLocaleDateString()}
              </p>
              {assignment.appraiseGrade.status === "completed" && (
                <p className="text-sm text-gray-600">Đã có đánh giá</p>
              )}
            </Card>
          ))}
      </div>
    </Card>
  );
}
