import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Row,
  Skeleton,
  Space,
  Typography,
} from "antd";
import {
  ReloadOutlined,
  RocketOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

import { UserContext } from "../context/UserContext";
import DashboardLayout from "../components/DashboardLayout";
import axiosInstance from "../utils/axiosConfig";
import AdminSummary from "../components/AdminSummary";
import RecentTasksSection from "../components/RecentTasksSection";
import TaskCharts from "../components/TaskCharts";

const { Text, Title } = Typography;

function Dashboard({ path }) {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState("");

  const getDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get(path);
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      setError("Could not load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    getDashboardData();
  }, [getDashboardData]);

  const displayName = useMemo(() => {
    return user?.name || user?.fullName || user?.email?.split("@")?.[0] || "Commander";
  }, [user]);

  const roleLabel = useMemo(() => {
    if (user?.role === "admin") return "Admin command";
    if (user?.role === "member") return "Member workspace";
    return "Task workspace";
  }, [user]);

  return (
    <DashboardLayout defaultActiveKey="dashboard">
      <div style={styles.page}>
        <section style={styles.hero}>
          <div>
            <div className="tf-pill">
              <RocketOutlined />
              {roleLabel}
            </div>

            <Title style={styles.heroTitle}>
              Welcome back, <span className="tf-gradient-text">{displayName}</span>
            </Title>

            <Text style={styles.heroText}>
              Your Task Force command center is ready. Review progress, monitor
              workload, and move the next mission forward.
            </Text>
          </div>

          <div style={styles.heroActions}>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={getDashboardData}
              loading={loading}
            >
              Refresh
            </Button>

            <div style={styles.statusBadge}>
              <ThunderboltOutlined />
              Live workspace
            </div>
          </div>
        </section>

        {error && (
          <Alert
            type="error"
            showIcon
            closable
            message={error}
            onClose={() => setError("")}
            style={styles.alert}
          />
        )}

        {loading ? (
          <Row gutter={[20, 20]}>
            {[1, 2, 3, 4].map((item) => (
              <Col xs={24} sm={12} lg={6} key={item}>
                <Card>
                  <Skeleton active paragraph={{ rows: 2 }} />
                </Card>
              </Col>
            ))}
            <Col xs={24}>
              <Card>
                <Skeleton active paragraph={{ rows: 6 }} />
              </Card>
            </Col>
          </Row>
        ) : (
          <Space direction="vertical" size={22} style={{ width: "100%" }}>
            <AdminSummary dashboardData={dashboardData} />
            <RecentTasksSection dashboardData={dashboardData} />
            <TaskCharts data={dashboardData?.charts} />
          </Space>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;

const styles = {
  page: {
    width: "100%",
  },
  hero: {
    marginBottom: 24,
    padding: 28,
    borderRadius: 30,
    border: "1px solid rgba(148, 163, 184, 0.18)",
    background:
      "linear-gradient(135deg, rgba(56,189,248,0.14), rgba(168,85,247,0.1), rgba(249,115,22,0.12))",
    boxShadow: "0 24px 70px rgba(0,0,0,0.26)",
    display: "flex",
    justifyContent: "space-between",
    gap: 24,
    alignItems: "flex-end",
    overflow: "hidden",
    position: "relative",
  },
  heroTitle: {
    color: "#f8fafc",
    marginTop: 18,
    marginBottom: 10,
    fontSize: "clamp(30px, 4vw, 52px)",
    lineHeight: 1,
    letterSpacing: "-0.06em",
  },
  heroText: {
    display: "block",
    maxWidth: 720,
    color: "#cbd5e1",
    fontSize: 16,
    lineHeight: 1.7,
  },
  heroActions: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  statusBadge: {
    height: 42,
    borderRadius: 999,
    padding: "0 16px",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    color: "#fed7aa",
    background: "rgba(249, 115, 22, 0.12)",
    border: "1px solid rgba(249, 115, 22, 0.24)",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },
  alert: {
    marginBottom: 20,
  },
};