"use client";

import { Button, Space, Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const { Column } = Table;

const COLUMNS = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Password",
    dataIndex: "password",
    key: "password",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
];

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    getAccounts();
  }, []);

  const getAccounts = () => {
    fetch("http://localhost:3000/api/accounts", {
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch accounts.");
        else return response.json();
      })
      .then((data) => setAccounts(data));
  };

  return (
    <>
      <div className="mx-auto w-[800px] mt-4 space-y-4">
        <div>
          <Button type="primary" href="/accounts/create">
            Create account
          </Button>
        </div>
        <Table dataSource={accounts}>
          <Column title="Name" dataIndex="name" key="name" />
          <Column title="Email" dataIndex="email" key="email" />
          <Column title="Phone" dataIndex="phone" key="phone" />
          <Column title="Password" dataIndex="password" key="password" />
          <Column title="Role" dataIndex="role" key="role" />
          <Column
            title="Action"
            key="action"
            render={(_, record) => {
              console.log("id: ", record._id);
              return (
                <Space size="middle">
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    href={`/accounts/${record._id}`}
                  />
                  <Button type="default" icon={<DeleteOutlined />} />
                </Space>
              );
            }}
          />
        </Table>
      </div>
    </>
  );
};

export default AccountsPage;
