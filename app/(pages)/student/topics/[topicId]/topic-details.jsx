import { Button, Descriptions, Space, Tag } from "antd";
import { CheckIcon, LoaderIcon, PaperclipIcon, UploadIcon } from "lucide-react";
import { TOPIC_STATUS } from "./page";
import Link from "next/link";

export const TopicDetails = ({ topic, onUpload }) => {
  const topicItems = [
    {
      key: "1",
      label: "Tên tiếng Việt",
      children: <p>{topic?.vietnameseName}</p>,
      span: 2,
    },
    {
      key: "2",
      label: "Tên tiếng Anh",
      children: <p>{topic?.englishName}</p>,
      span: 2,
    },
    {
      key: "3",
      label: "Danh sách thành viên",
      children: (
        <ul>
          {topic &&
            topic.participants?.map((participant, index) => {
              return (
                <li key={`participant-${index}`}>{`${
                  index + 1
                } - ${participant}`}</li>
              );
            })}
        </ul>
      ),
      span: 1,
    },
    {
      key: "4",
      label: "Loại hình nghiên cứu",
      children: <p>{topic?.type}</p>,
      span: 1,
    },
    {
      key: "5",
      label: "Trạng thái kiểm duyệt",
      children: (
        <Tag
          icon={
            topic?.reviews.length > 0 ? (
              <CheckIcon className="inline-block mr-1 size-4" />
            ) : (
              <LoaderIcon className="inline-block mr-1 size-4 animate-spin" />
            )
          }
          color={topic?.reviews.length > 0 ? "success" : "default"}
        >
          {topic?.reviews.length > 0
            ? TOPIC_STATUS.REVIEWED
            : TOPIC_STATUS.PENDING_REVIEW}
        </Tag>
      ),
      span: 1,
    },
    {
      key: "6",
      label: "Trạng thái thẩm định",
      children: (
        <Tag
          icon={
            topic?.appraises.length ? (
              <CheckIcon className="inline-block mr-1 size-4" />
            ) : (
              <LoaderIcon className="inline-block mr-1 size-4 animate-spin" />
            )
          }
          color={topic?.appraises.length ? "success" : "default"}
        >
          {topic?.appraises.length
            ? TOPIC_STATUS.APPRAISED
            : TOPIC_STATUS.PENDING_APPRAISE}
        </Tag>
      ),
      span: 1,
    },
  ];

  return (
    <Descriptions
      column={2}
      bordered
      title="Thông tin Đề tài"
      items={topicItems}
      extra={
        <Space>
          {topic?.submitFile && (
            <Link target="_blank" href={topic?.submitFile}>
              <PaperclipIcon className="mr-1 size-4" />
              Tài liệu đã tải lên
            </Link>
          )}
          <Button
            disabled={!topic?.reviews.length}
            type="primary"
            icon={<UploadIcon className="size-4" />}
            onClick={onUpload}
            className="flex items-center justify-center"
          >
            Nộp bản mềm
          </Button>
        </Space>
      }
    />
  );
};
