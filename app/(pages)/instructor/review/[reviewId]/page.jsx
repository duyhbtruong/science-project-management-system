"use client";

import { getAccountById } from "@/service/accountService";
import {
  createReview,
  getReviewById,
  updateReviewById,
} from "@/service/reviewService";

import { Button, Form, Spin, message } from "antd";

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

  const loadAccount = async () => {
    let res = await getAccountById(userId);
    res = await res.json();
    setAccount(res.account);
    setInstructor(res.instructor);
  };

  const loadReview = async () => {
    let res = await getReviewById(reviewId);
    res = await res.json();
    setReview(res);
    setTopic(res.topicId);
  };

  useEffect(() => {
    if (!reviewId || !userId) return;
    loadReview();
    loadAccount();
  }, [reviewId, userId]);

  useEffect(() => {
    if (!review) return;

    const formValues = {
      finalGrade: review.finalGrade,
      isEureka: review.isEureka ? "Có" : "Không",
      comment: review.comment,
    };

    review.criteria.forEach((criterion) => {
      formValues[`criteria_${criterion.criteriaId}`] = criterion.grade;
    });

    form.setFieldsValue(formValues);
  }, [review]);

  const onFinish = async (formData) => {
    const criteriaGrades = Object.entries(formData)
      .filter(([key]) => key.startsWith("criteria_"))
      .map(([key, grade]) => {
        const criteriaId = key.replace("criteria_", "");
        return {
          criteriaId,
          grade: grade,
        };
      });

    const values = {
      criteria: criteriaGrades,
      topicId: reviewId,
      instructorId: instructor._id,
      finalGrade: formData.finalGrade,
      isEureka: formData.isEureka === "Có",
      comment: formData.comment,
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
      grade: formValues.finalGrade,
      is_eureka: formValues.isEureka,
      notes: formValues.comment,
    };

    Object.entries(formValues)
      .filter(([key]) => key.startsWith("criteria_"))
      .forEach(([key, value]) => {
        const criteriaId = key.replace("criteria_", "");
        const criterion = criteria.find((c) => c._id === criteriaId);
        if (criterion) {
          templateParams[`criteria_${criterion.order + 1}`] = value;
        }
      });

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
