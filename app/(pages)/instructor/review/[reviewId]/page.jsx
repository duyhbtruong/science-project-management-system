"use client";

import { getAccountById } from "@/service/accountService";
import {
  createReview,
  getReviewsByTopicId,
  updateReviewById,
} from "@/service/reviewService";
import { getTopicById } from "@/service/topicService";

import { InfoOutlined } from "@ant-design/icons";
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
import { SubmitButton } from "@/components/submit-button";

import emailjs from "@emailjs/browser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { InfoIcon } from "lucide-react";
import ReviewForm from "./review-form";
import DetailModal from "./detail-modal";

export default function ReviewTopicPage({ params }) {
  const { reviewId } = params;
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

  const loadTopic = async () => {
    let res = await getTopicById(reviewId);
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
    let res = await getReviewsByTopicId(reviewId, userId);
    res = await res.json();
    setReview(res);
  };

  useEffect(() => {
    loadTopic();
  }, []);

  useEffect(() => {
    if (!reviewId || !userId) return;
    loadReview();
    loadAccount();
  }, [reviewId, userId]);

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
      topicId: reviewId,
      instructorId: instructor._id,
      grade: formData.criteriaNine,
      isEureka: formData.criteriaTen,
      note: formData.criteriaEleven,
    };

    try {
      const res = !review
        ? await createReview(values)
        : await updateReviewById(review._id, values);

      if (res.status === 200 || res.status === 201) {
        const { message } = await res.json();
        await messageApi.open({
          type: "success",
          content: message,
          duration: 2,
        });
        router.push(`/instructor/review`);
        sendEmail(formData, topic);
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.message,
        duration: 2,
      });
    }
  };

  const sendEmail = (formValues) => {
    const templateParams = {
      student_name: topic?.owner?.accountId.name,
      instructor_name: topic?.instructor?.accountId.name,
      topic_title: topic?.vietnameseName,
      criteria_1: formValues.criteriaOne,
      criteria_2: formValues.criteriaTwo,
      criteria_3: formValues.criteriaThree,
      criteria_4: formValues.criteriaFour,
      criteria_5: formValues.criteriaFive,
      criteria_6: formValues.criteriaSix,
      criteria_7: formValues.criteriaSeven,
      criteria_8: formValues.criteriaEight,
      grade: formValues.criteriaNine,
      is_eureka: formValues.criteriaTen,
      notes: formValues.criteriaEleven,
    };

    emailjs
      .send(
        "service_58b77bc",
        "template_raalckx",
        templateParams,
        "csc_oEDcgGk9d_Gtc"
      )
      .then(
        (result) => {
          console.log("Email sent successfully:", result.text);
        },
        (error) => {
          console.error("Error sending email:", error.text);
        }
      );
  };

  return (
    <div className="min-h-[calc(100vh-45.8px)] bg-gray-100 px-32">
      <div className="flex justify-between py-4">
        <span className="text-lg font-semibold">Kiểm duyệt đề tài</span>
        <Button
          onClick={() => setIsModalOpen(true)}
          loading={!topic}
          icon={<InfoIcon className="size-4" />}
          type="primary"
          className="flex items-center justify-center"
        >
          Thông tin chi tiết
        </Button>
      </div>

      <Spin spinning={!topic}>
        <div className="relative flex gap-4">
          <ReviewForm
            form={form}
            onFinish={onFinish}
            value={value}
            setValue={setValue}
          />

          <div className="space-y-4 bg-white rounded-md sticky top-4 h-fit w-[290px] p-4">
            <span className="font-medium">Danh sách tiêu chí</span>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 11 }, (_, i) => (
                <Button
                  key={`button-${i}`}
                  className="w-[45px]"
                  onClick={() => form.scrollToField(`criteria${i + 1}`)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Spin>

      <DetailModal
        isOpen={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        topic={topic}
      />

      {contextHolder}
    </div>
  );
}
