import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Card, Input } from "antd";
import { MenuIcon, TrashIcon } from "lucide-react";

export const SortableItem = ({ id, title, onChange, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} className="mb-2">
      <div className="flex items-center">
        <MenuIcon
          {...attributes}
          {...listeners}
          className="mr-2 text-gray-500 cursor-move size-4 focus:outline-none"
        />
        <Input
          value={title}
          onChange={(e) => onChange(id, e.target.value)}
          className="flex-1 mr-2"
        />
        <Button
          danger
          onClick={() => onDelete(id)}
          icon={<TrashIcon className="size-4" />}
          className="flex items-center"
        >
          Xóa
        </Button>
      </div>
    </Card>
  );
};
