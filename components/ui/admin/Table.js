"use client";

import { Button, Space, Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Column } = Table;

const AccountTable = ({ accounts }) => {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <Button
        type="primary"
        onClick={() => router.push("/admin/accounts/create")}
      >
        Create account
      </Button>
      <Table dataSource={accounts} rowKey={(record) => record._id}>
        <Column title="Name" dataIndex="name" key="name" />
        <Column title="Email" dataIndex="email" key="email" />
        <Column title="Phone" dataIndex="phone" key="phone" />
        <Column title="Password" dataIndex="password" key="password" />
        <Column title="Role" dataIndex="role" key="role" />
        <Column
          title="Action"
          key="action"
          render={(_, record) => {
            // console.log("id: ", record._id);
            return (
              <Space size="middle">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => router.push(`/admin/accounts/${record._id}`)}
                />
                <RemoveButton id={record._id} />
              </Space>
            );
          }}
        />
      </Table>
    </div>
  );
};

const RemoveButton = ({ id }) => {
  const router = useRouter();

  const deleteAccount = async () => {
    const confirmed = confirm("Are you sure?");

    if (confirmed) {
      try {
        const res = await fetch(`http://localhost:3000/api/accounts?id=${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Failed to delete account!");
        }

        router.refresh();
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  };

  return <Button danger icon={<DeleteOutlined onClick={deleteAccount} />} />;
};

export default AccountTable;
