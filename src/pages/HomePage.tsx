import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Table,
  Tag,
  Button,
  Modal,
  Space,
  List,
  Divider,
} from "antd";
import {
  EnvironmentOutlined,
  BankOutlined,
  FileTextOutlined,
  SafetyCertificateFilled,
  CheckCircleFilled,
  RightCircleOutlined,
  UserOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { fetchJobs } from "../services/api";
import { Job } from "../types/Job";

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const HomePage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [isContactModalVisible, setIsContactModalVisible] =
    useState<boolean>(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await fetchJobs();
      setJobs(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách JD:", error);
    } finally {
      setLoading(false);
    }
  };

  const showJobDetail = (job: Job) => {
    setSelectedJob(job);
    setIsModalVisible(true);
  };

  const handleApplyClick = () => {
    setIsModalVisible(false);
    setIsContactModalVisible(true);
  };

  const columns = [
    {
      title: "VỊ TRÍ TUYỂN DỤNG",
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
        <Text style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "PHÒNG BAN",
      dataIndex: "department",
      key: "department",
      render: (dept: string) => (
        <Space>
          <BankOutlined style={{ color: "#94a3b8" }} />
          <Text style={{ color: "#64748b", fontWeight: 500 }}>{dept}</Text>
        </Space>
      ),
    },
    {
      title: "ĐỊA ĐIỂM",
      dataIndex: "location",
      key: "location",
      render: (loc: string) => (
        <Space>
          <EnvironmentOutlined style={{ color: "#00A859" }} />
          <Text style={{ fontWeight: 500 }}>{loc}</Text>
        </Space>
      ),
    },
    {
      title: "LOẠI HÌNH",
      key: "type",
      dataIndex: "type",
      render: (type: string) => <Tag color="success">{type}</Tag>,
    },
    {
      title: "",
      key: "action",
      align: "right" as const,
      render: (_: any, record: Job) => (
        <Button
          className="btn-manulife"
          icon={<FileTextOutlined />}
          onClick={() => showJobDetail(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <Space
          size="small"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SafetyCertificateFilled
            style={{
              fontSize: "32px",
              color: "#00A859",
              display: "flex",
              alignItems: "center",
            }}
          />
          <Title level={3} className="logo-text">
            Manulife Careers
          </Title>
        </Space>
      </Header>

      <div className="hero-banner">
        <div className="hero-content">
          <h1>Khám phá tiềm năng của bạn</h1>
          <p>
            Tham gia cùng chúng tôi để xây dựng một tương lai tài chính vững
            chắc và mang lại cuộc sống tốt đẹp hơn cho hàng triệu gia đình Việt
            Nam.
          </p>
        </div>
      </div>

      <Content className="main-content">
        <div className="content-card">
          <div className="content-header">
            <div>
              <Title
                level={2}
                style={{ margin: 0, fontWeight: 800, color: "#1e293b" }}
              >
                Cơ hội nghề nghiệp
              </Title>
              <Text style={{ color: "#64748b", fontSize: "15px" }}>
                Khám phá các vị trí đang mở tuyển mới nhất tại Manulife.
              </Text>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={jobs}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 5, position: ["bottomCenter"] }}
            scroll={{ x: 800 }}
          />
        </div>
      </Content>

      <Footer
        style={{
          textAlign: "center",
          color: "#94a3b8",
          background: "transparent",
          paddingBottom: "40px",
          fontWeight: 500,
        }}
      >
        Manulife Vietnam Careers ©{new Date().getFullYear()}.
      </Footer>

      {/* Modal chi tiết JD */}
      <Modal
        wrapClassName="job-modal"
        title={<span className="modal-title">{selectedJob?.title}</span>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button
            key="close"
            type="text"
            onClick={() => setIsModalVisible(false)}
            style={{ fontWeight: 600, color: "#64748b" }}
          >
            Đóng
          </Button>,
          <Button
            key="apply"
            className="btn-manulife"
            icon={<RightCircleOutlined />}
            onClick={handleApplyClick}
          >
            Ứng tuyển ngay
          </Button>,
        ]}
        width={850}
        centered
        closeIcon={
          <div
            style={{
              background: "#f1f5f9",
              borderRadius: "50%",
              padding: "4px 8px",
              color: "#64748b",
            }}
          >
            ✕
          </div>
        }
      >
        {selectedJob && (
          <div style={{ marginTop: 24 }}>
            <Space
              direction="horizontal"
              size="middle"
              wrap
              style={{
                marginBottom: 24,
                padding: "12px 16px",
                background: "#f8fafc",
                borderRadius: "12px",
              }}
            >
              <Space>
                <BankOutlined style={{ color: "#00A859", fontSize: "18px" }} />
                <Text strong style={{ color: "#334155" }}>
                  {selectedJob.department}
                </Text>
              </Space>
              <Divider type="vertical" style={{ borderColor: "#cbd5e1" }} />
              <Tag color="success" style={{ margin: 0 }}>
                {selectedJob.type}
              </Tag>
            </Space>

            <Space>
              <EnvironmentOutlined
                style={{ color: "#00A859", fontSize: "18px" }}
              />
              <Text style={{ color: "#334155" }}>{selectedJob.location}</Text>
            </Space>

            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div>
                <Title level={5} style={{ fontWeight: 700 }}>
                  Quyền lợi hấp dẫn
                </Title>
                <List
                  size="small"
                  dataSource={selectedJob.benefits || []}
                  renderItem={(item) => (
                    <List.Item style={{ border: "none", padding: "8px 0" }}>
                      <Space align="start">
                        <CheckCircleFilled
                          style={{
                            color: "#00A859",
                            fontSize: "16px",
                            marginTop: "2px",
                          }}
                        />
                        <Text className="benefit-item">{item}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </div>

              <div>
                <Title level={5} style={{ fontWeight: 700 }}>
                  Yêu cầu công việc
                </Title>
                <List
                  size="small"
                  dataSource={selectedJob.requirements || []}
                  renderItem={(item) => (
                    <List.Item style={{ border: "none", padding: "6px 0" }}>
                      <Text style={{ color: "#374559", fontSize: "15px" }}>
                        <span style={{ color: "#00A859", marginRight: "8px" }}>
                          •
                        </span>
                        {item}
                      </Text>
                    </List.Item>
                  )}
                />
              </div>
              <div className="job-detail-box">
                <Title
                  level={5}
                  style={{ color: "#007a41", fontWeight: 700, marginTop: 0 }}
                >
                  Mô tả công việc
                </Title>
                <List
                  size="small"
                  dataSource={selectedJob.descriptions || []}
                  renderItem={(item) => (
                    <List.Item style={{ border: "none", padding: "6px 0" }}>
                      <Text style={{ color: "#334155", fontSize: "15px" }}>
                        <span style={{ color: "#00A859", marginRight: "8px" }}>
                          •
                        </span>
                        {item}
                      </Text>
                    </List.Item>
                  )}
                />
              </div>
            </Space>
          </div>
        )}
      </Modal>

      {/* Modal Thông tin liên hệ ứng tuyển */}
      {/* Modal Thông tin liên hệ ứng tuyển */}
      <Modal
        title={
          <span style={{ fontSize: "20px", fontWeight: 800, color: "#1e293b" }}>
            Thông tin ứng tuyển
          </span>
        }
        open={isContactModalVisible}
        onCancel={() => setIsContactModalVisible(false)}
        footer={[
          <Button
            key="close"
            onClick={() => setIsContactModalVisible(false)}
            style={{ fontWeight: 600 }}
          >
            Đóng
          </Button>,
          <Button
            key="email"
            className="btn-manulife"
            // Thay đổi href tại đây để tự động điền Subject
            href={`mailto:phuong_ob708@manulife.com.vn?subject=Ứng+tuyển+vị+trí+${encodeURIComponent(selectedJob?.title || "")}`}
          >
            Gửi Email Ngay
          </Button>,
        ]}
        centered
        width={500}
      >
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            background: "#f8fafc",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
          }}
        >
          <Paragraph
            style={{ fontSize: "15px", color: "#475569", marginBottom: "24px" }}
          >
            Cảm ơn bạn đã quan tâm đến vị trí{" "}
            <strong>{selectedJob?.title}</strong> tại Manulife. Vui lòng gửi CV
            hoặc liên hệ trực tiếp với bộ phận tuyển dụng qua thông tin bên
            dưới:
          </Paragraph>

          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Space align="center">
              <div
                style={{
                  background: "#e6f6ed",
                  padding: "10px",
                  borderRadius: "8px",
                  color: "#00a859",
                }}
              >
                <UserOutlined style={{ fontSize: "20px" }} />
              </div>
              <div>
                <Text
                  type="secondary"
                  style={{ display: "block", fontSize: "13px" }}
                >
                  Người liên hệ
                </Text>
                <Text strong style={{ fontSize: "16px", color: "#1e293b" }}>
                  Chị Đào Minh Phương
                </Text>
              </div>
            </Space>

            <Space align="center">
              <div
                style={{
                  background: "#e6f6ed",
                  padding: "10px",
                  borderRadius: "8px",
                  color: "#00a859",
                }}
              >
                <MailOutlined style={{ fontSize: "20px" }} />
              </div>
              <div>
                <Text
                  type="secondary"
                  style={{ display: "block", fontSize: "13px" }}
                >
                  Email tuyển dụng
                </Text>
                <Text
                  strong
                  copyable
                  style={{ fontSize: "16px", color: "#007a41" }}
                >
                  phuong_ob708@manulife.com.vn
                </Text>
              </div>
            </Space>
          </Space>
        </div>
      </Modal>
    </Layout>
  );
};

export default HomePage;
