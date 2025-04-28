import { Input, Button } from "antd";
import { PlusIcon, SearchIcon } from "lucide-react";

const { Search } = Input;

export default function SearchBar({ onSearch, onChange, onAdd, loading }) {
  return (
    <div className="flex justify-between">
      <Search
        className="w-[450px] mb-4"
        placeholder="Tìm kiếm đợt đăng ký..."
        enterButton={<SearchIcon className="size-4" />}
        onSearch={onSearch}
        onChange={onChange}
      />
      <Button
        loading={loading}
        onClick={onAdd}
        icon={<PlusIcon className="size-4" />}
        type="primary"
        className="flex items-center justify-center"
      >
        Tạo đợt đăng ký
      </Button>
    </div>
  );
}
