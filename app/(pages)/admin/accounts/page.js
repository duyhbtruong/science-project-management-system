"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button, Space, Table } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { deleteAccountById, getAccounts } from "@/service/accountService";

const { Column } = Table;

const AccountsPage = () => {
  const router = useRouter();
  const [accounts, setAccounts] = useState();

  const loadAccounts = async () => {
    setAccounts(await getAccounts());
  };

  const deleteAccount = async (id) => {
    const confirmed = confirm("Are you sure?");

    if (confirmed) {
      await deleteAccountById(id);
      loadAccounts();
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  // console.log("accounts: ", accounts);

  return (
    <>
      <div className="flex justify-center w-screen mt-8">
        <div className="w-[1000px]">
          <div className="flex flex-col gap-y-4">
            <div className="flex justify-end">
              <Button
                type="primary"
                onClick={() => router.push("/admin/accounts/create")}
                icon={<PlusOutlined />}
              >
                Tạo tài khoản
              </Button>
            </div>

            <Table dataSource={accounts} rowKey={(record) => record._id}>
              <Column title="Name" dataIndex="name" key="name" />
              <Column title="Email" dataIndex="email" key="email" />
              <Column title="Phone" dataIndex="phone" key="phone" />
              <Column
                title="Role"
                key="role"
                render={(_, record) => {
                  if (record.role === "student") return "Sinh viên";
                  if (record.role === "instructor") return "GVHD";
                  if (record.role === "training") return "Phòng Đào tạo";
                  if (record.role === "appraise") return "Phòng thẩm định";
                  if (record.role === "admin") return "Quản trị viên";
                }}
              />
              <Column
                title="Action"
                key="action"
                render={(_, record) => {
                  return (
                    <Space size="middle">
                      <Button
                        icon={<EditOutlined />}
                        onClick={() =>
                          router.push(`/admin/accounts/${record._id}`)
                        }
                      />
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deleteAccount(record._id)}
                      />
                    </Space>
                  );
                }}
              />
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountsPage;
