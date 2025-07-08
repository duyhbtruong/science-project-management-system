import {
  Button,
  Descriptions,
  Tag,
  Card,
  Typography,
  Tooltip,
  List,
} from "antd";
import {
  UsersIcon,
  BookOpenIcon,
  ClipboardListIcon,
  TargetIcon,
  PencilLineIcon,
  ArrowUpRightIcon,
} from "lucide-react";
import ReviewAssignmentsCard from "@/components/review-assignments-card";
import AppraiseAssignmentsCard from "@/components/appraise-assignments-card";

const { Title, Text, Paragraph } = Typography;

export const TopicDetails = ({ topic, router }) => {
  const topicItems = [
    {
      key: "1",
      label: "Tên tiếng Việt",
      children: <Text>{topic?.vietnameseName}</Text>,
      span: 2,
    },
    {
      key: "2",
      label: "Tên tiếng Anh",
      children: <Text>{topic?.englishName}</Text>,
      span: 2,
    },
    {
      key: "3",
      label: "Danh sách thành viên",
      children: (
        <div className="space-y-2">
          {topic &&
            topic.participants?.map((participant, index) => (
              <div
                key={`participant-${index}`}
                className="flex items-center space-x-2"
              >
                <UsersIcon className="text-gray-500 size-4" />
                <Text>{`${index + 1} - ${participant}`}</Text>
              </div>
            ))}
        </div>
      ),
      span: 1,
    },
    {
      key: "4",
      label: "Loại hình nghiên cứu",
      children: (
        <div className="flex items-center space-x-2">
          <BookOpenIcon className="text-gray-500 size-4" />
          <Text>{topic?.type}</Text>
        </div>
      ),
      span: 1,
    },
    {
      key: "5",
      label: "Kết quả kiểm duyệt",
      children: (
        <Tag
          color={
            topic?.reviewAssignments.length === 0 ||
            topic?.reviewAssignments.some(
              (assignment) => assignment.status === "pending"
            ) ||
            topic?.reviewAssignments.every(
              (assignment) => assignment.status === "removed"
            )
              ? "warning"
              : topic?.reviewPassed
              ? "success"
              : "error"
          }
        >
          <span>
            {topic?.reviewAssignments.length === 0 ||
            topic?.reviewAssignments.some(
              (assignment) => assignment.status === "pending"
            ) ||
            topic?.reviewAssignments.every(
              (assignment) => assignment.status === "removed"
            )
              ? "Đang chờ"
              : topic?.reviewPassed
              ? "Đạt"
              : "Không đạt"}
          </span>
        </Tag>
      ),
      span: 1,
    },
    {
      key: "6",
      label: "Kết quả thẩm định",
      children: (
        <Tag
          color={
            topic?.appraiseAssignments.length === 0 ||
            topic?.appraiseAssignments.some(
              (assignment) => assignment.status === "pending"
            ) ||
            topic?.appraiseAssignments.every(
              (assignment) => assignment.status === "removed"
            )
              ? "warning"
              : topic?.appraisePassed
              ? "success"
              : "error"
          }
        >
          <span>
            {topic?.appraiseAssignments.length === 0 ||
            topic?.appraiseAssignments.some(
              (assignment) => assignment.status === "pending"
            ) ||
            topic?.appraiseAssignments.every(
              (assignment) => assignment.status === "removed"
            )
              ? "Đang chờ"
              : topic?.appraisePassed
              ? "Đạt"
              : "Không đạt"}
          </span>
        </Tag>
      ),
      span: 1,
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <Title level={4} className="mb-4">
          Thông tin Đề tài
        </Title>
        <Descriptions
          column={2}
          bordered
          items={topicItems}
          className="topic-descriptions"
        />
      </Card>

      <Card className="shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <Title level={4} className="!mb-0">
            Tài liệu đính kèm
          </Title>
          <Tooltip title="Bạn chỉ có thể viết báo cáo khi đề tài được kiểm duyệt">
            <Button
              type="primary"
              href={`/instructor/topics/${topic?._id}/reports/${topic?.report[0]?._id}`}
              disabled={!topic?.reviewPassed}
            >
              <PencilLineIcon className="size-4" />
              Viết báo cáo
            </Button>
          </Tooltip>
        </div>
        {topic?.files?.length > 0 && (
          <List
            itemLayout="horizontal"
            dataSource={topic?.files}
            renderItem={(file) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    file.fileType === "register"
                      ? "Hồ sơ đăng ký"
                      : file.fileType === "contract"
                      ? "Hợp đồng"
                      : file.fileType === "submit"
                      ? "Báo cáo"
                      : "Báo cáo tài chính"
                  }
                  description={file.fileName}
                />
                <Button href={file.fileUrl} target="_blank">
                  Đường dẫn
                  <ArrowUpRightIcon className="size-4" />
                </Button>
              </List.Item>
            )}
          />
        )}
      </Card>

      <Card className="shadow-sm">
        <div className="flex items-center mb-4 space-x-2">
          <ClipboardListIcon className="text-gray-500 size-5" />
          <Title level={4} className="!mb-0">
            Tóm tắt đề tài
          </Title>
        </div>
        <Paragraph className="text-gray-700 whitespace-pre-line">
          {topic?.summary || "Chưa có tóm tắt đề tài"}
        </Paragraph>
      </Card>

      <Card className="shadow-sm">
        <div className="flex items-center mb-4 space-x-2">
          <TargetIcon className="text-gray-500 size-5" />
          <Title level={4} className="!mb-0">
            Kết quả dự kiến
          </Title>
        </div>
        <Paragraph className="text-gray-700 whitespace-pre-line">
          {topic?.expectedResult || "Chưa có kết quả dự kiến"}
        </Paragraph>
      </Card>

      <ReviewAssignmentsCard reviewAssignments={topic?.reviewAssignments} />
      <AppraiseAssignmentsCard
        appraiseAssignments={topic?.appraiseAssignments}
      />
    </div>
  );
};
