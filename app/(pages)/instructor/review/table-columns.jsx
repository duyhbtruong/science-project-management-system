import { Button, Space, Tag } from "antd";
import { EditIcon, TrashIcon } from "lucide-react";
import { dateFormat } from "@/utils/format";

export const getTableColumns = (router, handleDelete) => [
  {
    title: "Tên đề tài (Tiếng Việt)",
    dataIndex: ["topicId", "vietnameseName"],
    key: "vietnameseName",
    width: "25%",
    ellipsis: true,
    className: "font-medium",
  },
  {
    title: "Tên đề tài (Tiếng Anh)",
    dataIndex: ["topicId", "englishName"],
    key: "englishName",
    width: "25%",
    ellipsis: true,
    className: "text-gray-600",
  },
  {
    title: "Ngày đăng ký",
    dataIndex: ["topicId", "createdAt"],
    key: "createdAt",
    width: "15%",
    render: (_, record) => (
      <span className="text-gray-500">
        {dateFormat(new Date(record.topicId.createdAt))}
      </span>
    ),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    width: "15%",
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
          ? "Đã kiểm duyệt"
          : record.status === "pending"
          ? "Chưa kiểm duyệt"
          : "Đã hủy"}
      </Tag>
    ),
  },
  {
    title: "Hành động",
    key: "action",
    width: "20%",
    render: (_, record) => (
      <Space size="middle">
        <Button
          disabled={record.status === "cancelled"}
          onClick={() => router.push(`/instructor/review/${record._id}`)}
          icon={<EditIcon className="size-4" />}
        />
        <Button
          onClick={() => handleDelete(record)}
          danger
          icon={<TrashIcon className="size-4" />}
        />
      </Space>
    ),
  },
];
