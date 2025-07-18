import { Modal, Select, Space, Tag, Alert } from "antd";
import { XIcon } from "lucide-react";
const { Option } = Select;

const AssignmentModal = ({
  isVisible,
  onOk,
  onCancel,
  selectedInstructors,
  selectedStaffs,
  setSelectedInstructors,
  setSelectedStaffs,
  listReviewInstructor,
  listAppraiseStaff,
  topicInstructor,
  confirmLoading,
}) => {
  const handleInstructorChange = (value) => {
    if (value === "Không có") {
      setSelectedInstructors([]);
    } else {
      setSelectedInstructors(value);
    }
  };

  const handleStaffChange = (value) => {
    if (value === "Không có") {
      setSelectedStaffs([]);
    } else {
      setSelectedStaffs(value);
    }
  };

  const getInstructorName = (id) => {
    const instructor = listReviewInstructor?.find((i) => i._id === id);
    return instructor?.account.name || "Không xác định";
  };

  const getStaffName = (id) => {
    const staff = listAppraiseStaff?.find((s) => s._id === id);
    return staff?.account.name || "Không xác định";
  };

  const availableReviewers = listReviewInstructor?.filter(
    (instructor) => instructor._id !== topicInstructor?._id
  );

  return (
    <Modal
      title="Phân công Công việc"
      open={isVisible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Xác nhận"
      cancelText="Hủy bỏ"
      className="p-4"
      width={600}
      confirmLoading={confirmLoading}
    >
      <div className="flex flex-col space-y-6">
        <Alert
          message="Lưu ý về thời gian phân công"
          description={
            <ul className="pl-4 mt-2 list-disc">
              <li>
                Giảng viên kiểm duyệt: Chỉ có thể phân công sau khi kết thúc đợt
                đăng ký và trước hạn kiểm duyệt
              </li>
              <li>
                Hội đồng thẩm định: Chỉ có thể phân công sau khi hết hạn nộp báo
                cáo
              </li>
            </ul>
          }
          type="info"
          showIcon
          className="mb-4"
        />

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Giảng viên kiểm duyệt
          </label>
          <Select
            mode="multiple"
            placeholder="Chọn giảng viên kiểm duyệt"
            className="w-full"
            value={selectedInstructors}
            onChange={handleInstructorChange}
            maxTagCount={3}
            maxTagTextLength={20}
            optionFilterProp="children"
            showSearch
          >
            {availableReviewers?.map((instructor, index) => (
              <Option key={`review-instructor-${index}`} value={instructor._id}>
                {instructor.account.name}
              </Option>
            ))}
          </Select>
          {selectedInstructors && selectedInstructors.length > 0 && (
            <div className="mt-2">
              <p className="mb-2 text-sm text-gray-600">Đã chọn:</p>
              <Space wrap>
                {selectedInstructors.map((id) => (
                  <Tag
                    key={id}
                    closable
                    onClose={() => {
                      setSelectedInstructors(
                        selectedInstructors.filter((i) => i !== id)
                      );
                    }}
                  >
                    {getInstructorName(id)}
                  </Tag>
                ))}
              </Space>
            </div>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Hội đồng thẩm định
          </label>
          <Select
            mode="multiple"
            placeholder="Chọn hội đồng thẩm định"
            className="w-full"
            value={selectedStaffs}
            onChange={handleStaffChange}
            maxTagCount={3}
            maxTagTextLength={20}
            optionFilterProp="children"
            showSearch
          >
            {listAppraiseStaff?.map((appraisalStaff, index) => (
              <Option
                key={`appraisal-staff-${index}`}
                value={appraisalStaff._id}
              >
                {appraisalStaff.account.name}
              </Option>
            ))}
          </Select>
          {selectedStaffs.length > 0 && (
            <div className="mt-2">
              <p className="mb-2 text-sm text-gray-600">Đã chọn:</p>
              <Space wrap>
                {selectedStaffs.map((id) => (
                  <Tag
                    key={id}
                    closable
                    onClose={() => {
                      setSelectedStaffs(selectedStaffs.filter((s) => s !== id));
                    }}
                  >
                    {getStaffName(id)}
                  </Tag>
                ))}
              </Space>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AssignmentModal;
