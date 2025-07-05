import { Button, Space, Tag } from "antd";
import { CheckIcon, LoaderIcon, TrashIcon, UserPlus2Icon } from "lucide-react";
import { dateFormat } from "@/utils/format";

const getReviewStatus = (record) => {
  if (
    record.reviewAssignments.length === 0 ||
    record.reviewAssignments.every((a) => a.status === "removed")
  ) {
    return <Tag color="default">Chưa phân công</Tag>;
  }

  if (
    record.reviewAssignments
      .filter((a) => a.status !== "removed")
      .some((a) => a.status === "pending")
  ) {
    return <Tag color="warning">Đang chờ</Tag>;
  }

  if (
    record.reviewAssignments
      .filter((a) => a.status !== "removed")
      .every((a) => a.status === "completed")
  ) {
    return <Tag color="success">Hoàn thành</Tag>;
  }

  return <Tag color="processing">Đang thực hiện</Tag>;
};

const getAppraiseStatus = (record) => {
  if (
    record.appraiseAssignments.length === 0 ||
    record.appraiseAssignments.every((a) => a.status === "removed")
  ) {
    return <Tag color="default">Chưa phân công</Tag>;
  }

  if (
    record.appraiseAssignments
      .filter((a) => a.status !== "removed")
      .some((a) => a.status === "pending")
  ) {
    return <Tag color="warning">Đang chờ</Tag>;
  }

  if (
    record.appraiseAssignments
      .filter((a) => a.status !== "removed")
      .every((a) => a.status === "completed")
  ) {
    return <Tag color="success">Hoàn thành</Tag>;
  }

  return <Tag color="processing">Đang thực hiện</Tag>;
};

export const getTableColumns = (showModal, deleteTopic) => [
  {
    title: "Tên tiếng Việt",
    dataIndex: "vietnameseName",
    key: "vietnameseName",
    width: "20%",
    ellipsis: true,
  },
  {
    title: "Tên tiếng Anh",
    dataIndex: "englishName",
    key: "englishName",
    width: "20%",
    ellipsis: true,
  },
  {
    title: "Loại hình",
    dataIndex: "type",
    key: "type",
    width: "15%",
  },
  {
    title: "Trạng thái kiểm duyệt",
    key: "reviewStatus",
    width: "15%",
    render: (_, record) => getReviewStatus(record),
  },
  {
    title: "Trạng thái thẩm định",
    key: "appraiseStatus",
    width: "15%",
    render: (_, record) => getAppraiseStatus(record),
  },
  {
    title: "Ngày đăng ký",
    dataIndex: "createdAt",
    key: "createdAt",
    width: "15%",
    render: (_, { createdAt }) => {
      return <p>{dateFormat(new Date(createdAt))}</p>;
    },
  },
  {
    title: "Hành động",
    key: "action",
    width: "15%",
    render: (_, record) => {
      return (
        <Space size="middle">
          <Button
            onClick={() => showModal(record)}
            icon={<UserPlus2Icon className="size-4" />}
          />

          <Button
            onClick={() => deleteTopic(record._id)}
            danger
            icon={<TrashIcon className="size-4" />}
          />
        </Space>
      );
    },
  },
];
