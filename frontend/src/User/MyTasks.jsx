import { useNavigate } from "react-router-dom";
import { Card, Typography } from "antd";
import { CheckSquareOutlined } from "@ant-design/icons";

import DashboardLayout from "../components/DashboardLayout";
import GenericTaskList from "../components/GenericTaskList";

const { Text, Title } = Typography;

export default function MyTasks() {
  const navigate = useNavigate();

  const handleClick = ({ _id }) => navigate(`/user/task-details/${_id}`);

  return (
    <DashboardLayout defaultActiveKey="my-tasks">
      <div style={styles.page}>
        <section style={styles.hero}>
          <div style={styles.icon}>
            <CheckSquareOutlined />
          </div>

          <div>
            <Text style={styles.kicker}>Personal mission queue</Text>
            <Title style={styles.title}>My Task Force assignments</Title>
            <Text style={styles.subtitle}>
              View your assigned work, check priority, and open each mission to
              update checklist progress.
            </Text>
          </div>
        </section>

        <Card style={styles.card} styles={{ body: { padding: 24 } }}>
          <GenericTaskList
            title="My Mission Queue"
            defaultActiveKey="All"
            onCardClick={handleClick}
            showDownload={false}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}

const styles = {
  page: {
    display: "grid",
    gap: 22,
  },
  hero: {
    padding: 26,
    borderRadius: 30,
    border: "1px solid rgba(148, 163, 184, 0.16)",
    background:
      "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(56,189,248,0.14), rgba(249,115,22,0.1))",
    boxShadow: "0 24px 70px rgba(0,0,0,0.24)",
    display: "flex",
    alignItems: "center",
    gap: 18,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    display: "grid",
    placeItems: "center",
    color: "#fff",
    fontSize: 30,
    background: "linear-gradient(135deg, #22c55e, #38bdf8)",
    boxShadow: "0 18px 42px rgba(34, 197, 94, 0.22)",
    flexShrink: 0,
  },
  kicker: {
    color: "#bbf7d0",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 950,
    fontSize: 12,
  },
  title: {
    color: "#f8fafc",
    margin: "6px 0 6px",
    fontSize: "clamp(28px, 4vw, 46px)",
    lineHeight: 1,
    letterSpacing: "-0.06em",
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: 15,
    lineHeight: 1.7,
  },
  card: {
    overflow: "hidden",
  },
};