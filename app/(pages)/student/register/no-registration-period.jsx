import { Card } from "antd";

export const NoRegistrationPeriod = () => {
  return (
    <div className="flex items-center justify-center bg-gray-100 h-[calc(100vh-56px)]">
      <Card
        className="w-full max-w-md rounded-lg shadow-lg"
        bordered={false}
        style={{
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div className="p-4">
          <h2 className="mb-4 text-2xl font-semibold text-center text-gray-800">
            📢 Chưa mở đợt đăng ký đề tài
          </h2>
          <p className="mb-6 text-center text-gray-600">
            Hiện không nằm trong thời gian đăng ký đề tài nghiên cứu khoa học.
            Sinh viên vui lòng quay lại sau.
          </p>
        </div>
      </Card>
    </div>
  );
};
