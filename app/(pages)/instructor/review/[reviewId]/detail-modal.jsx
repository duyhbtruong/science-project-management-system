import { Modal, Descriptions } from "antd";
import Link from "next/link";
import { LinkIcon } from "lucide-react";

export default function DetailModal({ isOpen, onOk, onCancel, topic }) {
  const topicItems = [
    {
      key: "1",
      label: "Tên tiếng Việt",
      children: topic?.vietnameseName,
    },
    {
      key: "2",
      label: "Tên tiếng Anh",
      children: topic?.englishName,
    },
    {
      key: "3",
      label: "Tóm tắt đề tài",
      children: topic?.summary,
    },
    {
      key: "4",
      label: "Dự kiến kết quả",
      children: topic?.expectedResult,
    },
    {
      key: "5",
      label: "Thành viên",
      children: topic?.participants?.map((participant, index) => {
        return (
          <div key={`participants-${index}`} className="block">
            • {participant}
          </div>
        );
      }),
    },
    {
      key: "6",
      label: "Tài liệu tham khảo",
      children: topic?.reference?.map((reference, index) => {
        return (
          <div key={`reference-${index}`} className="block">
            • {reference}
          </div>
        );
      }),
    },
  ];

  const instructorItems = [
    {
      key: "1",
      label: "Tên",
      children: topic?.instructor?.accountId.name,
    },
    {
      key: "2",
      label: "Email",
      children: (
        <Link
          className="flex items-center space-x-1"
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${topic?.instructor?.email}`}
        >
          <LinkIcon className="mr-1 size-4" />
          <span>{topic?.instructor?.accountId.email}</span>
        </Link>
      ),
    },
    {
      key: "3",
      label: "Học hàm, hoc vị",
      children: topic?.instructor?.academicRank,
    },
  ];

  return (
    <Modal
      title="Thông tin chi tiết"
      open={isOpen}
      width={1000}
      centered
      onOk={onOk}
      onCancel={onCancel}
    >
      <div className="mt-4 space-y-4">
        <Descriptions
          title="Thông tin đề tài"
          bordered
          column={1}
          items={topicItems}
        />
        <Descriptions
          title="Thông tin Giảng viên Hướng dẫn"
          bordered
          column={1}
          items={instructorItems}
        />
      </div>
    </Modal>
  );
}
