import { useState } from "react";
import { Modal, Table, message } from "antd";
import {
  assignAppraisalBoard,
  assignReviewInstructor,
  deleteTopicById,
} from "@/service/topicService";

import ExpandedRow from "./expanded-row";
import AssignmentModal from "./assignment-modal";
import { getTableColumns } from "./table-columns";

const TopicTable = ({
  listTopic,
  listReviewInstructor,
  listAppraiseStaff,
  loadTopics,
}) => {
  const [modal, modalContextHolder] = Modal.useModal();
  const [activeExpRow, setActiveExpRow] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [messageApi, messageContextHolder] = message.useMessage();

  const [assignedTopicId, setAssignedTopicId] = useState();
  const [selectedInstructor, setSelectedInstructor] = useState(`Không có`);
  const [selectedStaff, setSelectedStaff] = useState(`Không có`);

  const showModal = (topic) => {
    if (topic.reviewInstructor) {
      setSelectedInstructor(topic.reviewInstructor._id);
    }

    if (topic.appraiseStaff) {
      setSelectedStaff(topic.appraiseStaff._id);
    }
    setAssignedTopicId(topic._id);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (selectedInstructor) {
      let res = await assignReviewInstructor(
        assignedTopicId,
        selectedInstructor
      );

      if (res.status === 200) {
        res = await res.json();
        const { message } = res;
        messageApi.open({
          type: "success",
          content: message,
          duration: 2,
        });
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

    if (selectedStaff) {
      let res = await assignAppraisalBoard(assignedTopicId, selectedStaff);
      if (res.status === 200) {
        res = await res.json();
        const { message } = res;
        messageApi.open({
          type: "success",
          content: message,
          duration: 2,
        });
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
    setAssignedTopicId(null);
    setSelectedInstructor(`Không có`);
    setSelectedStaff(`Không có`);
    loadTopics();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const deleteTopic = async (id) => {
    const confirmed = await modal.confirm({
      title: "Xóa đề tài",
      content: "Bạn có chắc chắn muốn xóa đề tài này không?",
    });

    if (confirmed) {
      let res = await deleteTopicById(id);
      res = await res.json();

      if (res.status === 200) {
        const { message } = res;
        messageApi.open({
          type: "success",
          content: message,
          duration: 2,
        });
        loadTopics();
      } else {
        const { message } = res;
        messageApi.open({
          type: "error",
          content: message,
          duration: 2,
        });
      }
    }
  };

  const columns = getTableColumns(showModal, deleteTopic);

  return (
    <>
      <Table
        rowKey={(record) => record._id}
        tableLayout="fixed"
        columns={columns}
        dataSource={listTopic}
        pagination={{ pageSize: 8 }}
        expandable={{
          expandedRowRender: (record) =>
            record._id === activeExpRow[0] ? (
              <ExpandedRow record={record} />
            ) : null,
          expandedRowKeys: activeExpRow,
          onExpand: (expanded, record) => {
            setActiveExpRow(expanded ? [record._id] : []);
          },
        }}
      />

      <AssignmentModal
        isVisible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        selectedInstructor={selectedInstructor}
        selectedStaff={selectedStaff}
        setSelectedInstructor={setSelectedInstructor}
        setSelectedStaff={setSelectedStaff}
        listReviewInstructor={listReviewInstructor}
        listAppraiseStaff={listAppraiseStaff}
      />
      {modalContextHolder}
      {messageContextHolder}
    </>
  );
};

export default TopicTable;
