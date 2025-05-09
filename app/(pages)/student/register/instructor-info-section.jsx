import { Form, Input, Select } from "antd";
import { Building2Icon, MailIcon } from "lucide-react";

const academicRankOptions = [
  { title: "ThS", value: "ThS" },
  { title: "TS", value: "TS" },
  { title: "GS.TS", value: "GS.TS" },
  { title: "PGS.TS", value: "PGS.TS" },
];

export const InstructorInfoSection = ({ form, listInstructor }) => {
  const handleInstructorChange = (instructorId) => {
    if (instructorId === undefined) {
      form.setFieldsValue({
        instructorEmail: "",
        instructorFaculty: "",
        instructorAcademicRank: "",
      });
      return;
    }

    let selectedInstructor = listInstructor.find(
      (intructor) => intructor._id === instructorId
    );

    form.setFieldsValue({
      instructorEmail: selectedInstructor.account.email,
      instructorFaculty: selectedInstructor.faculty,
      instructorAcademicRank: selectedInstructor.academicRank,
    });
  };

  return (
    <>
      <Form.Item
        label="Chọn giảng viên"
        name="listInstructor"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn 1 giảng viên.",
          },
        ]}
      >
        <Select
          allowClear
          placeholder="Chọn 1 giảng viên..."
          onChange={handleInstructorChange}
        >
          {listInstructor?.map((instructor) => (
            <Select.Option key={instructor._id} value={instructor._id}>
              {instructor.account.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Email"
        name="instructorEmail"
        rules={[
          {
            required: true,
            message: "Không được để trống email GVHD!",
          },
          {
            type: "email",
            message: "Sai định dạng email!",
          },
        ]}
      >
        <Input
          disabled
          prefix={<MailIcon className="mr-1 text-border size-4" />}
          placeholder="Nhập email giáo viên hướng dẫn..."
        />
      </Form.Item>

      <Form.Item
        label="Khoa"
        name="instructorFaculty"
        rules={[
          {
            required: true,
            message: "Không được để trống khoa của giảng viên.",
          },
        ]}
      >
        <Input
          disabled
          prefix={<Building2Icon className="mr-1 text-border size-4" />}
          placeholder="Nhập tên khoa của giảng viên..."
        />
      </Form.Item>

      <Form.Item
        label="Học hàm, học vị"
        name="instructorAcademicRank"
        rules={[
          {
            required: true,
            message: "Chọn học hàm, học vị của GVHD...",
          },
        ]}
      >
        <Select
          disabled
          placeholder="Chọn học hàm, học vị..."
          options={academicRankOptions}
        />
      </Form.Item>
    </>
  );
};
