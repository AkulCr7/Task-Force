import { Card, Typography } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import DashboardLayout from "../components/DashboardLayout";
import TaskForm from "../components/TaskForm";

const { Text, Title } = Typography;

function CreateTask({ taskID }) {
  return (
    <DashboardLayout defaultActiveKey="create-task">
      <div style={styles.page}>
        <section style={styles.hero}>
          <div style={styles.icon}>
            <PlusCircleOutlined />
          </div>

          <div>
            <Text style={styles.kicker}>Mission builder</Text>
            <Title style={styles.title}>
              {taskID ? "Update mission" : "Create new mission"}
            </Title>
            <Text style={styles.subtitle}>
              Assign work, set priority, attach resources, and launch the next
              Task Force operation.
            </Text>
          </div>
        </section>

        <Card style={styles.card} styles={{ body: { padding: 24 } }}>
          <TaskForm taskID={taskID} />
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default CreateTask;

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
      "linear-gradient(135deg, rgba(56,189,248,0.14), rgba(249,115,22,0.12))",
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
    background: "linear-gradient(135deg, #38bdf8, #f97316)",
    boxShadow: "0 18px 42px rgba(56, 189, 248, 0.24)",
    flexShrink: 0,
  },
  kicker: {
    color: "#bae6fd",
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