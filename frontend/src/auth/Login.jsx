import {
  Alert,
  Button,
  Form,
  Input,
  Switch,
  Typography,
} from "antd";

import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  LockOutlined,
  MailOutlined,
  MoonOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  SunOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

import { useContext, useState } from "react";
import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";

const { Text, Title, Link } = Typography;

export default function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { updateUser } = useContext(UserContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const onFinish = async (values) => {
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, values);
      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "member") {
          navigate("/user/dashboard");
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <section style={styles.page}>
      <div style={styles.bgOrbOne} />
      <div style={styles.bgOrbTwo} />

      <div style={styles.shell}>
        <div style={styles.brandPanel}>
          <div style={styles.brandTop}>
            <div style={styles.logoBox}>
              <ThunderboltOutlined />
            </div>
            <div>
              <div style={styles.brandName}>Task Force</div>
              <div style={styles.brandSub}>Command center for focused teams</div>
            </div>
          </div>

          <div style={styles.heroContent}>
            <div className="tf-pill">
              <RocketOutlined />
              Mission control
            </div>

            <Title style={styles.heroTitle}>
              Plan faster. Assign smarter. Execute with clarity.
            </Title>

            <Text style={styles.heroText}>
              A redesigned workspace for task ownership, team visibility, and
              clean daily execution.
            </Text>

            <div style={styles.featureGrid}>
              <div style={styles.featureCard}>
                <CheckCircleOutlined style={styles.featureIcon} />
                <div>
                  <strong>Track progress</strong>
                  <span>See what is pending, active, and complete.</span>
                </div>
              </div>

              <div style={styles.featureCard}>
                <SafetyCertificateOutlined style={styles.featureIcon} />
                <div>
                  <strong>Role based access</strong>
                  <span>Separate admin and member workspaces.</span>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.brandFooter}>
            <span>Built for productivity</span>
            <span>•</span>
            <span>Task Force v2</span>
          </div>
        </div>

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
            <div style={styles.mobileLogo}>
              <ThunderboltOutlined />
            </div>
            <Title style={styles.title}>Welcome back</Title>
            <Text style={styles.subtitle}>
              Sign in to continue managing your missions.
            </Text>
          </div>

          <Form
            name="task_force_login"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
            style={styles.form}
          >
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
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Enter password"
              />
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
              style={styles.submitBtn}
            >
              Log in
            </Button>

            <div style={styles.footer}>
              <Text style={styles.footerText}>New to Task Force?</Text>{" "}
              <Link href="/signup" style={styles.footerLink}>
                Create account
              </Link>
            </div>
          </Form>
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
    background: "rgba(56, 189, 248, 0.18)",
    filter: "blur(60px)",
    top: -80,
    left: -80,
  },
  bgOrbTwo: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: "50%",
    background: "rgba(249, 115, 22, 0.14)",
    filter: "blur(70px)",
    right: -120,
    bottom: -120,
  },
  shell: {
    width: "min(1120px, 100%)",
    minHeight: 680,
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    borderRadius: 32,
    overflow: "hidden",
    background: "rgba(15, 23, 42, 0.68)",
    boxShadow: "0 30px 100px rgba(0,0,0,0.42)",
    backdropFilter: "blur(22px)",
    position: "relative",
    zIndex: 1,
  },
  brandPanel: {
    padding: 42,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background:
      "linear-gradient(135deg, rgba(56,189,248,0.16), rgba(168,85,247,0.12), rgba(249,115,22,0.12))",
    borderRight: "1px solid rgba(148, 163, 184, 0.16)",
  },
  brandTop: {
    display: "flex",
    alignItems: "center",
    gap: 14,
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
  },
  brandName: {
    fontSize: 22,
    fontWeight: 900,
    color: "#f8fafc",
    letterSpacing: "-0.03em",
  },
  brandSub: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 2,
  },
  heroContent: {
    maxWidth: 540,
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
    maxWidth: 480,
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
    marginTop: 34,
  },
  featureCard: {
    padding: 18,
    borderRadius: 20,
    background: "rgba(15, 23, 42, 0.58)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    display: "flex",
    gap: 12,
    alignItems: "flex-start",
    color: "#e5e7eb",
  },
  featureIcon: {
    color: "#38bdf8",
    fontSize: 20,
    marginTop: 2,
  },
  brandFooter: {
    color: "#94a3b8",
    display: "flex",
    gap: 10,
    fontSize: 13,
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
  formHeader: {
    marginBottom: 30,
  },
  mobileLogo: {
    width: 46,
    height: 46,
    borderRadius: 15,
    display: "grid",
    placeItems: "center",
    color: "white",
    fontSize: 22,
    background: "linear-gradient(135deg, #38bdf8, #f97316)",
    marginBottom: 18,
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
  },
  form: {
    width: "100%",
  },
  errorAlert: {
    marginBottom: 18,
  },
  submitBtn: {
    marginTop: 4,
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
};

const styleTag = document.createElement("style");
styleTag.innerHTML = `
@media (max-width: 900px) {
  section > div[style*="grid-template-columns"] {
    grid-template-columns: 1fr !important;
  }
}
`;
if (!document.getElementById("task-force-login-responsive")) {
  styleTag.id = "task-force-login-responsive";
  document.head.appendChild(styleTag);
}