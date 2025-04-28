import { Table, Button, Space } from "antd";
import { EditIcon, TrashIcon } from "lucide-react";
import { dateFormat } from "@/utils/format";

export default function PeriodTable({ periods, onEdit, onDelete }) {
  const columns = [
    {
      title: "Tên",
      dataIndex: "title",
      key: "title",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      ellipsis: true,
      render: (date) => dateFormat(new Date(date)),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      ellipsis: true,
      render: (date) => dateFormat(new Date(date)),
    },
    {
      title: "Hạn kiểm duyệt",
      dataIndex: "reviewDeadline",
      key: "reviewDeadline",
      ellipsis: true,
      render: (date) => dateFormat(new Date(date)),
    },
    {
      title: "Hạn nộp bài",
      dataIndex: "submitDeadline",
      key: "submitDeadline",
      ellipsis: true,
      render: (date) => dateFormat(new Date(date)),
    },
    {
      title: "Hạn thẩm định",
      dataIndex: "appraiseDeadline",
      key: "appraiseDeadline",
      ellipsis: true,
      render: (date) => dateFormat(new Date(date)),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditIcon className="size-4" />}
            onClick={() => onEdit(record._id)}
          />
          <Button
            danger
            icon={<TrashIcon className="size-4" />}
            onClick={() => onDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey={(record) => record._id}
      tableLayout="fixed"
      columns={columns}
      dataSource={periods}
      pagination={{ pageSize: 8 }}
    />
  );
}
