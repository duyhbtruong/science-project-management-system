import { Form, Input } from "antd";
import { Building2Icon, IdCardIcon, MailIcon, User2Icon } from "lucide-react";

export const StudentInfoSection = () => {
  return (
    <>
      <Form.Item label="Email" name="studentEmail" required>
        <Input
          disabled
          prefix={<MailIcon className="mr-1 text-border size-4" />}
        />
      </Form.Item>

      <Form.Item label="Họ và tên" name="studentName" required>
        <Input
          disabled
          prefix={<User2Icon className="mr-1 text-border size-4" />}
        />
      </Form.Item>

      <Form.Item label="Đơn vị" name="studentFaculty" required>
        <Input
          disabled
          prefix={<Building2Icon className="mr-1 text-border size-4" />}
        />
      </Form.Item>

      <Form.Item label="Chương trình đào tạo" name="educationProgram" required>
        <Input
          disabled
          prefix={<IdCardIcon className="mr-1 text-border size-4" />}
        />
      </Form.Item>
    </>
  );
};
