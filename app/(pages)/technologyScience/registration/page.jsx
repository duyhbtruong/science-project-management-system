"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  deletePeriodById,
  getAllPeriods,
  searchPeriods,
} from "@/service/registrationService";

import { Spin, App } from "antd";
import SearchBar from "./search-bar";
import PeriodTable from "./period-table";

export default function RegistrationPeriodPage() {
  const router = useRouter();
  const [periods, setPeriods] = useState();
  const { message, modal } = App.useApp();

  const handleEdit = (periodId) => {
    router.push(`/technologyScience/registration/${periodId}`);
  };

  const handleDelete = async (periodId) => {
    const confirmed = await modal.confirm({
      title: "Xóa đợt đăng ký",
      content: "Bạn có chắc chắn muốn xóa đợt đăng ký này không?",
    });

    if (!confirmed) return;

    let res = await deletePeriodById(periodId);

    if (res.status === 200) {
      res = await res.json();
      const { message: messageApi } = res;
      message
        .open({
          type: "success",
          content: messageApi,
          duration: 2,
        })
        .then(() => loadPeriods());
    } else {
      res = await res.json();
      const { message: messageApi } = res;
      message.open({
        type: "error",
        content: messageApi,
        duration: 2,
      });
    }
  };

  const loadPeriods = async () => {
    var res = await getAllPeriods();
    res = await res.json();
    setPeriods(res);
  };

  const handleAdd = () => {
    router.push(`registration/create`);
  };

  const handleSearch = async (searchValue) => {
    var res = await searchPeriods(searchValue);
    res = await res.json();
    setPeriods(res);
  };

  const handleSearchChange = async (event) => {
    if (event.target.value === "") {
      loadPeriods();
    }
  };

  useEffect(() => {
    loadPeriods();
  }, []);

  return (
    <>
      <div className="bg-gray-100">
        <div className="flex flex-col py-6 mx-32">
          <SearchBar
            onSearch={handleSearch}
            onChange={handleSearchChange}
            onAdd={handleAdd}
            loading={!periods}
          />

          <Spin spinning={!periods}>
            <PeriodTable
              periods={periods}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Spin>
        </div>
      </div>
    </>
  );
}
