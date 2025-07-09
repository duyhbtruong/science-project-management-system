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
  List,
  Tooltip,
} from "antd";
import {
  UsersIcon,
  BookOpenIcon,
  ClipboardListIcon,
  TargetIcon,
  EditIcon,
  SaveIcon,
  XIcon,
  ArrowUpRightIcon,
  PencilLineIcon,
} from "lucide-react";
import ReviewAssignmentsCard from "@/components/review-assignments-card";
import AppraiseAssignmentsCard from "@/components/appraise-assignments-card";
import { useState } from "react";
import { updateTopicById } from "@/service/topicService";
import { RESEARCH_TYPE } from "@/constant/research-types";
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export const TopicDetails = ({ topic, loadTopic, message }) => {
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

      await updateTopicById(topic?._id, updatedTopic);
      await updateTopicById(topic?._id, updatedTopic);

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

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateDaysLate = (submitDeadline) => {
    if (!submitDeadline) return null;
    const today = new Date();
    const deadline = new Date(submitDeadline);
    const diffTime = today - deadline;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
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
          <Input />
        </Form.Item>
      ) : (
        <Text>{topic?.vietnameseName}</Text>
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
          <Input />
          <Input />
        </Form.Item>
      ) : (
        <Text>{topic?.englishName}</Text>
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
            options={RESEARCH_TYPE.map((type) => ({
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
            topic?.reviewAssignments.length === 0 ||
            topic?.reviewAssignments.some(
              (assignment) => assignment.status === "pending"
            ) ||
            topic?.reviewAssignments.every(
              (assignment) => assignment.status === "removed"
            )
              ? "warning"
              : topic?.reviewPassed
                ? "success"
                : "error"
          }
        >
          <span>
            {topic?.reviewAssignments.length === 0 ||
            topic?.reviewAssignments.some(
              (assignment) => assignment.status === "pending"
            ) ||
            topic?.reviewAssignments.every(
              (assignment) => assignment.status === "removed"
            )
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
            topic?.appraiseAssignments.length === 0 ||
            topic?.appraiseAssignments.some(
              (assignment) => assignment.status === "pending"
            ) ||
            topic?.appraiseAssignments.every(
              (assignment) => assignment.status === "removed"
            )
              ? "warning"
              : topic?.appraisePassed
                ? "success"
                : "error"
          }
        >
          <span>
            {topic?.appraiseAssignments.length === 0 ||
            topic?.appraiseAssignments.some(
              (assignment) => assignment.status === "pending"
            ) ||
            topic?.appraiseAssignments.every(
              (assignment) => assignment.status === "removed"
            )
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

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <div className="flex justify-between items-center mb-4">
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
        <div className="flex justify-between items-center mb-4">
          <Title level={4} className="!mb-0">
            Tài liệu đính kèm
          </Title>
          <Tooltip title="Bạn chỉ có thể viết báo cáo khi đề tài được kiểm duyệt">
            <Button
              type="primary"
              href={`/student/topics/${topic?._id}/reports/${topic?.report[0]?._id}`}
              disabled={!topic?.reviewPassed}
            >
              <PencilLineIcon className="size-4" />
              Viết báo cáo
            </Button>
          </Tooltip>
        </div>
        {topic?.files?.length > 0 && (
          <List
            itemLayout="horizontal"
            dataSource={topic?.files}
            renderItem={(file) => {
              const isSubmitFile = file.fileType === "submit";
              const daysLate = isSubmitFile
                ? calculateDaysLate(topic?.registrationPeriod?.submitDeadline)
                : null;

              return (
                <List.Item>
                  <List.Item.Meta
                    title={
                      file.fileType === "register"
                        ? "Hồ sơ đăng ký"
                        : file.fileType === "contract"
                          ? "Hợp đồng"
                          : file.fileType === "submit"
                            ? "Báo cáo"
                            : "Báo cáo tài chính"
                    }
                    description={
                      <div>
                        <div>{file.fileName}</div>
                        {isSubmitFile &&
                          topic?.registrationPeriod?.submitDeadline && (
                            <div className="mt-1">
                              <Text type="secondary" className="text-xs">
                                Hạn nộp:{" "}
                                {formatDate(
                                  topic.registrationPeriod.submitDeadline
                                )}
                              </Text>
                              {daysLate && (
                                <div className="mt-1">
                                  <Tag color="red" className="text-xs">
                                    Trễ {daysLate} ngày
                                  </Tag>
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                    }
                  />
                  <Button href={file.fileUrl} target="_blank">
                    Đường dẫn
                    <ArrowUpRightIcon className="size-4" />
                  </Button>
                </List.Item>
              );
            }}
          />
        )}
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
