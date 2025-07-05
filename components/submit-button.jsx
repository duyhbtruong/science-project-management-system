import { useState, useEffect } from "react";
import { Button, Form } from "antd";

export const SubmitButton = ({ form, loading, children }) => {
  const [submittable, setSubmittable] = useState(false);

  const values = Form.useWatch([], form);

  useEffect(() => {
    const validateForm = async () => {
      try {
        await form.validateFields({ validateOnly: true });
        setSubmittable(true);
      } catch {
        setSubmittable(false);
      }
    };

    const timeoutId = setTimeout(() => {
      validateForm();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [form, values]);

  return (
    <Button
      type="primary"
      htmlType="submit"
      disabled={!submittable}
      block
      loading={loading}
    >
      {children}
    </Button>
  );
};
