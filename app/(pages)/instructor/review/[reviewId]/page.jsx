"use client";

import { getAccountById } from "@/service/accountService";
import {
  createReview,
  getReviewById,
  updateReviewById,
} from "@/service/reviewService";

import { Button, Form, Spin, App } from "antd";

import emailjs from "@emailjs/browser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { InfoIcon } from "lucide-react";
import ReviewForm from "./review-form";
import DetailModal from "./detail-modal";
import { getCriteria } from "@/service/criteriaService";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { useCustomSession } from "@/hooks/use-custom-session";

export default function ReviewTopicPage({ params }) {
  const { reviewId } = params;
  const { session } = useCustomSession();
  const userId = session?.user?.id;

  const [account, setAccount] = useState();
  const [instructor, setInstructor] = useState();
  const [topic, setTopic] = useState();
  const [review, setReview] = useState();
  const [criteria, setCriteria] = useState();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { message } = App.useApp();

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

  const loadCriteria = async () => {
    let res = await getCriteria();
    res = await res.json();
    setCriteria(res);
  };

  useEffect(() => {
    if (!reviewId || !userId) return;

    const loadData = async () => {
      await Promise.all([loadReview(), loadAccount(), loadCriteria()]);
    };

    loadData();
  }, [reviewId, userId]);

  useEffect(() => {
    if (!review) return;

    const formValues = {
      finalGrade: review.finalGrade,
      isEureka: review.isEureka ? "Có" : "Không",
      comment: review.comment,
    };

    review.criteria?.forEach((criterion) => {
      formValues[`criteria_${criterion.criteriaId}`] = criterion.grade;
    });

    form.setFieldsValue(formValues);
    setLoading(false);
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
        const { message: messageApi } = await res.json();
        await message.open({
          type: "success",
          content: messageApi,
          duration: 2,
        });
        router.push(`/instructor/review`);
        sendEmail(formData, topic);
      }
    } catch (error) {
      await message.open({
        type: "error",
        content: error.message,
        duration: 2,
      });
    }
  };

  const sendEmail = (formValues, topic) => {
    if (
      !topic?.owner?.accountId?.name ||
      !topic?.instructor?.accountId?.name ||
      !topic?.vietnameseName
    ) {
      console.error("Missing required topic data:", {
        student: topic?.owner?.accountId?.name,
        instructor: topic?.instructor?.accountId?.name,
        title: topic?.vietnameseName,
      });
      return;
    }

    const criteriaTable = criteria.map((criterion, index) => {
      const grade = formValues[`criteria_${criterion._id}`];
      if (grade === undefined) {
        console.error(`Missing grade for criterion ${criterion.title}`);
      }
      return {
        index: index + 1,
        title: criterion.title || "N/A",
        grade: grade || "N/A",
      };
    });

    const templateParams = {
      student_name: topic.owner.accountId.name,
      instructor_name: topic.instructor.accountId.name,
      topic_title: topic.vietnameseName,
      final_grade: formValues.finalGrade || "N/A",
      is_eureka: formValues.isEureka || "Không",
      notes: formValues.comment || "Không có",
      criteria_table: criteriaTable,
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

  if (loading) return <FullscreenLoader label="Loading..." />;

  return (
    <div className="min-h-[calc(100vh-45.8px)] bg-gray-100 px-32">
      <div className="flex justify-between py-4">
        <span className="text-lg font-semibold">Kiểm duyệt đề tài</span>
        <Button
          onClick={() => setIsModalOpen(true)}
          loading={!topic}
          icon={<InfoIcon className="size-4" />}
          type="primary"
          className="flex justify-center items-center"
        >
          Thông tin chi tiết
        </Button>
      </div>

      <Spin spinning={!topic}>
        <div className="flex relative gap-4">
          <ReviewForm form={form} onFinish={onFinish} criteria={criteria} />

          <div className="space-y-4 bg-white rounded-md sticky top-4 h-fit w-[290px] p-4">
            <span className="font-medium">Danh sách tiêu chí</span>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: criteria?.length + 3 || 0 }, (_, i) => (
                <Button
                  key={`button-${i}`}
                  className="w-[45px]"
                  onClick={() => {
                    if (i < criteria?.length) {
                      form.scrollToField(`criteria_${criteria[i]._id}`);
                    } else if (i === criteria?.length) {
                      form.scrollToField("finalGrade");
                    } else if (i === criteria?.length + 1) {
                      form.scrollToField("isEureka");
                    } else if (i === criteria?.length + 2) {
                      form.scrollToField("comment");
                    }
                  }}
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
    </div>
  );
}
