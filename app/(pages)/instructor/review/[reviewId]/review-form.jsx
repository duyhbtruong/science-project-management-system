import { Button, Form, Input, Radio, Select, Space } from "antd";
import { SubmitButton } from "@/components/submit-button";
import { REVIEW_CRITERIA } from "./review-criteria";

export default function ReviewForm({ form, onFinish, value, setValue }) {
  const scoreOptions = Array.from({ length: 5 }, (_, i) => ({
    value: i + 1,
    label: String(i + 1),
  }));

  const gradeOptions = Array.from({ length: 20 }, (_, i) => ({
    value: (i + 1) * 5,
    label: String((i + 1) * 5),
  }));

  return (
    <Form
      form={form}
      onFinish={onFinish}
      autoComplete="off"
      layout="vertical"
      className="flex flex-col flex-grow"
    >
      {REVIEW_CRITERIA.map((criteria, index) => (
        <Form.Item
          key={`criteria-${index}`}
          className="p-4 bg-white rounded-md"
          name={`criteria${criteria.key}`}
          label={`${index + 1}. ${criteria.label}`}
          rules={[{ required: true, message: "Không được để trống mục này!" }]}
        >
          {criteria.type === "score" ? (
            <Select placeholder="Chấm điểm..." options={scoreOptions} />
          ) : criteria.type === "grade" ? (
            <Select placeholder="Chấm điểm..." options={gradeOptions} />
          ) : criteria.type === "radio" ? (
            <Radio.Group
              onChange={(e) => setValue(e.target.value)}
              value={value}
            >
              <Space direction="vertical">
                <Radio value="Có">Có</Radio>
                <Radio value="Không">Không</Radio>
              </Space>
            </Radio.Group>
          ) : (
            <Input.TextArea autoSize placeholder="Nhập nhận xét..." />
          )}
        </Form.Item>
      ))}

      <Form.Item className="flex justify-end">
        <Space>
          <Button onClick={() => form.resetFields()}>Reset</Button>
          <SubmitButton form={form}>Xác nhận</SubmitButton>
        </Space>
      </Form.Item>
    </Form>
  );
}
