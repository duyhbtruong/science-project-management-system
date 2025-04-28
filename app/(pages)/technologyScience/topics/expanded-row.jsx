import Link from "next/link";
import { Descriptions } from "antd";
import { ExportOutlined, PaperClipOutlined } from "@ant-design/icons";
import { LinkIcon, PaperclipIcon } from "lucide-react";

const ExpandedRow = ({ record }) => {
  const instructorItems = [
    {
      label: "Tên",
      key: "name",
      children: <p>{record.instructor.accountId.name}</p>,
    },
    {
      label: "Email",
      key: "email",
      children: (
        <Link
          target="_blank"
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${record.instructor.email}`}
          className="flex items-center justify-center"
        >
          <LinkIcon className="mr-1 size-4" />
          {record.instructor.accountId.email}
        </Link>
      ),
    },
    {
      label: "Học hàm, học vị",
      key: "academicRank",
      children: <p>{record.instructor.academicRank}</p>,
    },
    {
      label: "Khoa",
      key: "faculty",
      children: <p>{record.instructor.faculty}</p>,
    },
  ];

  const topicDataItems = [
    {
      label: "Loại hình nghiên cứu",
      key: "type",
      children: <p>{record.type}</p>,
    },
    {
      label: "Thành viên",
      key: "participants",
      children: (
        <p>
          {record.participants.map((participant, index) => (
            <span key={`participant-${index}`}>
              {index + 1}. {participant}
              <br />
            </span>
          ))}
        </p>
      ),
    },
    {
      label: "Số lượng kiểm duyệt",
      key: "reviews",
      children: <p>{record.reviews.length}</p>,
    },
    {
      label: "Số lượng thẩm định",
      key: "appraise",
      children: <p>{record.appraises.length}</p>,
    },
    {
      label: "Hồ sơ đăng ký",
      key: "registerFile",
      children: (
        <p>
          {record.registerFile && (
            <Link
              target="_blank"
              href={record.registerFile}
              className="flex items-center justify-center"
            >
              <PaperclipIcon className="mr-1 size-4" />
              Tài liệu đính kèm
            </Link>
          )}
          {!record.registerFile && "Chưa có"}
        </p>
      ),
    },
    {
      label: "Tài liệu nộp bài",
      key: "submitFile",
      children: (
        <p>
          {record.submitFile && (
            <Link
              target="_blank"
              href={record.submitFile}
              className="flex items-center justify-center"
            >
              <PaperclipIcon className="mr-1 size-4" />
              Tài liệu đính kèm
            </Link>
          )}
          {!record.submitFile && "Chưa có"}
        </p>
      ),
    },
    {
      label: "Hợp đồng đề tài",
      key: "contractFile",
      children: (
        <p>
          {record.contractFile && (
            <Link
              target="_blank"
              href={record.contractFile}
              className="flex items-center justify-center"
            >
              <PaperclipIcon className="mr-1 size-4" />
              Tài liệu đính kèm
            </Link>
          )}
          {!record.contractFile && "Chưa có"}
        </p>
      ),
    },
    {
      label: "Hợp đồng tài chính",
      key: "paymentFile",
      children: (
        <p>
          {record.paymentFile && (
            <Link
              target="_blank"
              href={record.paymentFile}
              className="flex items-center justify-center"
            >
              <PaperclipIcon className="mr-1 size-4" />
              Tài liệu đính kèm
            </Link>
          )}
          {!record.paymentFile && "Chưa có"}
        </p>
      ),
    },
  ];

  const reviewInstructorItems = [
    {
      label: "Tên",
      key: "name",
      children: (
        <p>
          {record.reviewInstructor && record.reviewInstructor.accountId.name}
          {!record.reviewInstructor && "Chưa có"}
        </p>
      ),
    },
    {
      label: "Email",
      key: "email",
      children: (
        <p>
          {record.reviewInstructor && record.reviewInstructor.accountId.email}
          {!record.reviewInstructor && "Chưa có"}
        </p>
      ),
    },
    {
      label: "Học hàm, học vị",
      key: "academicRank",
      children: (
        <p>
          {record.reviewInstructor && record.reviewInstructor.academicRank}
          {!record.reviewInstructor && "Chưa có"}
        </p>
      ),
    },
    {
      label: "Khoa",
      key: "faculty",
      children: (
        <p>
          {record.reviewInstructor && record.reviewInstructor.faculty}
          {!record.reviewInstructor && "Chưa có"}
        </p>
      ),
    },
  ];

  const appraiseStaffItems = [
    {
      label: "Tên",
      key: "name",
      children: (
        <p>
          {record.appraiseStaff && record.appraiseStaff.accountId.name}
          {!record.appraiseStaff && "Chưa có"}
        </p>
      ),
    },
    {
      label: "Email",
      key: "email",
      children: (
        <p>
          {record.appraiseStaff && record.appraiseStaff.accountId.email}
          {!record.appraiseStaff && "Chưa có"}
        </p>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Descriptions
        title="Thông tin Giảng viên Hướng dẫn"
        items={instructorItems}
      />
      <Descriptions
        title="Thông tin Đề tài"
        items={topicDataItems}
        column={2}
      />
      <Descriptions
        title="Thông tin Giảng viên kiểm duyệt"
        items={reviewInstructorItems}
      />
      <Descriptions
        title="Thông tin cán bộ thẩm định"
        items={appraiseStaffItems}
      />
    </div>
  );
};

export default ExpandedRow;
