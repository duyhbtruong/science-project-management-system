import { Button, Space, Tag } from "antd";
import { CheckIcon, LoaderIcon, TrashIcon, UserPlus2Icon } from "lucide-react";
import { dateFormat } from "@/utils/format";

export const getTableColumns = (showModal, deleteTopic) => [
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
    render: (_, { createdAt }) => {
      return <p>{dateFormat(new Date(createdAt))}</p>;
    },
  },
  {
    title: "Trạng thái kiểm duyệt",
    dataIndex: "reviews",
    key: "reviews",
    render: (_, { reviews }) => {
      let color, icon, text;
      const isReviewed = reviews.length > 0;
      switch (isReviewed) {
        case true:
          color = "success";
          text = "Đã kiểm duyệt";
          icon = <CheckIcon className="inline-block mr-1 size-4" />;
          break;
        case false:
          color = "default";
          text = "Chưa kiểm duyệt";
          icon = (
            <LoaderIcon
              spin
              className="inline-block mr-1 animate-spin size-4"
            />
          );
        default:
          break;
      }
      return (
        <Tag color={color} icon={icon}>
          {text}
        </Tag>
      );
    },
    filters: [
      {
        text: "Đã kiểm duyệt",
        value: true,
      },
      {
        text: "Chưa kiểm duyệt",
        value: false,
      },
    ],
    onFilter: (value, record) => record.isReviewed === value,
  },
  {
    title: "Trạng thái thẩm định",
    dataIndex: "appraises",
    key: "appraises",
    render: (_, { appraises }) => {
      let color, icon, text;
      const isAppraised = appraises.length > 0;
      switch (isAppraised) {
        case true:
          color = "success";
          text = "Đã thẩm định";
          icon = <CheckIcon className="inline-block mr-1 size-4" />;
          break;
        case false:
          color = "default";
          text = "Chưa thẩm định";
          icon = (
            <LoaderIcon
              spin
              className="inline-block mr-1 animate-spin size-4"
            />
          );
        default:
          break;
      }
      return (
        <Tag color={color} icon={icon}>
          {text}
        </Tag>
      );
    },
    filters: [
      {
        text: "Đã thẩm định",
        value: true,
      },
      {
        text: "Chưa thẩm định",
        value: false,
      },
    ],
    onFilter: (value, record) => record.isAppraised === value,
  },
  {
    title: "Hành động",
    key: "action",
    width: "10%",
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
