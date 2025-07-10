import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Input, Space, Modal } from "antd";
import { GripVerticalIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

export const SortableItem = ({ id, title, onChange, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const showDeleteConfirm = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(id);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex gap-4 items-center p-4 mb-2 bg-white rounded border shadow-sm"
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVerticalIcon className="text-gray-400" />
      </div>

      <div className="flex flex-1 items-center">
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
          onClick={showDeleteConfirm}
          icon={<TrashIcon className="size-4" />}
        />
      </Space>

      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa mục "{title}" không?</p>
      </Modal>
    </div>
  );
};
