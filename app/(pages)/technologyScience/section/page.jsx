"use client";

import { useEffect, useState } from "react";
import { Button, Input, Spin, App } from "antd";
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

import {
  getSections,
  createSection,
  updateSection,
  deleteSection as apiDeleteSection,
  reorderSections as apiReorderSections,
} from "@/service/sectionService";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { PlusIcon, SaveIcon } from "lucide-react";

export default function SectionManager() {
  const [sections, setSections] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const { message } = App.useApp();

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    (async () => {
      try {
        const data = await getSections();
        setSections(
          data.map((s) => ({
            id: s._id,
            title: s.title,
            order: s.order,
          }))
        );
      } catch (err) {
        message.error("Lỗi lấy danh sách mục.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    let newSections = arrayMove(sections, oldIndex, newIndex).map(
      (sec, idx) => ({ ...sec, order: idx })
    );

    setSections(newSections);

    try {
      await apiReorderSections(
        newSections.map((s) => ({ id: s.id, order: s.order }))
      );
      message.success("Sắp xếp thành công.");
    } catch (err) {
      message.error("Sắp xếp thất bại.");
      const fresh = await getSections();
      setSections(
        fresh.map((s) => ({ id: s._id, title: s.title, order: s.order }))
      );
    }
  };

  const addSection = async () => {
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      const created = await createSection(newTitle.trim(), sections.length);
      setSections((prev) => [
        ...prev,
        { id: created._id, title: created.title, order: created.order },
      ]);
      setNewTitle("");
      message.success("Thêm mục thành công.");
    } catch (err) {
      message.error("Thêm mục thất bại.");
    } finally {
      setAdding(false);
    }
  };

  const updateTitle = async (id, title) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, title } : sec))
    );
    try {
      await updateSection(id, { title });
    } catch (err) {
      message.error("Cập nhật mục thất bại.");
      const fresh = await getSections();
      setSections(
        fresh.map((s) => ({ id: s._id, title: s.title, order: s.order }))
      );
    }
  };

  const deleteSection = async (id) => {
    setSections((prev) => prev.filter((sec) => sec.id !== id));
    try {
      await apiDeleteSection(id);
      message.success("Xóa mục thành công.");
    } catch (err) {
      message.error("Xóa mục thất bại.");
      const fresh = await getSections();
      setSections(
        fresh.map((s) => ({ id: s._id, title: s.title, order: s.order }))
      );
    }
  };

  const saveSections = async () => {
    setSaving(true);
    try {
      const updated = await apiReorderSections(
        sections.map((s) => ({ id: s.id, order: s.order }))
      );
      setSections(
        updated.map((s) => ({ id: s._id, title: s.title, order: s.order }))
      );
      message.success("Tất cả mục đã được lưu.");
    } catch {
      message.error("Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <FullscreenLoader label="Loading..." />;

  return (
    <div className="p-4">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium">Thêm Mục Mới</h2>
          <Input
            placeholder="Tiêu đề mục..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Button
            type="primary"
            onClick={addSection}
            loading={adding}
            className="flex justify-center items-center w-full"
            icon={<PlusIcon className="size-4" />}
          >
            Thêm Mục
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map((sec) => sec.id)}
            strategy={verticalListSortingStrategy}
          >
            {sections.map((sec) => (
              <SortableItem
                key={sec.id}
                id={sec.id}
                title={sec.title}
                onChange={updateTitle}
                onDelete={deleteSection}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
