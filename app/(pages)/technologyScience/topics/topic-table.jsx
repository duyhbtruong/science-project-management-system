import { useState } from "react";
import { Modal, Table, message } from "antd";
import { deleteTopicById } from "@/service/topicService";

import ExpandedRow from "./expanded-row";
import { getTableColumns } from "./table-columns";

const TopicTable = ({ listTopic, loadTopics, showModal }) => {
  const [modal, modalContextHolder] = Modal.useModal();
  const [activeExpRow, setActiveExpRow] = useState([]);
  const [messageApi, messageContextHolder] = message.useMessage();

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
      {modalContextHolder}
      {messageContextHolder}
    </>
  );
};

export default TopicTable;
