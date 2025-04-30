import { dateFormat } from "@/utils/format";
import { Tag } from "antd";
import { CheckIcon, LoaderIcon } from "lucide-react";

export const getTableColumns = () => [
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
    render: (_, record) => {
      const createdAt = new Date(record.createdAt);
      return <p>{dateFormat(createdAt)}</p>;
    },
  },
  {
    title: "Trạng thái kiểm duyệt",
    dataIndex: "reviews",
    key: "reviews",
    render: (_, record) => {
      const isReviewed = record.reviews.length > 0;
      return (
        <Tag
          color={isReviewed ? "success" : "default"}
          icon={
            isReviewed ? (
              <CheckIcon className="inline-block mr-1 size-4" />
            ) : (
              <LoaderIcon
                spin
                className="inline-block mr-1 animate-spin size-4"
              />
            )
          }
        >
          {isReviewed ? "Đã kiểm duyệt" : "Chưa kiểm duyệt"}
        </Tag>
      );
    },
  },
  {
    title: "Trạng thái thẩm định",
    dataIndex: "appraises",
    key: "appraises",
    render: (_, record) => {
      const isAppraised = record.appraises.length > 0;
      return (
        <Tag
          color={isAppraised ? "success" : "default"}
          icon={
            isAppraised ? (
              <CheckIcon className="inline-block mr-1 size-4" />
            ) : (
              <LoaderIcon
                spin
                className="inline-block mr-1 animate-spin size-4"
              />
            )
          }
        >
          {isAppraised ? "Đã thẩm định" : "Chưa thẩm định"}
        </Tag>
      );
    },
  },
];
