"use client";

import { getAccountById } from "@/service/accountService";
import {
  createAppraise,
  getAppraiseById,
  updateAppraiseById,
} from "@/service/appraiseGradeService";
import { Button, Form, Spin, App, Alert } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";

import DetailModal from "./detail";
import { InfoIcon } from "lucide-react";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import AppraiseForm from "./appraise-form";
import { getCriteria } from "@/service/criteriaService";
import { useCustomSession } from "@/hooks/use-custom-session";
import { isWithinAppraisalPeriod } from "@/utils/validator";

export default function AppraiseTopicPage({ params }) {
  const { appraiseId } = params;
  const { session } = useCustomSession();
  const userId = session?.user?.id;

  const [account, setAccount] = useState();
  const [appraisalBoard, setAppraisalBoard] = useState();
  const [topic, setTopic] = useState();
  const [appraise, setAppraise] = useState();
  const [criteria, setCriteria] = useState();
  const [isAppraisalPeriod, setIsAppraisalPeriod] = useState(false);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { message } = App.useApp();
  const router = useRouter();

  const loadAccount = async () => {
    let res = await getAccountById(userId);
    res = await res.json();
    setAccount(res.account);
    setAppraisalBoard(res.appraisalBoard);
  };

  const loadAppraise = async () => {
    let res = await getAppraiseById(appraiseId);
    res = await res.json();
    setAppraise(res);
    setTopic(res.topicId);
  };

  const loadCriteria = async () => {
    let res = await getCriteria();
    res = await res.json();
    setCriteria(res);
  };

  useEffect(() => {
    if (!appraiseId || !userId) return;

    const loadData = async () => {
      await Promise.all([loadAppraise(), loadAccount(), loadCriteria()]);
    };

    loadData();
  }, [appraiseId, userId]);

  useEffect(() => {
    if (!appraise) return;

    const formValues = {
      finalGrade: appraise.finalGrade,
      isEureka: appraise.isEureka ? "Có" : "Không",
      comment: appraise.comment,
    };

    appraise.criteria?.forEach((criterion) => {
      formValues[`criteria_${criterion.criteriaId}`] = criterion.grade;
    });

    form.setFieldsValue(formValues);
    setLoading(false);
  }, [appraise]);

  useEffect(() => {
    if (!topic?.registrationPeriod) return;

    const isInAppraisalPeriod = isWithinAppraisalPeriod(
      topic.registrationPeriod
    );
    setIsAppraisalPeriod(isInAppraisalPeriod);
  }, [topic]);

  const onFinish = async (formData) => {
    if (!isAppraisalPeriod) {
      message.error(
        "Không trong thời gian thẩm định. Chỉ có thể thẩm định đề tài trong khoảng thời gian từ ngày kết thúc nộp báo cáo đến hạn thẩm định."
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
      topicId: appraiseId,
      appraisalBoardId: appraisalBoard._id,
      finalGrade: formData.finalGrade,
      isEureka: formData.isEureka === "Có",
      comment: formData.comment,
    };

    try {
      const res = !appraise
        ? await createAppraise(values)
        : await updateAppraiseById(appraise._id, values);

      if (res.status === 201 || res.status === 200) {
        const { message: messageApi } = await res.json();
        await message.open({
          type: "success",
          content: messageApi,
          duration: 2,
        });
        router.push(`/appraisal-board/appraise`);
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
        "template_6qodktp",
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
    <div className="min-h-[calc(100vh-56px)] bg-gray-100 px-32">
      <div className="flex justify-between py-4">
        <span className="text-lg font-semibold">Thẩm định đề tài</span>
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

      {topic && !isAppraisalPeriod && (
        <Alert
          message="Không trong thời gian thẩm định"
          description="Chỉ có thể thẩm định đề tài trong khoảng thời gian từ ngày kết thúc nộp báo cáo đến hạn thẩm định."
          type="warning"
          showIcon
          className="mb-4"
        />
      )}

      <Spin spinning={!topic}>
        <div className="flex relative gap-4">
          <AppraiseForm
            form={form}
            onFinish={onFinish}
            criteria={criteria}
            disabled={!isAppraisalPeriod}
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
