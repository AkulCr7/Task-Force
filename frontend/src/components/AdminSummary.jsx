import { Card, Col, Progress, Row, Space, Typography } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FireOutlined,
  ThunderboltOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useContext, useMemo } from "react";

import { UserContext } from "../context/UserContext";

const { Text, Title } = Typography;

export default function AdminSummary({ dashboardData }) {
  const { user } = useContext(UserContext);

  const statsData = dashboardData?.statistics || {};

  const totalTasks = Number(statsData.totalTasks || 0);
  const completedTasks = Number(statsData.completedTasks || 0);
  const pendingTasks = Number(statsData.pendingTasks || 0);
  const inProgressTasks = Number(statsData.inProgressTasks || 0);
  const overdueTasks = Number(statsData.overdueTasks || 0);

  const completionRate = useMemo(() => {
    if (!totalTasks) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  }, [completedTasks, totalTasks]);

  const dateStr = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const stats = [
    {
      title: "Total Missions",
      value: totalTasks,
      icon: <UnorderedListOutlined />,
      gradient: "linear-gradient(135deg, #38bdf8, #0284c7)",
      glow: "rgba(56, 189, 248, 0.24)",
      sub: "All assigned tasks",
    },
    {
      title: "Pending",
      value: pendingTasks,
      icon: <ClockCircleOutlined />,
      gradient: "linear-gradient(135deg, #f97316, #ea580c)",
      glow: "rgba(249, 115, 22, 0.22)",
      sub: "Waiting for action",
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: <CheckCircleOutlined />,
      gradient: "linear-gradient(135deg, #22c55e, #16a34a)",
      glow: "rgba(34, 197, 94, 0.22)",
      sub: "Finished missions",
    },
    {
      title: "In Progress",
      value: inProgressTasks,
      icon: <ThunderboltOutlined />,
      gradient: "linear-gradient(135deg, #a855f7, #7c3aed)",
      glow: "rgba(168, 85, 247, 0.22)",
      sub: "Currently active",
    },
    {
      title: "Overdue",
      value: overdueTasks,
      icon: <ExclamationCircleOutlined />,
      gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
      glow: "rgba(239, 68, 68, 0.22)",
      sub: "Needs attention",
    },
  ];

  return (
    <section style={styles.wrap}>
      <div style={styles.header}>
        <div>
          <Text style={styles.kicker}>
            <FireOutlined /> Daily command brief
          </Text>

          <Title level={3} style={styles.title}>
            Mission overview
          </Title>

          <Text style={styles.subtitle}>
            {dateStr} • {user?.role === "admin" ? "Admin control room" : "Member dashboard"}
          </Text>
        </div>

        <div style={styles.progressCard}>
          <Progress
            type="circle"
            percent={completionRate}
            size={88}
            strokeColor={{
              "0%": "#38bdf8",
              "100%": "#f97316",
            }}
            trailColor="rgba(148, 163, 184, 0.16)"
            format={(percent) => (
              <span style={{ color: "#f8fafc", fontWeight: 950 }}>
                {percent}%
              </span>
            )}
          />

          <div>
            <Text style={styles.progressLabel}>Completion rate</Text>
            <Text style={styles.progressSub}>
              {completedTasks} of {totalTasks} missions completed
            </Text>
          </div>
        </div>
      </div>

      <Row gutter={[18, 18]}>
        {stats.map((item) => (
          <Col xs={24} sm={12} lg={8} xl={4.8} key={item.title}>
            <Card style={styles.statCard} styles={{ body: { padding: 18 } }}>
              <Space direction="vertical" size={14} style={{ width: "100%" }}>
                <div
                  style={{
                    ...styles.iconBox,
                    background: item.gradient,
                    boxShadow: `0 16px 36px ${item.glow}`,
                  }}
                >
                  {item.icon}
                </div>

                <div>
                  <Text style={styles.statTitle}>{item.title}</Text>
                  <div style={styles.statValue}>{item.value || 0}</div>
                  <Text style={styles.statSub}>{item.sub}</Text>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
}

const styles = {
  wrap: {
    display: "grid",
    gap: 18,
  },
  header: {
    padding: 24,
    borderRadius: 28,
    background: "rgba(15, 23, 42, 0.74)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    boxShadow: "0 18px 45px rgba(0,0,0,0.22)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 18,
    flexWrap: "wrap",
  },
  kicker: {
    color: "#bae6fd",
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontSize: 12,
    display: "inline-flex",
    gap: 8,
    alignItems: "center",
  },
  title: {
    color: "#f8fafc",
    margin: "8px 0 4px",
    letterSpacing: "-0.04em",
    fontSize: 30,
  },
  subtitle: {
    color: "#94a3b8",
  },
  progressCard: {
    minWidth: 260,
    padding: 14,
    borderRadius: 24,
    background:
      "linear-gradient(135deg, rgba(56,189,248,0.1), rgba(249,115,22,0.1))",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  progressLabel: {
    display: "block",
    color: "#f8fafc",
    fontWeight: 950,
    fontSize: 16,
  },
  progressSub: {
    display: "block",
    color: "#94a3b8",
    marginTop: 4,
    maxWidth: 140,
  },
  statCard: {
    height: "100%",
    overflow: "hidden",
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    display: "grid",
    placeItems: "center",
    color: "white",
    fontSize: 22,
  },
  statTitle: {
    display: "block",
    color: "#94a3b8",
    fontWeight: 800,
    fontSize: 13,
  },
  statValue: {
    color: "#f8fafc",
    fontSize: 34,
    lineHeight: 1,
    fontWeight: 950,
    margin: "8px 0",
    letterSpacing: "-0.05em",
  },
  statSub: {
    color: "#64748b",
    fontSize: 12,
  },
};