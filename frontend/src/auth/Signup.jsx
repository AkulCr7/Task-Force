import React, { useContext, useState } from "react";

import {
  Alert,
  Button,
  Form,
  Input,
  Switch,
  Typography,
  Upload,
  message,
} from "antd";

import {
  ArrowRightOutlined,
  CameraOutlined,
  KeyOutlined,
  LockOutlined,
  MailOutlined,
  MoonOutlined,
  SafetyCertificateOutlined,
  SunOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";

import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";

const { Text, Title, Link } = Typography;

export default function SignUp() {
  const [error, setError] = useState("");
  const { updateUser } = useContext(UserContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      let profileImageUrl = "";

      if (values.profilePic?.[0]?.originFileObj) {
        const formData = new FormData();
        formData.append("image", values.profilePic[0].originFileObj);

        const responseImage = await axiosInstance.post(
          API_PATHS.AUTH.UPLOAD_IMAGE,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        profileImageUrl = responseImage.data.imageUrl;
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.SIGNUP, {
        name: values.name,
        email: values.email,
        password: values.password,
        adminInviteToken: values.adminToken,
        profileImageUrl,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "member") {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  return (
    <section style={styles.page}>
      <div style={styles.bgOrbOne} />
      <div style={styles.bgOrbTwo} />

      <div style={styles.shell}>
        <div style={styles.formPanel}>
          <div style={styles.switchWrap}>
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
            />
          </div>

          <div style={styles.formHeader}>
            <div style={styles.logoBox}>
              <ThunderboltOutlined />
            </div>
            <Title style={styles.title}>Create account</Title>
            <Text style={styles.subtitle}>
              Join Task Force and start organizing work with a cleaner command
              center.
            </Text>
          </div>

          <Form
            name="task_force_signup"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
            style={styles.form}
          >
            <div style={styles.twoCol}>
              <Form.Item
                label="Full name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter your name.",
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<UserOutlined />}
                  placeholder="Your name"
                />
              </Form.Item>

              <Form.Item label="Admin token" name="adminToken">
                <Input
                  size="large"
                  prefix={<KeyOutlined />}
                  placeholder="Optional"
                />
              </Form.Item>
            </div>

            <Form.Item
              label="Email address"
              name="email"
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please enter a valid email.",
                },
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="john@example.com"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password.",
                },
                {
                  min: 8,
                  message: "Password must contain at least 8 characters.",
                },
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Minimum 8 characters"
              />
            </Form.Item>

            <Form.Item
              name="profilePic"
              label="Profile picture"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra="PNG/JPG only, max 2MB"
              rules={[
                { required: true, message: "Please upload a profile picture." },
              ]}
            >
              <Upload
                name="files"
                listType="picture-card"
                maxCount={1}
                showUploadList={{ showPreviewIcon: false, showRemoveIcon: true }}
                beforeUpload={(file) => {
                  const isImg = file.type.startsWith("image/");
                  if (!isImg) {
                    message.error("You can only upload image files.");
                  }

                  const isLt2M = file.size / 1024 / 1024 < 2;
                  if (!isLt2M) {
                    message.error("Image must be smaller than 2MB.");
                  }

                  return isImg && isLt2M ? false : Upload.LIST_IGNORE;
                }}
              >
                <div style={styles.uploadBox}>
                  <UploadOutlined />
                  <div>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                closable
                onClose={() => setError("")}
                style={styles.errorAlert}
              />
            )}

            <Button
              block
              size="large"
              type="primary"
              htmlType="submit"
              icon={<ArrowRightOutlined />}
              iconPosition="end"
            >
              Create Task Force account
            </Button>

            <div style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>{" "}
              <Link href="/login" style={styles.footerLink}>
                Sign in
              </Link>
            </div>
          </Form>
        </div>

        <div style={styles.brandPanel}>
          <div>
            <div className="tf-pill">
              <TeamOutlined />
              Team workspace
            </div>

            <Title style={styles.heroTitle}>
              Your new command room for every task.
            </Title>

            <Text style={styles.heroText}>
              Build teams, assign responsibilities, upload profiles, and manage
              tasks from a modern dark workspace.
            </Text>
          </div>

          <div style={styles.previewCard}>
            <div style={styles.previewTop}>
              <div>
                <strong>Today’s mission</strong>
                <span>Launch Task Force dashboard</span>
              </div>
              <CameraOutlined />
            </div>

            <div style={styles.progressTrack}>
              <div style={styles.progressFill} />
            </div>

            <div style={styles.previewGrid}>
              <div>
                <SafetyCertificateOutlined />
                <strong>Secure roles</strong>
                <span>Admin / Member</span>
              </div>
              <div>
                <ThunderboltOutlined />
                <strong>Fast actions</strong>
                <span>Create / Assign</span>
              </div>
            </div>
          </div>

          <div style={styles.brandFooter}>
            <span>Task Force</span>
            <span>•</span>
            <span>Built for execution</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  bgOrbOne: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: "50%",
    background: "rgba(168, 85, 247, 0.18)",
    filter: "blur(65px)",
    top: -100,
    left: -80,
  },
  bgOrbTwo: {
    position: "absolute",
    width: 430,
    height: 430,
    borderRadius: "50%",
    background: "rgba(56, 189, 248, 0.16)",
    filter: "blur(75px)",
    right: -130,
    bottom: -130,
  },
  shell: {
    width: "min(1120px, 100%)",
    minHeight: 720,
    display: "grid",
    gridTemplateColumns: "0.95fr 1.05fr",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: 32,
    overflow: "hidden",
    background: "rgba(15, 23, 42, 0.68)",
    boxShadow: "0 30px 100px rgba(0,0,0,0.42)",
    backdropFilter: "blur(22px)",
    position: "relative",
    zIndex: 1,
  },
  formPanel: {
    padding: 42,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "relative",
    background: "rgba(2, 6, 23, 0.36)",
  },
  switchWrap: {
    position: "absolute",
    top: 24,
    right: 24,
  },
  logoBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    display: "grid",
    placeItems: "center",
    color: "white",
    fontSize: 24,
    background: "linear-gradient(135deg, #38bdf8, #f97316)",
    boxShadow: "0 16px 36px rgba(56,189,248,0.25)",
    marginBottom: 18,
  },
  formHeader: {
    marginBottom: 26,
  },
  title: {
    color: "#f8fafc",
    margin: 0,
    fontSize: 38,
    letterSpacing: "-0.05em",
  },
  subtitle: {
    display: "block",
    color: "#94a3b8",
    marginTop: 8,
    fontSize: 15,
    lineHeight: 1.6,
  },
  form: {
    width: "100%",
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  },
  uploadBox: {
    color: "#cbd5e1",
  },
  errorAlert: {
    marginBottom: 18,
  },
  footer: {
    marginTop: 24,
    textAlign: "center",
  },
  footerText: {
    color: "#94a3b8",
  },
  footerLink: {
    color: "#38bdf8",
    fontWeight: 800,
  },
  brandPanel: {
    padding: 42,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background:
      "linear-gradient(135deg, rgba(56,189,248,0.16), rgba(168,85,247,0.12), rgba(249,115,22,0.12))",
    borderLeft: "1px solid rgba(148, 163, 184, 0.16)",
  },
  heroTitle: {
    color: "#f8fafc",
    fontSize: "clamp(38px, 5vw, 64px)",
    lineHeight: 1,
    marginTop: 22,
    marginBottom: 18,
    letterSpacing: "-0.06em",
  },
  heroText: {
    display: "block",
    color: "#cbd5e1",
    fontSize: 17,
    lineHeight: 1.7,
    maxWidth: 500,
  },
  previewCard: {
    padding: 24,
    borderRadius: 26,
    background: "rgba(15, 23, 42, 0.62)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
  },
  previewTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    color: "#e5e7eb",
    fontSize: 22,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    background: "rgba(148, 163, 184, 0.16)",
    overflow: "hidden",
    margin: "24px 0",
  },
  progressFill: {
    width: "72%",
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(135deg, #38bdf8, #f97316)",
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  },
  brandFooter: {
    color: "#94a3b8",
    display: "flex",
    gap: 10,
    fontSize: 13,
  },
};

const styleTag = document.createElement("style");
styleTag.innerHTML = `
@media (max-width: 900px) {
  section > div[style*="grid-template-columns"] {
    grid-template-columns: 1fr !important;
  }
}
@media (max-width: 640px) {
  div[style*="grid-template-columns: 1fr 1fr"] {
    grid-template-columns: 1fr !important;
  }
}
`;
if (!document.getElementById("task-force-signup-responsive")) {
  styleTag.id = "task-force-signup-responsive";
  document.head.appendChild(styleTag);
}