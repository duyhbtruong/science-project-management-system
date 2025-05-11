import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Input, InputNumber, Space } from "antd";
import { GripVerticalIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

export const SortableItem = ({
  id,
  title,
  minGrade,
  maxGrade,
  step,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editMinGrade, setEditMinGrade] = useState(minGrade);
  const [editMaxGrade, setEditMaxGrade] = useState(maxGrade);
  const [editStep, setEditStep] = useState(step);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = async () => {
    if (editMinGrade >= editMaxGrade) {
      message.error("Điểm tối thiểu phải nhỏ hơn điểm tối đa");
      return;
    }
    if (editStep <= 0) {
      message.error("Bước phải lớn hơn 0");
      return;
    }
    if ((editMaxGrade - editMinGrade) % editStep !== 0) {
      message.error("Khoảng điểm phải chia hết cho giá trị bước");
      return;
    }

    await onUpdate(id, {
      title: editTitle,
      minGrade: editMinGrade,
      maxGrade: editMaxGrade,
      step: editStep,
    });
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-4 p-4 mb-2 bg-white border rounded shadow-sm"
    >
      <div {...attributes} {...listeners} className="mt-2 cursor-grab">
        <GripVerticalIcon className="text-gray-400" />
      </div>

      <div className="flex-1">
        {isEditing ? (
          <div className="space-y-4">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="mb-2"
            />
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium">
                  Điểm Tối Thiểu
                </label>
                <InputNumber
                  min={0}
                  value={editMinGrade}
                  onChange={setEditMinGrade}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium">
                  Điểm Tối Đa
                </label>
                <InputNumber
                  min={0}
                  value={editMaxGrade}
                  onChange={setEditMaxGrade}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-sm font-medium">Bước</label>
                <InputNumber
                  min={1}
                  value={editStep}
                  onChange={setEditStep}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="font-medium">{title}</div>
            <div className="text-sm text-gray-500">
              Khoảng điểm: {minGrade} đến {maxGrade} (Bước: {step})
            </div>
          </div>
        )}
      </div>

      <Space>
        <Button
          type={isEditing ? "primary" : "default"}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? "Lưu" : "Chỉnh sửa"}
        </Button>
        {isEditing && <Button onClick={() => setIsEditing(false)}>Hủy</Button>}
        <Button
          type="text"
          danger
          onClick={() => onDelete(id)}
          icon={<TrashIcon className="size-4" />}
        />
      </Space>
    </div>
  );
};
