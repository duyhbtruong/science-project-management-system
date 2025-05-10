import { useState } from "react";
import { Modal, Table, message } from "antd";

import ExpandedRow from "./expanded-row";
import { getTableColumns } from "./table-columns";

const TopicTable = ({ listTopic }) => {
  const [activeExpRow, setActiveExpRow] = useState([]);

  const columns = getTableColumns();

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
    </>
  );
};

export default TopicTable;
