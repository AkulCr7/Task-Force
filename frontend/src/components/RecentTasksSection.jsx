import { Button, Card, Empty, Space, Table, Tag, Typography } from "antd";
import {
  ArrowRightOutlined,
  CalendarOutlined,
  FlagOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../context/UserContext";

const { Text, Title } = Typography;

const statusStyles = {
  Completed: {
    color: "#86efac",
    bg: "rgba(34, 197, 94, 0.12)",
    border: "rgba(34, 197, 94, 0.26)",
  },
  "In Progress": {
    color: "#93c5fd",
    bg: "rgba(59, 130, 246, 0.12)",
    border: "rgba(59, 130, 246, 0.26)",
  },
  Pending: {
    color: "#fed7aa",
    bg: "rgba(249, 115, 22, 0.12)",
    border: "rgba(249, 115, 22, 0.26)",
  },
  Overdue: {
    color: "#fecaca",
    bg: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.26)",
  },
};

const priorityStyles = {
  High: {
    color: "#fecaca",
    bg: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.26)",
  },
  Medium: {
    color: "#bae6fd",
    bg: "rgba(56, 189, 248, 0.12)",
    border: "rgba(56, 189, 248, 0.26)",
  },
  Low: {
    color: "#bbf7d0",
    bg: "rgba(34, 197, 94, 0.12)",
    border: "rgba(34, 197, 94, 0.26)",
  },
};

function SoftTag({ children, type = "status" }) {
  const map = type === "priority" ? priorityStyles : statusStyles;
  const style = map[children] || {
    color: "#e5e7eb",
    bg: "rgba(148, 163, 184, 0.12)",
    border: "rgba(148, 163, 184, 0.22)",
  };

  return (
    <Tag
      style={{
        color: style.color,
        background: style.bg,
        border: `1px solid ${style.border}`,
        fontWeight: 900,
        borderRadius: 999,
        padding: "4px 10px",
      }}
    >
      {children || "N/A"}
    </Tag>
  );
}

export default function RecentTasksSection({ dashboardData }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const data = dashboardData?.recentTasks?.slice(0, 6) || [];

  const columns = [
    {
      title: "Mission",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <Space size={10}>
          <span style={styles.taskIcon}>
            <UnorderedListOutlined />
          </span>
          <Text strong style={styles.taskName}>
            {text || "Untitled task"}
          </Text>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <SoftTag>{status}</SoftTag>,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => <SoftTag type="priority">{priority}</SoftTag>,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <Space size={8}>
          <CalendarOutlined style={{ color: "#38bdf8" }} />
          <Text style={styles.dateText}>
            {date
              ? new Date(date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A"}
          </Text>
        </Space>
      ),
    },
  ];

  const handleSeeAll = () => {
    if (user?.role === "admin") {
      navigate("/admin/tasks");
    } else {
      navigate("/user/tasks");
    }
  };

  return (
    <Card style={styles.card} styles={{ body: { padding: 24 } }}>
      <div style={styles.header}>
        <div>
          <Text style={styles.kicker}>
            <FlagOutlined /> Recent activity
          </Text>
          <Title level={4} style={styles.title}>
            Latest missions
          </Title>
          <Text style={styles.subtitle}>
            Review the newest tasks moving through your workspace.
          </Text>
        </div>

        <Button
          type="primary"
          icon={<ArrowRightOutlined />}
          iconPosition="end"
          onClick={handleSeeAll}
        >
          See all
        </Button>
      </div>

      {data.length > 0 ? (
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record) => record._id || record.id || record.title}
          pagination={false}
          size="middle"
          scroll={{ x: true }}
        />
      ) : (
        <Empty
          description={<span style={{ color: "#94a3b8" }}>No recent tasks</span>}
          style={{ padding: "34px 0" }}
        />
      )}
    </Card>
  );
}

const styles = {
  card: {
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 18,
    marginBottom: 22,
    flexWrap: "wrap",
  },
  kicker: {
    color: "#fed7aa",
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
  },
  subtitle: {
    color: "#94a3b8",
  },
  taskIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    color: "#bae6fd",
    background: "rgba(56, 189, 248, 0.12)",
    border: "1px solid rgba(56, 189, 248, 0.22)",
  },
  taskName: {
    color: "#f8fafc",
  },
  dateText: {
    color: "#cbd5e1",
  },
};