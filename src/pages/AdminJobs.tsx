// src/pages/AdminJobs.tsx
import React, { useEffect, useState } from "react";
import {
  Layout,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Popconfirm,
  message,
  Typography,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { fetchJobs, createJob, updateJob, deleteJob } from "../services/api";
import { Job } from "../types/Job";

const { Header, Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

const AdminJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchJobs();
      setJobs(data);
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (job?: Job) => {
    setEditingJob(job || null);
    if (job) {
      // Convert arrays back to multi-line strings for the TextArea
      form.setFieldsValue({
        ...job,
        descriptions: job.descriptions ? job.descriptions.join("\n") : "",
        requirements: job.requirements ? job.requirements.join("\n") : "",
        benefits: job.benefits ? job.benefits.join("\n") : "",
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      // Helper function to split text area string into an array, removing empty lines
      const textToArray = (text?: string) => {
        if (!text) return [];
        return text
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0);
      };

      // Format the values before sending to Firebase
      const formattedValues = {
        ...values,
        descriptions: textToArray(values.descriptions),
        requirements: textToArray(values.requirements),
        benefits: textToArray(values.benefits),
      };

      if (editingJob) {
        await updateJob(editingJob.id, formattedValues);
        message.success("Cập nhật Job thành công!");
      } else {
        await createJob(formattedValues);
        message.success("Thêm Job mới thành công!");
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteJob(id);
      message.success("Đã xóa Job!");
      loadData();
    } catch (error) {
      message.error("Lỗi khi xóa Job.");
    }
  };

  const columns = [
    { title: "Vị trí", dataIndex: "title", key: "title" },
    { title: "Phòng ban", dataIndex: "department", key: "department" },
    { title: "Loại hình", dataIndex: "type", key: "type" },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: Job) => (
        <Space size="middle">
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#00a859",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title level={4} style={{ color: "white", margin: 0 }}>
          Quản trị Tuyển dụng Manulife
        </Title>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/")}>
          Xem Website
        </Button>
      </Header>

      <Content style={{ padding: "50px" }}>
        <div style={{ background: "white", padding: 24, borderRadius: 8 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Title level={3} style={{ margin: 0 }}>
              Danh sách Job
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openModal()}
              style={{ background: "#00a859" }}
            >
              Thêm Job mới
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={jobs}
            rowKey="id"
            loading={loading}
          />
        </div>
      </Content>

      <Modal
        title={editingJob ? "Chỉnh sửa Job" : "Thêm Job mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu lại"
        cancelText="Hủy"
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="title"
            label="Tiêu đề Job"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input placeholder="VD: Chuyên viên tư vấn..." />
          </Form.Item>

          <Space style={{ display: "flex", marginBottom: 8 }} align="baseline">
            <Form.Item
              name="department"
              label="Phòng ban"
              rules={[{ required: true }]}
            >
              <Input placeholder="Kinh doanh" />
            </Form.Item>
            <Form.Item
              name="location"
              label="Địa điểm"
              rules={[{ required: true }]}
            >
              <Input placeholder="TP.HCM" />
            </Form.Item>
            <Form.Item
              name="type"
              label="Loại hình"
              rules={[{ required: true }]}
            >
              <Select
                defaultValue="Linh hoạt"
                options={[
                  { value: "Linh hoạt", label: "Linh hoạt" },
                  { value: "Toàn thời gian", label: "Toàn thời gian" },
                ]}
              />
            </Form.Item>
          </Space>

          <Form.Item
            name="benefits"
            label="Quyền lợi (Mỗi dòng một mục)"
            rules={[{ required: true, message: "Vui lòng nhập quyền lợi" }]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập quyền lợi...&#10;Nhấn Enter để xuống dòng cho mục tiếp theo"
            />
          </Form.Item>

          <Form.Item
            name="requirements"
            label="Yêu cầu công việc (Mỗi dòng một mục)"
            rules={[{ required: true, message: "Vui lòng nhập yêu cầu" }]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập yêu cầu công việc...&#10;Nhấn Enter để xuống dòng cho mục tiếp theo"
            />
          </Form.Item>

          <Form.Item
            name="descriptions"
            label="Mô tả công việc (Mỗi dòng một mục)"
            rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập mô tả công việc...&#10;Nhấn Enter để xuống dòng cho mục tiếp theo"
            />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default AdminJobs;
