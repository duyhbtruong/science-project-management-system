"use client";

import { useEffect, useState } from "react";
import { Button, Input, InputNumber, message, Space } from "antd";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./sortable-item";
import { PlusIcon } from "lucide-react";
import { FullscreenLoader } from "@/components/fullscreen-loader";

import {
  getCriteria,
  createCriteria,
  updateCriteria as updateCriteriaService,
  deleteCriteria as deleteCriteriaService,
  reorderCriteria,
} from "@/service/criteriaService";

export default function CriteriaManager() {
  const [criteria, setCriteria] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newMinGrade, setNewMinGrade] = useState(5);
  const [newMaxGrade, setNewMaxGrade] = useState(100);
  const [newStep, setNewStep] = useState(5);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    loadCriteria();
  }, []);

  console.log("CRITERIA", criteria);

  const loadCriteria = async () => {
    try {
      const data = await getCriteria();
      if (data.ok) {
        const res = await data.json();
        setCriteria(
          res.map((c) => ({
            id: c._id,
            title: c.title,
            minGrade: c.minGrade,
            maxGrade: c.maxGrade,
            step: c.step,
          }))
        );
      }
    } catch (err) {
      // messageApi.error("Lỗi khi tải danh sách tiêu chí.");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = criteria.findIndex((c) => c.id === active.id);
    const newIndex = criteria.findIndex((c) => c.id === over.id);
    let newCriteria = arrayMove(criteria, oldIndex, newIndex);

    setCriteria(newCriteria);

    try {
      await reorderCriteria(newCriteria);
      messageApi.success("Sắp xếp thành công.");
    } catch (err) {
      messageApi.error("Sắp xếp thất bại.");
      loadCriteria();
    }
  };

  const validateGradeRange = () => {
    if (newMinGrade >= newMaxGrade) {
      messageApi.error("Điểm tối thiểu phải nhỏ hơn điểm tối đa");
      return false;
    }
    if (newStep <= 0) {
      messageApi.error("Bước phải lớn hơn 0");
      return false;
    }
    if ((newMaxGrade - newMinGrade) % newStep !== 0) {
      messageApi.error("Khoảng điểm phải chia hết cho giá trị bước");
      return false;
    }
    return true;
  };

  const addCriteria = async () => {
    if (!newTitle.trim()) {
      messageApi.error("Tiêu đề là bắt buộc");
      return;
    }

    if (!validateGradeRange()) {
      return;
    }

    setAdding(true);
    try {
      const created = await createCriteria({
        title: newTitle.trim(),
        minGrade: newMinGrade,
        maxGrade: newMaxGrade,
        step: newStep,
      });

      setCriteria((prev) => [
        ...prev,
        {
          id: created._id,
          title: created.title,
          minGrade: created.minGrade,
          maxGrade: created.maxGrade,
          step: created.step,
        },
      ]);

      setNewTitle("");
      messageApi.success("Tiêu chí đã được thêm thành công.");
    } catch (err) {
      messageApi.error("Thêm tiêu chí thất bại.");
    } finally {
      setAdding(false);
    }
  };

  const handleUpdateCriteria = async (id, updatedCriteria) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedCriteria } : c))
    );
    try {
      await updateCriteriaService(id, updatedCriteria);
    } catch (err) {
      messageApi.error("Failed to update criteria.");
      loadCriteria();
    }
  };

  const deleteCriteria = async (id) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id));
    try {
      await deleteCriteriaService(id);
      messageApi.success("Tiêu chí đã được xóa thành công.");
    } catch (err) {
      messageApi.error("Xóa tiêu chí thất bại.");
      loadCriteria();
    }
  };

  if (loading) return <FullscreenLoader label="Loading..." />;

  return (
    <div className="p-4">
      {contextHolder}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium">Thêm Tiêu chí Mới</h2>
          <Input
            placeholder="Tiêu đề tiêu chí..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">
                Điểm Tối Thiểu
              </label>
              <InputNumber
                min={0}
                value={newMinGrade}
                onChange={setNewMinGrade}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">
                Điểm Tối Đa
              </label>
              <InputNumber
                min={0}
                value={newMaxGrade}
                onChange={setNewMaxGrade}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">Bước</label>
              <InputNumber
                min={1}
                value={newStep}
                onChange={setNewStep}
                className="w-full"
              />
            </div>
          </div>
          <Button
            type="primary"
            onClick={addCriteria}
            loading={adding}
            className="flex items-center justify-center w-full"
            icon={<PlusIcon className="size-4" />}
          >
            Thêm Tiêu chí
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={criteria.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {criteria.map((c) => (
              <SortableItem
                key={c.id}
                id={c.id}
                title={c.title}
                minGrade={c.minGrade}
                maxGrade={c.maxGrade}
                step={c.step}
                onUpdate={handleUpdateCriteria}
                onDelete={deleteCriteria}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
