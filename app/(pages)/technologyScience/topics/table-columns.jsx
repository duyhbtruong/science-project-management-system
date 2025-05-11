import { Button, Space, Tag } from "antd";
import { CheckIcon, LoaderIcon, TrashIcon, UserPlus2Icon } from "lucide-react";
import { dateFormat } from "@/utils/format";

const getStatusTag = (record) => {
  const hasReviewAssignments = record.reviewAssignments?.length > 0;
  const hasAppraiseAssignments = record.appraiseAssignments?.length > 0;

  if (!hasReviewAssignments && !hasAppraiseAssignments) {
    return <Tag color="default">Chưa phân công</Tag>;
  }

  const reviewStatus = record.reviewAssignments?.some(
    (a) => a.status === "completed"
  );
  const appraiseStatus = record.appraiseAssignments?.some(
    (a) => a.status === "completed"
  );

  if (reviewStatus && appraiseStatus) {
    return <Tag color="success">Hoàn thành</Tag>;
  } else if (reviewStatus || appraiseStatus) {
    return <Tag color="processing">Đang thực hiện</Tag>;
  } else {
    return <Tag color="warning">Đang chờ</Tag>;
  }
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
    title: "Trạng thái",
    key: "status",
    width: "15%",
    render: (_, record) => getStatusTag(record),
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
