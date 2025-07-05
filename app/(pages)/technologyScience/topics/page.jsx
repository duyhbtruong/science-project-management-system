"use client";

import { useEffect, useState } from "react";

import { getAllPeriods } from "@/service/registrationService";
import { getAllInstructorsByFaculty } from "@/service/instructorService";
import { getAllAppraisalBoards } from "@/service/appraiseService";
import {
  getTopicsByPeriod,
  searchTopic,
  updateTopicById,
} from "@/service/topicService";

import TopicTable from "./topic-table";
import { Button, Input, Select, Spin } from "antd";
const { Search } = Input;
const { Option } = Select;

import { exportTopicList } from "@/utils/export";
import { DownloadIcon } from "lucide-react";
import AssignmentModal from "./assignment-modal";

export default function TopicsManagePage() {
  const [listTopic, setListTopic] = useState();
  const [listPeriod, setListPeriod] = useState();
  const [selectedPeriod, setSelectedPeriod] = useState();

  const [listAppraiseStaff, setListAppraiseStaff] = useState();
  const [listReviewInstructor, setListReviewInstructor] = useState();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [selectedStaffs, setSelectedStaffs] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const loadTopics = async () => {
    let res = await getTopicsByPeriod(selectedPeriod);
    res = await res.json();
    setListTopic(res);
  };

  const loadPeriod = async () => {
    let res = await getAllPeriods();
    res = await res.json();
    setListPeriod(res);
  };

  const loadReviewInstructors = async (topic) => {
    let res = await getAllInstructorsByFaculty(topic.owner.faculty);
    res = await res.json();
    setListReviewInstructor(res);
  };

  const loadAppraiseStaffs = async () => {
    let res = await getAllAppraisalBoards();
    res = await res.json();
    setListAppraiseStaff(res);
  };

  const handleSearchTopic = async (searchValue) => {
    var res = await searchTopic(selectedPeriod, searchValue);
    res = await res.json();
    setListTopic(res);
  };

  const handleSearchChange = async (event) => {
    if (event.target.value === "") {
      loadTopics();
    }
  };

  const handleExport = async () => {
    let students = [];
    for (const topic of listTopic) {
      students.push(topic.owner);
    }
    exportTopicList(listTopic, students);
  };

  const handlePeriodChange = (value) => {
    setSelectedPeriod(value);
    loadAppraiseStaffs();
  };

  const showModal = (record) => {
    setSelectedTopic(record);
    loadReviewInstructors(record);
    setSelectedInstructors(
      record.reviewAssignments
        ?.filter((a) => a.status !== "removed")
        .map((a) => a.instructor.id || [])
    );
    setSelectedStaffs(
      record.appraiseAssignments
        ?.filter((a) => a.status !== "removed")
        .map((a) => a.appraisalBoard.id) || []
    );
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    if (!selectedTopic) return;

    try {
      setConfirmLoading(true);
      const response = await updateTopicById(selectedTopic._id, {
        reviewInstructorIds: selectedInstructors,
        appraisalBoardIds: selectedStaffs,
      });

      if (!response.ok) {
        throw new Error("Failed to update assignments");
      }

      await loadTopics();
      setIsModalVisible(false);
      setSelectedTopic(null);
      setSelectedInstructors([]);
      setSelectedStaffs([]);
    } catch (error) {
      console.error("Error updating assignments:", error);
    } finally {
      setConfirmLoading(false);
    }

    setListReviewInstructor();
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedTopic(null);
    setSelectedInstructors([]);
    setSelectedStaffs([]);
  };

  useEffect(() => {
    loadPeriod();
  }, []);

  useEffect(() => {
    if (!selectedPeriod) return;

    loadTopics();
  }, [selectedPeriod]);

  return (
    <div className="bg-gray-100">
      <div className="flex flex-col py-6 mx-32">
        <div className="flex justify-between mb-4">
          <div className="space-x-4">
            {selectedPeriod && (
              <Select
                className="w-64"
                placeholder="Chọn đợt đăng ký..."
                onChange={handlePeriodChange}
                value={selectedPeriod}
              >
                {listPeriod.map((period, index) => (
                  <Option
                    key={`registration-period-${index}`}
                    value={period._id}
                  >
                    {period.title}
                  </Option>
                ))}
              </Select>
            )}

            {selectedPeriod && (
              <Search
                className="w-[450px] "
                placeholder="Tìm kiếm đề tài..."
                enterButton
                onSearch={handleSearchTopic}
                onChange={handleSearchChange}
              />
            )}
          </div>

          <Button
            loading={!listTopic && selectedPeriod}
            disabled={!selectedPeriod}
            onClick={handleExport}
            icon={<DownloadIcon className="size-4" />}
            type="primary"
            className="flex justify-center items-center"
          >
            Xuất danh sách
          </Button>
        </div>

        {!selectedPeriod ? (
          <div className="flex flex-col justify-center items-center p-8 bg-white rounded-lg shadow">
            <Select
              className="mb-4 w-64"
              placeholder="Chọn đợt đăng ký..."
              onChange={handlePeriodChange}
              value={selectedPeriod}
            >
              {listPeriod?.map((period, index) => (
                <Option key={`registration-period-${index}`} value={period._id}>
                  {period.title}
                </Option>
              ))}
            </Select>
            <p className="text-gray-500">
              Vui lòng chọn đợt đăng ký để xem danh sách đề tài
            </p>
          </div>
        ) : (
          <Spin spinning={!listTopic}>
            <TopicTable
              listTopic={listTopic}
              listReviewInstructor={listReviewInstructor}
              listAppraiseStaff={listAppraiseStaff}
              loadTopics={loadTopics}
              showModal={showModal}
            />
          </Spin>
        )}

        <AssignmentModal
          isVisible={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          selectedInstructors={selectedInstructors}
          selectedStaffs={selectedStaffs}
          setSelectedInstructors={setSelectedInstructors}
          setSelectedStaffs={setSelectedStaffs}
          listReviewInstructor={listReviewInstructor}
          listAppraiseStaff={listAppraiseStaff}
          topicInstructor={selectedTopic?.instructor}
          confirmLoading={confirmLoading}
        />
      </div>
    </div>
  );
}
