import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Input, Space } from "antd";
import { GripVerticalIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

export const SortableItem = ({ id, title, onChange, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = async () => {
    await onChange(id, editTitle);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 p-4 mb-2 bg-white border rounded shadow-sm"
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVerticalIcon className="text-gray-400" />
      </div>

      <div className="flex items-center flex-1">
        {isEditing ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full"
          />
        ) : (
          <div>
            <div className="font-medium">{title}</div>
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
