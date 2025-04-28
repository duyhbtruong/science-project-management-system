import { Modal, Select } from "antd";
const { Option } = Select;

const AssignmentModal = ({
  isVisible,
  onOk,
  onCancel,
  selectedInstructor,
  selectedStaff,
  setSelectedInstructor,
  setSelectedStaff,
  listReviewInstructor,
  listAppraiseStaff,
}) => {
  return (
    <Modal
      title="Phân công Công việc"
      open={isVisible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Xác nhận"
      cancelText="Hủy bỏ"
      className="p-4"
    >
      <div className="flex flex-col space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Giảng viên kiểm duyệt
          </label>
          <Select
            placeholder="Select an instructor"
            className="w-full"
            value={selectedInstructor}
            onChange={(value) => setSelectedInstructor(value)}
          >
            <Option value={`Không có`}>Không có</Option>
            {listReviewInstructor?.map((instructor, index) => (
              <Option key={`review-instructor-${index}`} value={instructor._id}>
                {instructor.account.name}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Cán bộ thẩm định
          </label>
          <Select
            placeholder="Select a staff member"
            className="w-full"
            value={selectedStaff}
            onChange={(value) => setSelectedStaff(value)}
          >
            <Option value={`Không có`}>Không có</Option>
            {listAppraiseStaff?.map((appraisalStaff, index) => (
              <Option
                key={`appraisal-staff-${index}`}
                value={appraisalStaff._id}
              >
                {appraisalStaff.account.name}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </Modal>
  );
};

export default AssignmentModal;
