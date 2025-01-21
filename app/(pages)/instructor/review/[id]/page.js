"use client";

import { getAccountById } from "@/service/accountService";
import {
  createReview,
  getReviewsByTopicId,
  updateReviewById,
} from "@/service/reviewService";
import { getStudentById } from "@/service/studentService";
import { getTopicById } from "@/service/topicService";
import {
  CompassOutlined,
  ExportOutlined,
  InfoOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import {
  Button,
  Descriptions,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  Spin,
  message,
} from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReviewTopicPage({ params }) {
  const { id: topicId } = params;
  const session = useSession();
  const userId = session?.data?.user?.id;
  const [account, setAccount] = useState();
  const [instructor, setInstructor] = useState();
  const [topic, setTopic] = useState();
  const [review, setReview] = useState();
  const [value, setValue] = useState("Có");
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const data = [];
  for (let i = 5; i <= 100; i += 5) {
    data.push({ value: i, label: `${i}` });
  }

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
          className="space-x-1"
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${topic?.instructor?.email}`}
        >
          <ExportOutlined className="mr-1" />
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

  const loadTopic = async () => {
    let res = await getTopicById(topicId);
    res = await res.json();
    setTopic(res);
  };

  const loadAccount = async () => {
    let res = await getAccountById(userId);
    res = await res.json();
    setAccount(res.account);
    setInstructor(res.instructor);
  };

  const loadReview = async () => {
    let res = await getReviewsByTopicId(topicId, userId);
    res = await res.json();
    setReview(res);
  };

  useEffect(() => {
    loadTopic();
  }, []);

  useEffect(() => {
    if (!topicId || !userId) return;
    loadReview();
    loadAccount();
  }, [topicId, userId]);

  useEffect(() => {
    if (!review) return;

    form.setFieldsValue({
      criteriaOne: review?.criteria[0],
      criteriaTwo: review?.criteria[1],
      criteriaThree: review?.criteria[2],
      criteriaFour: review?.criteria[3],
      criteriaFive: review?.criteria[4],
      criteriaSix: review?.criteria[5],
      criteriaSeven: review?.criteria[6],
      criteriaEight: review?.criteria[7],
      criteriaNine: review?.grade,
      criteriaTen: review?.isEureka,
      criteriaEleven: review?.note,
    });
  }, [review]);

  const onFinish = async (formData) => {
    const values = {
      criteria: [
        formData.criteriaOne,
        formData.criteriaTwo,
        formData.criteriaThree,
        formData.criteriaFour,
        formData.criteriaFive,
        formData.criteriaSix,
        formData.criteriaSeven,
        formData.criteriaEight,
      ],
      topicId: topicId,
      instructorId: instructor._id,
      grade: formData.criteriaNine,
      isEureka: formData.criteriaTen,
      note: formData.criteriaEleven,
    };

    if (!review) {
      let res = await createReview(values);
      if (res.status === 201) {
        res = await res.json();
        const { message } = res;
        messageApi
          .open({
            type: "success",
            content: message,
            duration: 2,
          })
          .then(() => router.push(`/instructor/review`));
      } else {
        res = await res.json();
        const { message } = res;
        messageApi.open({
          type: "error",
          content: message,
          duration: 2,
        });
      }
    } else {
      let res = await updateReviewById(review._id, values);
      if (res.status === 200) {
        res = await res.json();
        const { message } = res;
        messageApi
          .open({
            type: "success",
            content: message,
            duration: 2,
          })
          .then(() => router.push(`/instructor/review`));
      } else {
        res = await res.json();
        const { message } = res;
        messageApi.open({
          type: "error",
          content: message,
          duration: 2,
        });
      }
    }
  };

  // console.log("review: ", review);

  return (
    <div className="min-h-[calc(100vh-45.8px)] bg-gray-100 px-32">
      <div className="flex justify-between py-4">
        <span className="text-lg font-semibold">Kiểm duyệt đề tài</span>
        <Button
          onClick={showModal}
          loading={!topic}
          icon={<InfoOutlined />}
          type="primary"
        >
          Thông tin chi tiết
        </Button>
      </div>
      <Spin spinning={!topic}>
        <div className="relative flex gap-4">
          <Form
            form={form}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            className="flex flex-col flex-grow"
          >
            <Form.Item
              className="p-4 bg-white rounded-md"
              name={`criteriaOne`}
              label="1. Tổng quan về đề tài, sự cần thiết, ứng dụng có được mô tả rõ ràng, phù hợp (5: cao nhất, 1: thấp nhất)"
              rules={[
                { required: true, message: "Không được để trống mục này!" },
              ]}
            >
              <Select
                placeholder="Chấm điểm..."
                options={[
                  { value: 1, label: "1" },
                  { value: 2, label: "2" },
                  { value: 3, label: "3" },
                  { value: 4, label: "4" },
                  { value: 5, label: "5" },
                ]}
              />
            </Form.Item>
            <Form.Item
              className="p-4 bg-white rounded-md"
              name={`criteriaTwo`}
              label="2. Các công trình, giải pháp liên quan có được mô tả rõ ràng, phù hợp (5: cao nhất, 1: thấp nhất)"
              rules={[
                { required: true, message: "Không được để trống mục này!" },
              ]}
            >
              <Select
                placeholder="Chấm điểm..."
                options={[
                  { value: 1, label: "1" },
                  { value: 2, label: "2" },
                  { value: 3, label: "3" },
                  { value: 4, label: "4" },
                  { value: 5, label: "5" },
                ]}
              />
            </Form.Item>
            <Form.Item
              className="p-4 bg-white rounded-md"
              name={`criteriaThree`}
              label="3. Mục tiêu đề tài có được mô tả rõ ràng, phù hợp (5: cao nhất, 1: thấp nhất)"
              rules={[
                { required: true, message: "Không được để trống mục này!" },
              ]}
            >
              <Select
                placeholder="Chấm điểm..."
                options={[
                  { value: 1, label: "1" },
                  { value: 2, label: "2" },
                  { value: 3, label: "3" },
                  { value: 4, label: "4" },
                  { value: 5, label: "5" },
                ]}
              />
            </Form.Item>
            <Form.Item
              className="p-4 bg-white rounded-md"
              name={`criteriaFour`}
              label="4. Tài liệu tham khảo có cập nhật, trích dẫn và ghi định dạng đúng (5: cao nhất, 1: thấp nhất)"
              rules={[
                { required: true, message: "Không được để trống mục này!" },
              ]}
            >
              <Select
                placeholder="Chấm điểm..."
                options={[
                  { value: 1, label: "1" },
                  { value: 2, label: "2" },
                  { value: 3, label: "3" },
                  { value: 4, label: "4" },
                  { value: 5, label: "5" },
                ]}
              />
            </Form.Item>
            <Form.Item
              className="p-4 bg-white rounded-md"
              name={`criteriaFive`}
              label="5. Nội dung và phương pháp nghiên cứu có phù hợp (5: cao nhất, 1: thấp nhất)"
              rules={[
                { required: true, message: "Không được để trống mục này!" },
              ]}
            >
              <Select
                placeholder="Chấm điểm..."
                options={[
                  { value: 1, label: "1" },
                  { value: 2, label: "2" },
                  { value: 3, label: "3" },
                  { value: 4, label: "4" },
                  { value: 5, label: "5" },
                ]}
              />
            </Form.Item>
            <Form.Item
              className="p-4 bg-white rounded-md"
              name={`criteriaSix`}
              label="6. Kết quả dự kiến có khả thi, nhất quán với mục tiêu và nội dung thực hiện (5: cao nhất, 1: thấp nhất)"
              rules={[
                { required: true, message: "Không được để trống mục này!" },
              ]}
            >
              <Select
                placeholder="Chấm điểm..."
                options={[
                  { value: 1, label: "1" },
                  { value: 2, label: "2" },
                  { value: 3, label: "3" },
                  { value: 4, label: "4" },
                  { value: 5, label: "5" },
                ]}
              />
            </Form.Item>
            <Form.Item
              className="p-4 bg-white rounded-md"
              name={`criteriaSeven`}
              label="7. Thuyết minh đề tài có nội dung đầy đủ, được trình bày rõ ràng, bố cục hợp lý, ít lỗi chế bản (5: cao nhất, 1: thấp nhất)"
              rules={[
                { required: true, message: "Không được để trống mục này!" },
              ]}
            >
              <Select
                placeholder="Chấm điểm..."
                options={[
                  { value: 1, label: "1" },
                  { value: 2, label: "2" },
                  { value: 3, label: "3" },
                  { value: 4, label: "4" },
                  { value: 5, label: "5" },
                ]}
              />
            </Form.Item>
            <Form.Item
              className="p-4 bg-white rounded-md"
              name={`criteriaEight`}
              label="8. Đánh giá về giá trị học thuật, tính mới, độ phức tạp, trình độ sáng tạo, mức độ ứng dụng thực tiễn (5: cao nhất, 1: thấp nhất)"
              rules={[
                { required: true, message: "Không được để trống mục này!" },
              ]}
            >
              <Select
                placeholder="Chấm điểm..."
                options={[
                  { value: 1, label: "1" },
                  { value: 2, label: "2" },
                  { value: 3, label: "3" },
                  { value: 4, label: "4" },
                  { value: 5, label: "5" },
                ]}
              />
            </Form.Item>
            <Form.Item
              className="p-4 bg-white rounded-md"
              name={`criteriaNine`}
              label="9. Kết quả CHUNG (thang điểm 100 - 70 điểm trở lên là ĐẠT)"
              rules={[
                { required: true, message: "Không được để trống mục này!" },
              ]}
            >
              <Select placeholder="Chấm điểm..." options={data} />
            </Form.Item>
            <Form.Item
              className="p-4 bg-white rounded-md"
              name={`criteriaTen`}
              label="10. Đề tài xuất sắc đạt yêu cầu tham gia giải EUREKA"
              rules={[
                { required: true, message: "Không được để trống mục này!" },
              ]}
            >
              <Radio.Group
                onChange={(e) => setValue(e.target.value)}
                value={value}
              >
                <Space direction="vertical">
                  <Radio value={"Có"}>Có</Radio>
                  <Radio value={"Không"}>Không</Radio>
                  {/* <Radio value={"Khác"}>
                    Khác...
                    {value === "Khác" ? (
                      <Input
                        name="more"
                        style={{
                          width: 400,
                          marginLeft: 10,
                        }}
                      />
                    ) : null}
                  </Radio> */}
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              className="p-4 bg-white rounded-md"
              name={`criteriaEleven`}
              label="11. Góp ý, nhận xét dành cho CNĐT (Bắt buộc nếu điểm Kết quả CHUNG dưới 70)"
              rules={[
                {
                  required: true,
                  message: "Nếu không có nhận xét, điền 'Không có'",
                },
              ]}
            >
              <Input.TextArea autoSize placeholder="Nhập nhận xét..." />
            </Form.Item>
            <Form.Item className="flex justify-end">
              <Space>
                <Button onClick={() => form.resetFields()}>Reset</Button>
                <SubmitButton form={form}>Xác nhận</SubmitButton>
              </Space>
            </Form.Item>
          </Form>

          <div className="space-y-4 bg-white rounded-md sticky top-4 h-fit w-[290px] p-4">
            <span className="font-medium">Danh sách tiêu chí</span>
            <div className="flex flex-wrap gap-2">
              {[
                "One",
                "Two",
                "Three",
                "Four",
                "Five",
                "Six",
                "Seven",
                "Eight",
                "Nine",
                "Ten",
                "Eleven",
              ].map((num, index) => {
                return (
                  <Button
                    key={`button-${index}`}
                    className="w-[45px]"
                    onClick={() => form.scrollToField(`criteria${num}`)}
                  >
                    {index + 1}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </Spin>

      <Modal
        title="Thông tin chi tiết"
        open={isModalOpen}
        width={1000}
        centered
        onOk={handleOk}
        onCancel={handleCancel}
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
      {contextHolder}
    </div>
  );
}

const SubmitButton = ({ form, children }) => {
  const [submittable, setSubmittable] = useState(false);

  // Watch all values
  const values = Form.useWatch([], form);
  useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);
  return (
    <Button type="primary" htmlType="submit" disabled={!submittable}>
      {children}
    </Button>
  );
};
