import { Modal, Divider, Button, Input, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useState } from "react";

export const ProfileModal = ({
  profileModalOpen,
  setProfileModalOpen,
  profileModalLoading,
  profileModalData,
}) => {
  const account = profileModalData?.account;
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) {
      message.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      message.error("Mật khẩu xác nhận không khớp");
      return;
    }

    const response = await fetch(`/api/accounts/${account?._id}`, {
      method: "PUT",
      body: JSON.stringify({ password: newPassword }),
    });

    if (response.ok) {
      message.success("Đổi mật khẩu thành công");
      setIsChangingPassword(false);
      setNewPassword("");
      setConfirmPassword("");
    } else {
      message.error("Đổi mật khẩu thất bại");
    }
  };

  const renderPasswordSection = () => {
    if (!isChangingPassword) {
      return (
        <div className="flex items-center justify-between gap-2">
          <div className="font-semibold text-gray-800">Mật khẩu</div>
          <Button
            variant="outlined"
            color="default"
            onClick={() => setIsChangingPassword(true)}
          >
            Đổi mật khẩu
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="font-semibold text-gray-800">Mật khẩu</div>
          <Button
            onClick={() => {
              setIsChangingPassword(false);
              setNewPassword("");
              setConfirmPassword("");
            }}
          >
            Hủy
          </Button>
        </div>
        <div className="space-y-3">
          <Input.Password
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            prefix={<LockOutlined className="text-gray-400" />}
          />
          <Input.Password
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            prefix={<LockOutlined className="text-gray-400" />}
          />
          <Button
            type="primary"
            block
            onClick={handlePasswordChange}
            disabled={!newPassword || !confirmPassword}
          >
            Xác nhận
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={
        <div className="text-xl font-semibold text-gray-800">
          Chi tiết hồ sơ
        </div>
      }
      open={profileModalOpen}
      footer={null}
      loading={profileModalLoading}
      onCancel={() => setProfileModalOpen(false)}
      width={600}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
            <UserOutlined className="text-2xl text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {account?.name}
            </h3>
            <p className="text-gray-500">
              {account?.role === "admin"
                ? "Quản trị viên"
                : account?.role === "instructor"
                ? "Giảng viên"
                : account?.role === "student"
                ? "Sinh viên"
                : account?.role === "technologyScience"
                ? "Phòng KHCN"
                : account?.role === "appraisal-board"
                ? "Cán bộ thẩm định"
                : "Khác"}
            </p>
          </div>
        </div>

        <Divider className="m-0" />

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="font-semibold text-gray-800">Email</div>
            <div className="text-gray-800">{account?.email}</div>
          </div>
        </div>

        <Divider className="m-0" />

        <div className="flex flex-col gap-2">{renderPasswordSection()}</div>

        <Divider className="m-0" />

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="font-semibold text-gray-800">Số điện thoại</div>
            <div className="text-gray-800">
              {account?.phone ? account?.phone : "Không có"}
            </div>
          </div>
        </div>

        {account?.role === "student" && (
          <>
            <Divider className="m-0" />

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-gray-800">
                  Mã số sinh viên
                </div>
                <div className="text-gray-800">
                  {profileModalData?.student?.studentId}
                </div>
              </div>
            </div>

            <Divider className="m-0" />

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-gray-800">Khoa</div>
                <div className="text-gray-800">
                  {profileModalData?.student?.faculty}
                </div>
              </div>
            </div>

            <Divider className="m-0" />

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-gray-800">
                  Chương trình đào tạo
                </div>
                <div className="text-gray-800">
                  {profileModalData?.student?.educationProgram}
                </div>
              </div>
            </div>
          </>
        )}

        {account?.role === "instructor" && (
          <>
            <Divider className="m-0" />

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-gray-800">
                  Mã số giảng viên
                </div>
                <div className="text-gray-800">
                  {profileModalData?.instructor?.instructorId}
                </div>
              </div>
            </div>

            <Divider className="m-0" />

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-gray-800">Khoa</div>
                <div className="text-gray-800">
                  {profileModalData?.instructor?.faculty}
                </div>
              </div>
            </div>

            <Divider className="m-0" />

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-gray-800">
                  Học hàm, học vị
                </div>
                <div className="text-gray-800">
                  {profileModalData?.instructor?.academicRank}
                </div>
              </div>
            </div>
          </>
        )}

        {account?.role === "technologyScience" && (
          <>
            <Divider className="m-0" />

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-gray-800">
                  Mã số phòng KHCN
                </div>
                <div className="text-gray-800">
                  {profileModalData?.technologyScience?.technologyScienceId}
                </div>
              </div>
            </div>
          </>
        )}

        {account?.role === "appraisal-board" && (
          <>
            <Divider className="m-0" />

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold text-gray-800">
                  Mã số cán bộ thẩm định
                </div>
                <div className="text-gray-800">
                  {profileModalData?.appraisalBoard?.appraisalBoardId}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
