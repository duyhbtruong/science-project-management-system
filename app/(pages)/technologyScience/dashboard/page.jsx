"use client";

import { getAllPeriods } from "@/service/registrationService";
import { getTopicsByPeriod } from "@/service/topicService";
import { Card } from "antd";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [listPeriod, setListPeriod] = useState();
  const [chartsData, setChartsData] = useState();
  const [numberOfTopics, setNumberOfTopics] = useState(0);
  const [numberOfPeriods, setNumberOfPeriods] = useState(0);

  const loadPeriod = async () => {
    let res = await getAllPeriods();
    res = await res.json();
    setListPeriod(res);
  };

  const loadTopicsInEachPeriod = async () => {
    const data = [];
    let sum = 0;
    for (let i = 0; i < listPeriod.length; i++) {
      let periodData = await getTopicsByPeriod(listPeriod[i]._id);
      periodData = await periodData.json();
      data.push({ period: listPeriod[i].title, topics: periodData.length });
      sum += periodData.length;
    }
    setChartsData(data);
    setNumberOfTopics(sum);
    setNumberOfPeriods(listPeriod.length);
  };

  useEffect(() => {
    loadPeriod();
  }, []);

  useEffect(() => {
    if (!listPeriod) return;

    loadTopicsInEachPeriod();
  }, [listPeriod]);

  // Mock data
  //   const numberOfTopics = 120;
  //   const numberOfPeriods = 5;
  //   const chartData = [
  //     { period: "Period 1", topics: 20 },
  //     { period: "Period 2", topics: 25 },
  //     { period: "Period 3", topics: 30 },
  //     { period: "Period 4", topics: 15 },
  //     { period: "Period 5", topics: 30 },
  //   ];

  //   console.log(">>> listPeriod: ", listPeriod);
  //   console.log(">>> chartsData: ", chartsData);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Card 1: Number of Topics */}
        <Card className="shadow-lg">
          <h2 className="text-lg font-semibold">Số lượng đề tài</h2>
          <p className="mt-2 text-3xl font-bold">{numberOfTopics}</p>
        </Card>

        {/* Card 2: Number of Registration Periods */}
        <Card className="shadow-lg">
          <h2 className="text-lg font-semibold">Số lượng đợt đăng ký đề tài</h2>
          <p className="mt-2 text-3xl font-bold">{numberOfPeriods}</p>
        </Card>

        {/* Card 3: Chart */}
        <Card className="col-span-1 shadow-lg md:col-span-3">
          <h2 className="mb-4 text-lg font-semibold">
            Số lượng đề tài của mỗi đợt đăng ký
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartsData}
              margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="topics"
                stroke="#4CAF50"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
