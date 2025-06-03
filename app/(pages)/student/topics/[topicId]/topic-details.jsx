import {
  Button,
  Descriptions,
  Tag,
  Card,
  Typography,
  Input,
  Space,
  Form,
  Select,
  message,
} from "antd";
import {
  UsersIcon,
  BookOpenIcon,
  ClipboardListIcon,
  TargetIcon,
  ArrowRightIcon,
  EditIcon,
  SaveIcon,
  XIcon,
} from "lucide-react";
import ReviewAssignmentsCard from "@/components/review-assignments-card";
import AppraiseAssignmentsCard from "@/components/appraise-assignments-card";
import { useState } from "react";
import { updateTopicById } from "@/service/topicService";
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const RESEARCH_TYPES = [
  "Nghiên cứu cơ bản",
  "Nghiên cứu ứng dụng",
  "Nghiên cứu triển khai",
];

export const TopicDetails = ({ topic, router, loadTopic }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTopic, setEditedTopic] = useState(topic);
  const [form] = Form.useForm();

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTopic(topic);
    form.setFieldsValue({
      vietnameseName: topic?.vietnameseName,
      englishName: topic?.englishName,
      type: topic?.type,
      summary: topic?.summary,
      expectedResult: topic?.expectedResult,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTopic(topic);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const updatedTopic = {
        ...editedTopic,
        vietnameseName: values.vietnameseName.toUpperCase(),
        englishName: values.englishName.toUpperCase(),
        type: values.type,
        summary: values.summary,
        expectedResult: values.expectedResult,
      };

      const res = await updateTopicById(topic?._id, updatedTopic);

      setEditedTopic(updatedTopic);
      loadTopic();
      setIsEditing(false);
      message.success("Cập nhật đề tài thành công");
    } catch (error) {
      if (error.errorFields) {
        message.error("Vui lòng kiểm tra lại thông tin");
      } else {
        console.error("Error saving topic:", error);
        message.error("Có lỗi xảy ra khi cập nhật đề tài");
      }
    }
  };

  const topicItems = [
    {
      key: "1",
      label: "Tên tiếng Việt",
      children: isEditing ? (
        <Form.Item
          name="vietnameseName"
          rules={[
            { required: true, message: "Vui lòng nhập tên tiếng Việt" },
            {
              validator: (_, value) => {
                if (value && value.trim() === "") {
                  return Promise.reject("Tên tiếng Việt không được để trống");
                }
                return Promise.resolve();
              },
            },
          ]}
          className="!mb-0"
        >
          <Input className="text-lg" />
        </Form.Item>
      ) : (
        <Text className="text-lg">{topic?.vietnameseName}</Text>
      ),
      span: 2,
    },
    {
      key: "2",
      label: "Tên tiếng Anh",
      children: isEditing ? (
        <Form.Item
          name="englishName"
          rules={[
            { required: true, message: "Vui lòng nhập tên tiếng Anh" },
            {
              validator: (_, value) => {
                if (value && value.trim() === "") {
                  return Promise.reject("Tên tiếng Anh không được để trống");
                }
                return Promise.resolve();
              },
            },
          ]}
          className="!mb-0"
        >
          <Input className="text-lg" />
        </Form.Item>
      ) : (
        <Text className="text-lg">{topic?.englishName}</Text>
      ),
      span: 2,
    },
    {
      key: "3",
      label: "Danh sách thành viên",
      children: (
        <div className="space-y-2">
          {topic &&
            topic.participants?.map((participant, index) => (
              <div
                key={`participant-${index}`}
                className="flex items-center space-x-2"
              >
                <UsersIcon className="text-gray-500 size-4" />
                <Text>{`${index + 1} - ${participant}`}</Text>
              </div>
            ))}
        </div>
      ),
      span: 1,
    },
    {
      key: "4",
      label: "Loại hình nghiên cứu",
      children: isEditing ? (
        <Form.Item
          name="type"
          rules={[
            { required: true, message: "Vui lòng chọn loại hình nghiên cứu" },
          ]}
          className="!mb-0"
        >
          <Select
            className="text-lg"
            options={RESEARCH_TYPES.map((type) => ({
              label: type,
              value: type,
            }))}
          />
        </Form.Item>
      ) : (
        <div className="flex items-center space-x-2">
          <BookOpenIcon className="text-gray-500 size-4" />
          <Text>{topic?.type}</Text>
        </div>
      ),
      span: 1,
    },
    {
      key: "5",
      label: "Kết quả kiểm duyệt",
      children: (
        <Tag
          color={
            topic?.reviewAssignments
              .filter((assignment) => assignment.status !== "removed")
              .every((assignment) => assignment.status !== "completed")
              ? "warning"
              : topic?.reviewPassed
              ? "success"
              : "error"
          }
        >
          <span>
            {topic?.reviewAssignments
              .filter((assignment) => assignment.status !== "removed")
              .every((assignment) => assignment.status !== "completed")
              ? "Đang chờ"
              : topic?.reviewPassed
              ? "Đạt"
              : "Không đạt"}
          </span>
        </Tag>
      ),
      span: 1,
    },
    {
      key: "6",
      label: "Kết quả thẩm định",
      children: (
        <Tag
          color={
            topic?.appraiseAssignments
              .filter((assignment) => assignment.status !== "removed")
              .every((assignment) => assignment.status !== "completed")
              ? "warning"
              : topic?.appraisePassed
              ? "success"
              : "error"
          }
        >
          <span>
            {topic?.appraiseAssignments
              .filter((assignment) => assignment.status !== "removed")
              .every((assignment) => assignment.status !== "completed")
              ? "Đang chờ"
              : topic?.appraisePassed
              ? "Đạt"
              : "Không đạt"}
          </span>
        </Tag>
      ),
      span: 1,
    },
  ];

  console.log("TOPIC: ", topic);

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <Title level={4} className="!mb-0">
            Thông tin Đề tài
          </Title>
          {isEditing ? (
            <Space>
              <Button onClick={handleCancel}>
                <XIcon className="size-4" />
                Hủy
              </Button>
              <Button type="primary" onClick={handleSave}>
                <SaveIcon className="size-4" />
                Lưu
              </Button>
            </Space>
          ) : (
            <Button onClick={handleEdit}>
              <EditIcon className="size-4" />
              Chỉnh sửa
            </Button>
          )}
        </div>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            vietnameseName: topic?.vietnameseName,
            englishName: topic?.englishName,
            type: topic?.type,
            summary: topic?.summary,
            expectedResult: topic?.expectedResult,
          }}
        >
          <Descriptions
            column={2}
            bordered
            items={topicItems}
            className="topic-descriptions"
          />
        </Form>
      </Card>

      <Card className="shadow-sm">
        <div className="flex items-center justify-between">
          <Title level={4}>Tài liệu đính kèm</Title>
          <Button
            disabled={!topic?.reviewPassed}
            type="primary"
            onClick={() =>
              router.push(
                `/student/topics/${topic?._id}/reports/${topic?.report[0]?._id}`
              )
            }
          >
            Viết báo cáo
            <ArrowRightIcon className="size-4" />
          </Button>
        </div>
      </Card>

      <Card className="shadow-sm">
        <div className="flex items-center mb-4 space-x-2">
          <ClipboardListIcon className="text-gray-500 size-5" />
          <Title level={4} className="!mb-0">
            Tóm tắt đề tài
          </Title>
        </div>
        {isEditing ? (
          <Form form={form}>
            <Form.Item name="summary" className="!mb-0">
              <TextArea
                autoSize={{ minRows: 5 }}
                className="text-gray-700"
                content={topic?.summary}
              />
            </Form.Item>
          </Form>
        ) : (
          <Paragraph className="text-gray-700 whitespace-pre-line">
            {topic?.summary || "Chưa có tóm tắt đề tài"}
          </Paragraph>
        )}
      </Card>

      <Card className="shadow-sm">
        <div className="flex items-center mb-4 space-x-2">
          <TargetIcon className="text-gray-500 size-5" />
          <Title level={4} className="!mb-0">
            Kết quả dự kiến
          </Title>
        </div>
        {isEditing ? (
          <Form form={form}>
            <Form.Item name="expectedResult" className="!mb-0">
              <TextArea autoSize={{ minRows: 5 }} className="text-gray-700" />
            </Form.Item>
          </Form>
        ) : (
          <Paragraph className="text-gray-700 whitespace-pre-line">
            {topic?.expectedResult || "Chưa có kết quả dự kiến"}
          </Paragraph>
        )}
      </Card>

      <ReviewAssignmentsCard reviewAssignments={topic?.reviewAssignments} />
      <AppraiseAssignmentsCard
        appraiseAssignments={topic?.appraiseAssignments}
      />
    </div>
  );
};
