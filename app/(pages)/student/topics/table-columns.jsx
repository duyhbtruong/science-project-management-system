import { dateFormat } from "@/utils/format";
import { Button } from "antd";
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
    title: "Đợt đăng ký",
    dataIndex: ["registrationPeriod", "title"],
    key: "registrationPeriod",
  },
  {
    key: "action",
    width: "10%",
    render: (_, { _id }) => (
      <Button type="primary" href={`/student/topics/${_id}`}>
        Xem
        <ArrowRightIcon className="size-4" />
      </Button>
    ),
  },
];
