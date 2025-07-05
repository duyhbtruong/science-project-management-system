import { Button, Form, Input, Select, Tooltip, Upload } from "antd";
import {
  LightbulbIcon,
  MinusCircleIcon,
  PlusIcon,
  UploadIcon,
  Users2Icon,
} from "lucide-react";
import { RESEARCH_TYPE } from "@/constant/research-types";

export const TopicInfoSection = ({ listFile, setListFile }) => {
  return (
    <>
      <Form.Item
        label="Tên đề tài (tiếng Việt)"
        name="vietnameseName"
        rules={[
          {
            required: true,
            message: "Tên đề tài không được để trống.",
          },
          {
            validator(_, value) {
              if (value !== value?.toUpperCase()) {
                return Promise.reject(
                  new Error("Tên đề tài phải là chữ in hoa.")
                );
              } else return Promise.resolve();
            },
          },
        ]}
      >
        <Input
          placeholder="Nhập tên tiếng Việt của đề tài..."
          prefix={<LightbulbIcon className="mr-1 text-border size-4" />}
          spellCheck={false}
        />
      </Form.Item>

      <Form.Item
        label="Tên đề tài (tiếng Anh)"
        name="englishName"
        rules={[
          {
            required: true,
            message: "Tên đề tài không được để trống.",
          },
          {
            validator(_, value) {
              if (value !== value?.toUpperCase()) {
                return Promise.reject(
                  new Error("Tên đề tài phải là chữ in hoa.")
                );
              } else return Promise.resolve();
            },
          },
        ]}
      >
        <Input
          placeholder="Nhập tên tiếng Anh của đề tài..."
          prefix={<LightbulbIcon className="mr-1 text-border size-4" />}
          spellCheck={false}
        />
      </Form.Item>

      <Form.Item
        label="Loại hình nghiên cứu"
        name="type"
        rules={[
          {
            required: true,
            message: "Không được để trống loại hình nghiên cứu.",
          },
        ]}
      >
        <Select
          placeholder="Chọn loại hình nghiên cứu..."
          options={RESEARCH_TYPE.map((type) => ({
            value: type,
            label: type,
          }))}
        />
      </Form.Item>

      <Form.Item
        label="Tóm tắt nội dung đề tài"
        name="summary"
        rules={[
          {
            required: true,
            message: "Không được để trống tóm tắt đề tài.",
          },
          {
            validator(_, value) {
              if (!value) return Promise.resolve();
              const wordCount = value.trim().split(/\s+/).length;
              if (wordCount > 300) {
                return Promise.reject(new Error("Không được dài quá 300 từ!"));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input.TextArea
          autoSize={{ minRows: 5 }}
          style={{ resize: "none" }}
          placeholder="Nhập tóm tắt nội dung đề tài..."
          spellCheck={false}
        />
      </Form.Item>

      <Form.List
        name="references"
        rules={[
          {
            validator: async (_, references) => {
              if (!references) {
                return Promise.reject(
                  new Error("Phải có ít nhất 1 tài liệu tham khảo chính.")
                );
              } else if (references.length > 5) {
                return Promise.reject(
                  new Error("Tối đa nhập 5 tài liệu tham khảo chính.")
                );
              }
            },
          },
        ]}
      >
        {(references, { add, remove }, { errors }) => (
          <>
            {references.map((reference, index) => {
              const { key, ...restProps } = reference;
              return (
                <Form.Item
                  label={index == 0 ? "Tài liệu tham khảo" : null}
                  required={true}
                  key={key}
                >
                  <div className="flex gap-2 items-center">
                    <Form.Item
                      {...restProps}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message:
                            "Nhập tài liệu tham khảo hoặc xóa trường này đi.",
                        },
                      ]}
                      noStyle
                    >
                      <Input
                        placeholder={`[${
                          index + 1
                        }] Nhập tài liệu tham khảo...`}
                        style={{
                          width: references.length < 2 ? "100%" : "95%",
                        }}
                        spellCheck={false}
                      />
                    </Form.Item>
                    {references.length > 1 && (
                      <MinusCircleIcon
                        className="flex-shrink-0 text-red-500 size-4 hover:cursor-pointer hover:text-red-700"
                        onClick={() => remove(reference.name)}
                      />
                    )}
                  </div>
                </Form.Item>
              );
            })}

            <Form.Item>
              <Button
                className="flex justify-center items-center w-full"
                type="dashed"
                onClick={() => add()}
                icon={<PlusIcon className="size-4" />}
              >
                Thêm tài liệu
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item
        label="Dự kiến kết quả"
        name="expectedResult"
        rules={[
          {
            required: true,
            message: "Không được để trống nội dung dự kiến kết quả.",
          },
          {
            validator(_, value) {
              if (!value) return Promise.resolve();
              const wordCount = value.trim().split(/\s+/).length;
              if (wordCount > 300) {
                return Promise.reject(new Error("Không được dài quá 300 từ!"));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input.TextArea
          placeholder="Nhập kết quả dự kiến của đề tài..."
          autoSize={{ minRows: 5 }}
          style={{ resize: "none" }}
          spellCheck={false}
        />
      </Form.Item>

      <Form.List
        name="participants"
        rules={[
          {
            validator: async (_, participants) => {
              if (!participants) {
                return Promise.reject(
                  new Error("Phải có ít nhất 1 thành viên tham gia")
                );
              } else if (participants.length > 3) {
                return Promise.reject(
                  new Error(
                    "Tối đa được 3 thành viên tham gia nghiên cứu đề tài."
                  )
                );
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => {
              const { key, ...restProps } = field;
              return (
                <Form.Item
                  label={
                    index == 0
                      ? "Danh sách thành viên đề tài (Kể cả CNĐT) - mỗi dòng một thành viên"
                      : null
                  }
                  required={true}
                  key={key}
                >
                  <div className="flex gap-2 items-center">
                    <Form.Item
                      {...restProps}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message:
                            "Nhập tên thành viên hoặc xóa dòng này nếu không cần thiết.",
                        },
                      ]}
                      noStyle
                    >
                      <Input
                        placeholder={`Nhập tên thành viên thứ ${index + 1}... `}
                        style={{
                          width: fields.length < 2 ? "100%" : "95%",
                        }}
                        prefix={
                          <Users2Icon className="mr-1 text-border size-4" />
                        }
                        spellCheck={false}
                      />
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleIcon
                        className="flex-shrink-0 text-red-500 size-4 hover:cursor-pointer hover:text-red-700"
                        onClick={() => remove(field.name)}
                      />
                    )}
                  </div>
                </Form.Item>
              );
            })}
            <Form.Item>
              <Button
                className="flex justify-center items-center w-full"
                type="dashed"
                onClick={() => add()}
                icon={<PlusIcon className="size-4" />}
              >
                Thêm thành viên
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item
        label="Hồ sơ đăng ký"
        name="registerFile"
        rules={[
          {
            required: true,
            validator: (_, value) => {
              if (!listFile || listFile.length === 0) {
                return Promise.reject(
                  new Error("Vui lòng tải lên hồ sơ đăng ký")
                );
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Upload
          className="w-full"
          accept=".pdf"
          maxCount={1}
          onChange={({ fileList }) => setListFile(fileList)}
          fileList={listFile}
        >
          <Tooltip title="Chỉ chấp nhận file PDF">
            <Button
              className="flex justify-center items-center w-full"
              icon={<UploadIcon className="size-4" />}
            >
              Nộp hồ sơ
            </Button>
          </Tooltip>
        </Upload>
      </Form.Item>
    </>
  );
};
