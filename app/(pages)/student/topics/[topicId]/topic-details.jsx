import { Button, Descriptions, Space, Tag, Card, Typography } from "antd";
import {
  CheckIcon,
  LoaderIcon,
  UploadIcon,
  UsersIcon,
  BookOpenIcon,
  FileTextIcon,
  ClipboardListIcon,
  TargetIcon,
  ArrowRightIcon,
} from "lucide-react";
import Link from "next/link";
import ReviewAssignmentsCard from "@/components/review-assignments-card";
import AppraiseAssignmentsCard from "@/components/appraise-assignments-card";

const { Title, Text, Paragraph } = Typography;

export const TopicDetails = ({ topic, router }) => {
  const topicItems = [
    {
      key: "1",
      label: "Tên tiếng Việt",
      children: <Text className="text-lg">{topic?.vietnameseName}</Text>,
      span: 2,
    },
    {
      key: "2",
      label: "Tên tiếng Anh",
      children: <Text className="text-lg">{topic?.englishName}</Text>,
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
            topic?.reviewAssignments
              .filter((assignment) => assignment.status !== "removed")
              .every((assignment) => assignment.status !== "completed")
              ? "warning"
              : topic?.reviewPassed
              ? "success"
              : "error"
          }
        >
          <span>
            {topic?.reviewAssignments
              .filter((assignment) => assignment.status !== "removed")
              .every((assignment) => assignment.status !== "completed")
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
            topic?.appraiseAssignments
              .filter((assignment) => assignment.status !== "removed")
              .every((assignment) => assignment.status !== "completed")
              ? "warning"
              : topic?.appraisePassed
              ? "success"
              : "error"
          }
        >
          <span>
            {topic?.appraiseAssignments
              .filter((assignment) => assignment.status !== "removed")
              .every((assignment) => assignment.status !== "completed")
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
        <div className="flex items-center justify-between">
          <Title level={4}>Tài liệu đính kèm</Title>
          <Button
            disabled={!topic?.reviewPassed}
            type="primary"
            icon={<ArrowRightIcon className="size-4" />}
            onClick={() =>
              router.push(
                `/student/topics/${topic?._id}/reports/${topic?.report[0]?._id}`
              )
            }
            iconPosition="end"
          >
            Viết báo cáo
          </Button>
        </div>
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
