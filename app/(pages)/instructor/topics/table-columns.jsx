import { Button } from "antd";
import { dateFormat } from "@/utils/format";
import { ArrowRightIcon } from "lucide-react";

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
    render: (_, { createdAt }) => <p>{dateFormat(new Date(createdAt))}</p>,
  },
  {
    title: "Cập nhật lần cuối",
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (_, { updatedAt }) => <p>{dateFormat(new Date(updatedAt))}</p>,
  },
  {
    title: "Hành động",
    key: "action",
    render: (_, { _id }) => (
      <Button
        type="primary"
        icon={<ArrowRightIcon className="size-4" />}
        iconPosition="end"
        href={`/instructor/topics/${_id}`}
      >
        Xem chi tiết
      </Button>
    ),
  },
];
