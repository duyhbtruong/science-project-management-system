"use client";

import { useState, useEffect } from "react";
import {
  getFiles,
  searchFiles,
  deleteFile,
  uploadFile,
} from "@/service/uploadService";
import { getTopics } from "@/service/topicService";
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  App,
  Modal,
  Upload,
  Select,
  Form,
  message,
} from "antd";
import {
  SearchIcon,
  DownloadIcon,
  TrashIcon,
  EyeIcon,
  UploadIcon,
  PlusIcon,
} from "lucide-react";
import { dateFormat } from "@/utils/format";
import { useDebounce } from "@/hooks/use-debounce";

const { Search } = Input;
const { Option } = Select;

export default function FilesPage() {
  const [listFile, setListFile] = useState([]);
  const [listFileUpload, setListFileUpload] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [topics, setTopics] = useState([]);
  const [uploadForm] = Form.useForm();
  const { modal, message } = App.useApp();

  const loadFiles = async () => {
    setLoading(true);
    try {
      const res = await getFiles();
      setListFile(await res.json());
    } catch (error) {
      console.error("Error loading files:", error);
      message.error("Lỗi tải danh sách tệp tin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const res = await getTopics();
      const topicsData = await res.json();
      setTopics(topicsData);
    } catch (error) {
      console.error("Error loading topics:", error);
    }
  };

  const handleSearch = async (value) => {
    console.log(value);
    const res = await searchFiles(value);
    setListFile(await res.json());
  };

  const handleDelete = async (record) => {
    const confirmed = await modal.confirm({
      title: "Xóa tệp tin",
      content: `Bạn có chắc chắn muốn xóa tệp tin "${record.fileName}" không?`,
    });

    if (confirmed) {
      try {
        const res = await deleteFile(record.topicId._id, record.fileType);
        const result = await res.json();

        if (res.ok) {
          message.success("Xóa tệp tin thành công");
          loadFiles();
        } else {
          message.error(result.message || "Lỗi xóa tệp tin");
        }
      } catch (error) {
        message.error("Lỗi xóa tệp tin");
      }
    }
  };

  const getFileTypeLabel = (fileType) => {
    const typeLabels = {
      contract: "Quyết định",
      submit: "Hồ sơ nghiệm thu",
      register: "Hồ sơ đăng ký",
      payment: "Hợp đồng thanh toán",
    };
    return typeLabels[fileType] || fileType;
  };

  const getFileTypeColor = (fileType) => {
    const typeColors = {
      contract: "blue",
      submit: "green",
      register: "orange",
      payment: "purple",
    };
    return typeColors[fileType] || "default";
  };

  const handleUpload = async (values) => {
    setUploadLoading(true);
    try {
      const { file, topicId, fileType } = values;

      if (
        !file ||
        !file.fileList ||
        file.fileList.length === 0 ||
        !file.fileList[0].originFileObj
      ) {
        message.error("Vui lòng chọn file để tải lên");
        return;
      }

      const selectedTopic = topics.find((topic) => topic._id === topicId);
      if (!selectedTopic) {
        message.error("Không tìm thấy thông tin đề tài");
        return;
      }

      const selectedFile = file.fileList[0];
      const formData = new FormData();
      formData.append("file", selectedFile.originFileObj);
      formData.append("fileType", fileType);
      formData.append("fileName", selectedFile.name);
      formData.append("periodDir", selectedTopic.registrationPeriod.title);
      formData.append("studentId", selectedTopic.owner.studentId);

      const res = await uploadFile(topicId, formData);
      const result = await res.json();

      if (res.ok) {
        message.success("Tải lên file thành công");
        setIsUploadModalVisible(false);
        uploadForm.resetFields();
        loadFiles();
      } else {
        message.error(result.message || "Lỗi tải lên file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("Lỗi tải lên file");
    } finally {
      setUploadLoading(false);
    }
  };

  const uploadProps = {
    accept: ".pdf",
    maxCount: 1,
    beforeUpload: () => false,
    onChange: (info) => {
      if (info.fileList.length > 1) {
        info.fileList = [info.fileList[info.fileList.length - 1]];
      }
    },
  };

  const columns = [
    {
      title: "Tên tệp tin",
      dataIndex: "fileName",
      key: "fileName",
      width: "25%",
      render: (fileName, record) => (
        <div className="font-medium text-gray-900">{fileName}</div>
      ),
    },
    {
      title: "Đề tài",
      dataIndex: ["topicId", "vietnameseName"],
      key: "topicName",
      width: "20%",
      render: (name, record) => (
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-gray-500">
            {record.topicId?.englishName}
          </div>
        </div>
      ),
    },
    {
      title: "Loại tệp",
      dataIndex: "fileType",
      key: "fileType",
      width: "12%",
      render: (fileType) => (
        <Tag color={getFileTypeColor(fileType)}>
          {getFileTypeLabel(fileType)}
        </Tag>
      ),
    },
    {
      title: "Người tải lên",
      dataIndex: ["uploadedBy", "name"],
      key: "uploadedBy",
      width: "15%",
      ellipsis: true,
      render: (name, record) => (
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-gray-500">
            {record.uploadedBy?.email}
          </div>
        </div>
      ),
    },
    {
      title: "Ngày tải lên",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "12%",
      render: (date) => (
        <span className="text-gray-600">{dateFormat(new Date(date))}</span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: "16%",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeIcon className="size-4" />}
            onClick={() => window.open(record.fileUrl, "_blank")}
            title="Xem tệp tin"
          />
          <Button
            icon={<DownloadIcon className="size-4" />}
            onClick={() => {
              const link = document.createElement("a");
              link.href = record.fileUrl;
              link.download = record.fileName;
              link.click();
            }}
            title="Tải xuống"
          />
          <Button
            danger
            icon={<TrashIcon className="size-4" />}
            onClick={() => handleDelete(record)}
            title="Xóa tệp tin"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col py-6 mx-32">
        <div className="mb-6">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Quản lý tệp tin
          </h1>
          <div className="flex justify-between items-center">
            <Search
              placeholder="Tìm kiếm tệp tin..."
              allowClear
              enterButton={
                <Button type="primary" icon={<SearchIcon className="size-4" />}>
                  Tìm kiếm
                </Button>
              }
              className="w-96"
              onSearch={handleSearch}
              onChange={(e) => {
                if (e.target.value === "") {
                  loadFiles();
                }
              }}
            />
            <div className="flex gap-4 items-center">
              <div className="text-sm text-gray-500">
                Tổng số: {listFile.length} tệp tin
              </div>
              <Button
                type="primary"
                icon={<PlusIcon className="size-4" />}
                onClick={() => setIsUploadModalVisible(true)}
              >
                Tải lên tệp tin
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table
            rowKey={(record) => record._id}
            tableLayout="fixed"
            columns={columns}
            dataSource={listFile}
            loading={loading}
          />
        </div>
      </div>

      <Modal
        title="Tải lên tệp tin"
        open={isUploadModalVisible}
        onCancel={() => {
          setIsUploadModalVisible(false);
          uploadForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={uploadForm} layout="vertical" onFinish={handleUpload}>
          <Form.Item
            label="Chọn đề tài"
            name="topicId"
            rules={[{ required: true, message: "Vui lòng chọn đề tài" }]}
          >
            <Select
              placeholder="Chọn đề tài"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {topics.map((topic) => (
                <Option key={topic._id} value={topic._id}>
                  {topic.vietnameseName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Loại tệp"
            name="fileType"
            rules={[{ required: true, message: "Vui lòng chọn loại tệp" }]}
          >
            <Select placeholder="Chọn loại tệp">
              <Option value="contract">Quyết định</Option>
              <Option value="submit">Hồ sơ nghiệm thu</Option>
              <Option value="register">Hồ sơ đăng ký</Option>
              <Option value="payment">Hợp đồng thanh toán</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Tệp tin"
            name="file"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn tệp tin",
              },
            ]}
          >
            <Upload.Dragger
              {...uploadProps}
              maxCount={1}
              fileList={listFileUpload}
              onChange={({ fileList }) => setListFileUpload(fileList)}
            >
              <p className="ant-upload-drag-icon">
                <UploadIcon className="text-gray-400 size-8" />
              </p>
              <p className="ant-upload-text">
                Nhấp hoặc kéo thả tệp vào đây để tải lên
              </p>
              <p className="ant-upload-hint">
                Chỉ hỗ trợ tệp PDF. Kích thước tối đa 10MB.
              </p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => {
                  setIsUploadModalVisible(false);
                  uploadForm.resetFields();
                }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={uploadLoading}>
                Tải lên
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
