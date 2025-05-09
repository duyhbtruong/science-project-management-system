import Link from "next/link";
import { Descriptions } from "antd";
import { LinkIcon } from "lucide-react";

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
      label: "Giảng viên kiểm duyệt",
      key: "reviewAssignments",
      children: (
        <div>
          {record.reviewAssignments.length > 0 ? (
            <ul>
              {record.reviewAssignments.map((a, index) => (
                <li key={`review-assignment-${index}`}>
                  {a.instructor.accountId.name}
                </li>
              ))}
            </ul>
          ) : (
            "Chưa có"
          )}
        </div>
      ),
    },
    {
      label: "Cán bộ thẩm định",
      key: "appraiseAssignments",
      children: (
        <div>
          {record.appraiseAssignments.length > 0 ? (
            <ul>
              {record.appraiseAssignments.map((a, index) => (
                <li key={`appraise-assignment-${index}`}>
                  {a.appraisalBoard.accountId.name}
                </li>
              ))}
            </ul>
          ) : (
            "Chưa có"
          )}
        </div>
      ),
    },
  ];

  // const reviewInstructorItems = [
  //   {
  //     label: "Tên",
  //     key: "name",
  //     children: (
  //       <p>
  //         {record.reviewInstructor && record.reviewInstructor.accountId.name}
  //         {!record.reviewInstructor && "Chưa có"}
  //       </p>
  //     ),
  //   },
  //   {
  //     label: "Email",
  //     key: "email",
  //     children: (
  //       <p>
  //         {record.reviewInstructor && record.reviewInstructor.accountId.email}
  //         {!record.reviewInstructor && "Chưa có"}
  //       </p>
  //     ),
  //   },
  //   {
  //     label: "Học hàm, học vị",
  //     key: "academicRank",
  //     children: (
  //       <p>
  //         {record.reviewInstructor && record.reviewInstructor.academicRank}
  //         {!record.reviewInstructor && "Chưa có"}
  //       </p>
  //     ),
  //   },
  //   {
  //     label: "Khoa",
  //     key: "faculty",
  //     children: (
  //       <p>
  //         {record.reviewInstructor && record.reviewInstructor.faculty}
  //         {!record.reviewInstructor && "Chưa có"}
  //       </p>
  //     ),
  //   },
  // ];

  // const appraiseStaffItems = [
  //   {
  //     label: "Tên",
  //     key: "name",
  //     children: (
  //       <p>
  //         {record.appraiseStaff && record.appraiseStaff.accountId.name}
  //         {!record.appraiseStaff && "Chưa có"}
  //       </p>
  //     ),
  //   },
  //   {
  //     label: "Email",
  //     key: "email",
  //     children: (
  //       <p>
  //         {record.appraiseStaff && record.appraiseStaff.accountId.email}
  //         {!record.appraiseStaff && "Chưa có"}
  //       </p>
  //     ),
  //   },
  // ];

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
      {/* <Descriptions
        title="Thông tin Giảng viên kiểm duyệt"
        items={reviewInstructorItems}
      />
      <Descriptions
        title="Thông tin cán bộ thẩm định"
        items={appraiseStaffItems}
      /> */}
    </div>
  );
};

export default ExpandedRow;
