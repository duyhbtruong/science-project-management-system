import Link from "next/link";
import { Button, Space, Tag, Typography } from "antd";
import { EditIcon, Link2Icon, TrashIcon } from "lucide-react";
const { Text } = Typography;

export const getTableColumns = (router, handleDelete, disabled = false) => [
  {
    title: "Tên tiếng Việt",
    dataIndex: ["topicId", "vietnameseName"],
    key: "vietnameseName",
    ellipsis: true,
  },
  {
    title: "Tên tiếng Anh",
    dataIndex: ["topicId", "englishName"],
    key: "englishName",
    ellipsis: true,
  },
  {
    title: "Tài liệu",
    dataIndex: ["topicId", "files"],
    key: "files",
    render: (_, record) => {
      const submitFile = record.topicId.files.find(
        (file) => file.fileType === "submit"
      );
      if (!submitFile) return <span>Chưa nộp</span>;
      return (
        <Link
          target="_blank"
          href={submitFile.fileUrl}
          className="flex gap-x-1 items-center"
        >
          <Link2Icon className="text-blue-500 size-4 hover:text-blue-600" />
          <Text className="flex-1 text-blue-500 truncate hover:text-blue-600">
            {submitFile.fileName}
          </Text>
        </Link>
      );
    },
  },
  {
    title: "Trạng thái",
    dataIndex: "isAppraised",
    key: "isAppraised",
    render: (_, record) => (
      <Tag
        color={
          record.status === "completed"
            ? "success"
            : record.status === "pending"
              ? "processing"
              : "error"
        }
      >
        {record.status === "completed"
          ? "Đã thẩm định"
          : record.status === "pending"
            ? "Chưa thẩm định"
            : "Đã hủy"}
      </Tag>
    ),
  },
  {
    title: "Hành động",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Button
          disabled={disabled || record.status === "cancelled"}
          onClick={() => router.push(`/appraisal-board/appraise/${record._id}`)}
          icon={<EditIcon className="size-4" />}
          title={disabled ? "Không trong thời gian thẩm định" : undefined}
        />
        <Button
          onClick={() => handleDelete(record)}
          danger
          icon={<TrashIcon className="size-4" />}
          disabled={disabled}
          title={disabled ? "Không trong thời gian thẩm định" : undefined}
        />
      </Space>
    ),
  },
];
