import { Button, Descriptions, Modal } from "antd";
import { LinkIcon } from "lucide-react";
import Link from "next/link";

const DetailModal = ({ topic, isModalOpen, handleOk }) => {
  return (
    <Modal
      title="Thông tin chi tiết"
      open={isModalOpen}
      width={1000}
      centered
      footer={
        <Button type="primary" onClick={handleOk}>
          OK
        </Button>
      }
    >
      <div className="mt-4 space-y-4">
        <Descriptions
          title="Thông tin đề tài"
          bordered
          column={1}
          items={[
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
          ]}
        />
        <Descriptions
          title="Thông tin Giảng viên Hướng dẫn"
          bordered
          column={1}
          items={[
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
                  className="flex items-center gap-x-1"
                  target="_blank"
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
          ]}
        />
      </div>
    </Modal>
  );
};

export default DetailModal;
