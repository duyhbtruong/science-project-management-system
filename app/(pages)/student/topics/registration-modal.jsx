import { Button, Modal } from "antd";
import { ArrowRightIcon } from "lucide-react";

export const RegistrationModal = ({ redirect, visible }) => {
  return (
    <Modal
      title="Đăng ký đề tài"
      open={visible}
      closable={false}
      footer={[
        <Button
          className="flex items-center justify-center"
          icon={<ArrowRightIcon className="size-4" />}
          key="link"
          type="primary"
          href={redirect}
        >
          Đến trang Quản lý đề tài cá nhân
        </Button>,
      ]}
    >
      <p>Bạn đã đăng ký đề tài Nghiên cứu khoa học!</p>
      <p>Vui lòng đến trang Quản lý đề tài cá nhân.</p>
    </Modal>
  );
};
