"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  deleteAccountById,
  getAccounts,
  searchAccounts,
} from "@/service/accountService";
import { dateFormat } from "@/utils/format";
import Link from "next/link";

import { Button, Space, Table, Tag, Input, Modal } from "antd";
import { Edit, ImportIcon, Plus, SearchIcon, TrashIcon } from "lucide-react";
const { Search } = Input;
const { Column } = Table;

const AccountsPage = () => {
  const router = useRouter();
  const [accounts, setAccounts] = useState();
  const [modal, modalContextHolder] = Modal.useModal();

  const loadAccounts = async () => {
    var res = await getAccounts();
    res = await res.json();
    setAccounts(res);
  };

  const deleteAccount = async (id) => {
    const confirmed = await modal.confirm({
      title: "Xóa tài khoản",
      content: "Bạn có chắc chắn muốn xóa tài khoản này không?",
    });

    if (confirmed) {
      await deleteAccountById(id);
      loadAccounts();
    }
  };

  const handleAccountSearch = async (searchValue) => {
    const res = await searchAccounts(searchValue);
    setAccounts(res);
  };

  const handleSearchChange = (event) => {
    if (event.target.value === "") {
      loadAccounts();
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  return (
    <div className="h-screen px-6 py-6 bg-gray-100">
      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between">
          <Search
            className="w-[450px]"
            placeholder="Tìm kiếm tài khoản..."
            enterButton={<SearchIcon className="size-4" />}
            onSearch={handleAccountSearch}
            onChange={handleSearchChange}
          />

          <div className="flex justify-end gap-4">
            <Button
              type="primary"
              onClick={() => router.push("/admin/accounts/create")}
              icon={<Plus className="size-4" />}
              className="flex items-center justify-center"
            >
              Tạo tài khoản
            </Button>
            {/* TODO: Add import list of students through a spreadsheet file */}
            <Button
              type="default"
              icon={<ImportIcon className="size-4" />}
              className="flex items-center justify-center"
            >
              Nhập danh sách
            </Button>
          </div>
        </div>

        <Table
          dataSource={accounts}
          rowKey={(record) => record._id}
          tableLayout="fixed"
          pagination={{ pageSize: 8 }}
        >
          <Column title="Tên tài khoản" dataIndex="name" key="name" ellipsis />
          <Column
            title="Email"
            dataIndex="email"
            key="email"
            render={(_, record) => {
              return (
                <Link
                  target="_blank"
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${record.email}`}
                >
                  {record.email}
                </Link>
              );
            }}
            ellipsis
          />
          <Column
            title="Quyền"
            key="role"
            render={(_, record) => {
              if (record.role === "student")
                return <Tag color="geekblue">Sinh viên</Tag>;
              if (record.role === "technologyScience")
                return <Tag color="orange">Phòng Khoa học Công nghệ</Tag>;
              if (record.role === "appraisal-board")
                return <Tag color="cyan">Phòng Thẩm định</Tag>;
              if (record.role === "admin")
                return <Tag color="red">Quản trị viên</Tag>;
              if (record.role === "instructor")
                return <Tag color="purple">Giảng viên</Tag>;
            }}
            filters={[
              { text: "Sinh viên", value: "student" },
              {
                text: "Giảng viên",
                value: "instructor",
              },
              {
                text: "Phòng Khoa học Công nghệ",
                value: "technologyScience",
              },
              { text: "Phòng Thẩm định", value: "appraisal-board" },
              {
                text: "Quản trị viên",
                value: "admin",
              },
            ]}
            onFilter={(value, record) => record.role.indexOf(value) === 0}
          />
          <Column
            title="Ngày tạo"
            key="createdAt"
            render={(_, record) => {
              const createdAt = new Date(record.createdAt);
              return <div>{dateFormat(createdAt)}</div>;
            }}
          />
          <Column
            title="Hành động"
            key="action"
            align="right"
            render={(_, record) => {
              const isAdmin = record.role === "admin" ? true : false;

              return (
                <Space size="middle" align="end">
                  <Button
                    icon={<Edit className="size-4" />}
                    onClick={() => router.push(`/admin/accounts/${record._id}`)}
                    disabled={isAdmin}
                  />
                  <Button
                    danger
                    icon={<TrashIcon className="size-4" />}
                    onClick={() => deleteAccount(record._id)}
                    disabled={isAdmin}
                  />
                </Space>
              );
            }}
          />
        </Table>
      </div>
      {modalContextHolder}
    </div>
  );
};

export default AccountsPage;
