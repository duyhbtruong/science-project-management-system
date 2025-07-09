"use client";

import { getAccountById } from "@/service/accountService";
import {
  createReview,
  getReviewById,
  updateReviewById,
} from "@/service/reviewService";

import { Button, Form, Spin, App, Alert } from "antd";

import emailjs from "@emailjs/browser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { InfoIcon } from "lucide-react";
import ReviewForm from "./review-form";
import DetailModal from "./detail-modal";
import { getCriteria } from "@/service/criteriaService";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { useCustomSession } from "@/hooks/use-custom-session";
import { isWithinReviewPeriod } from "@/utils/validator";

export default function ReviewTopicPage({ params }) {
  const { reviewId } = params;
  const { session } = useCustomSession();
  const userId = session?.user?.id;

  const [account, setAccount] = useState();
  const [instructor, setInstructor] = useState();
  const [topic, setTopic] = useState();
  const [review, setReview] = useState();
  const [criteria, setCriteria] = useState();
  const [isReviewPeriod, setIsReviewPeriod] = useState(false);

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

  useEffect(() => {
    if (!topic?.registrationPeriod) return;

    const isInReviewPeriod = isWithinReviewPeriod(topic.registrationPeriod);
    setIsReviewPeriod(isInReviewPeriod);
  }, [topic]);

  const onFinish = async (formData) => {
    if (!isReviewPeriod) {
      message.error(
        "Không trong thời gian kiểm duyệt. Chỉ có thể kiểm duyệt đề tài trong khoảng thời gian từ ngày kết thúc đăng ký đến hạn kiểm duyệt."
      );
      return;
    }

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
      } else {
        const errorData = await res.json();
        message.error(errorData.message || "Có lỗi xảy ra khi gửi đánh giá");
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

      {topic && !isReviewPeriod && (
        <Alert
          message="Không trong thời gian kiểm duyệt"
          description="Chỉ có thể kiểm duyệt đề tài trong khoảng thời gian từ ngày kết thúc đăng ký đến hạn kiểm duyệt."
          type="warning"
          showIcon
          className="mb-4"
        />
      )}

      <Spin spinning={!topic}>
        <div className="flex relative gap-4">
          <ReviewForm
            form={form}
            onFinish={onFinish}
            criteria={criteria}
            disabled={!isReviewPeriod}
          />

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
