import { Button, Space, Tag } from "antd";
import { CheckIcon, EditIcon, LoaderIcon, TrashIcon } from "lucide-react";
import { dateFormat } from "@/utils/format";

export const getTableColumns = (router, handleDelete) => [
  {
    title: "Tên tiếng Việt",
    dataIndex: "vietnameseName",
    key: "vietnameseName",
    width: "25%",
    ellipsis: true,
  },
  {
    title: "Tên tiếng Anh",
    dataIndex: "englishName",
    key: "englishName",
    width: "25%",
    ellipsis: true,
  },
  {
    title: "Ngày đăng ký",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (_, record) => <p>{dateFormat(new Date(record.createdAt))}</p>,
  },
  {
    title: "Trạng thái",
    dataIndex: "isReviewed",
    key: "isReviewed",
    render: (_, record) => {
      const isReviewed = record.reviews.length > 0;
      return (
        <Tag
          color={isReviewed ? "success" : "default"}
          icon={
            isReviewed ? (
              <CheckIcon className="inline-block mr-1 size-4" />
            ) : (
              <LoaderIcon className="inline-block mr-1 size-4 animate-spin" />
            )
          }
        >
          {isReviewed ? "Đã kiểm duyệt" : "Chưa kiểm duyệt"}
        </Tag>
      );
    },
  },
  {
    title: "Hành động",
    key: "action",
    width: "10%",
    render: (_, record) => (
      <Space size="middle">
        <Button
          onClick={() => router.push(`/instructor/review/${record._id}`)}
          icon={<EditIcon className="size-4" />}
        />
        <Button
          disabled={record.reviews.length === 0}
          onClick={(record) => handleDelete(record)}
          danger
          icon={<TrashIcon className="size-4" />}
        />
      </Space>
    ),
  },
];
