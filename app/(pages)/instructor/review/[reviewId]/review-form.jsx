import { Form, Input, Radio, Select, Space, Spin } from "antd";
import { SubmitButton } from "@/components/submit-button";
import { useEffect, useState } from "react";
import { getCriteria } from "@/service/criteriaService";

export default function ReviewForm({ form, onFinish, value, setValue }) {
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCriteria = async () => {
      try {
        const res = await getCriteria();
        const data = await res.json();
        setCriteria(data);
      } catch (error) {
        console.error("Error loading criteria:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCriteria();
  }, []);

  const generateOptions = (minGrade, maxGrade, step) => {
    const options = [];
    for (let i = minGrade; i <= maxGrade; i += step) {
      options.push({
        value: i,
        label: String(i),
      });
    }
    return options;
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <Form
      form={form}
      onFinish={onFinish}
      autoComplete="off"
      layout="vertical"
      className="flex flex-col flex-grow"
    >
      {criteria.map((criterion, index) => (
        <Form.Item
          key={`criteria-${criterion._id}`}
          className="p-4 bg-white rounded-md"
          name={`criteria_${criterion._id}`}
          label={`${index + 1}. ${criterion.title}`}
          rules={[{ required: true, message: "Không được để trống mục này!" }]}
        >
          <Select
            placeholder="Chấm điểm..."
            options={generateOptions(
              criterion.minGrade,
              criterion.maxGrade,
              criterion.step
            )}
          />
        </Form.Item>
      ))}

      <Form.Item
        className="p-4 bg-white rounded-md"
        name="finalGrade"
        label="Kết quả CHUNG (thang điểm 100 - 70 điểm trở lên là ĐẠT)"
        rules={[{ required: true, message: "Không được để trống mục này!" }]}
      >
        <Select
          placeholder="Chấm điểm..."
          options={Array.from({ length: 20 }, (_, i) => ({
            value: (i + 1) * 5,
            label: String((i + 1) * 5),
          }))}
        />
      </Form.Item>

      <Form.Item
        className="p-4 bg-white rounded-md"
        name="isEureka"
        label="Đề tài xuất sắc đạt yêu cầu tham gia giải EUREKA"
        rules={[{ required: true, message: "Không được để trống mục này!" }]}
      >
        <Radio.Group onChange={(e) => setValue(e.target.value)} value={value}>
          <Space direction="vertical">
            <Radio value="Có">Có</Radio>
            <Radio value="Không">Không</Radio>
          </Space>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        className="p-4 bg-white rounded-md"
        name="comment"
        label="Góp ý, nhận xét dành cho CNĐT (Bắt buộc nếu điểm Kết quả CHUNG dưới 70)"
      >
        <Input.TextArea autoSize placeholder="Nhập nhận xét..." />
      </Form.Item>

      <Form.Item className="mt-auto">
        <SubmitButton form={form}>
          {loading ? "Đang tải..." : "Xác nhận"}
        </SubmitButton>
      </Form.Item>
    </Form>
  );
}
