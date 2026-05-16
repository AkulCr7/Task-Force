import { useNavigate } from "react-router-dom";
import { Button, Card, Typography, message } from "antd";
import {
  DownloadOutlined,
  RocketOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

import DashboardLayout from "../components/DashboardLayout";
import GenericTaskList from "../components/GenericTaskList";
import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";

const { Text, Title } = Typography;

export default function ManageTask() {
  const navigate = useNavigate();

  const handleClick = (task) =>
    navigate("/admin/create-task", {
      state: { taskID: task._id, isUpdate: true },
    });

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_TASKS, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "task_force_missions.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success("Mission report downloaded");
    } catch (error) {
      console.error("Error downloading task details:", error);
      message.error("Could not download mission report");
    }
  };

  return (
    <DashboardLayout defaultActiveKey="manage-tasks">
      <div style={styles.page}>
        <section style={styles.hero}>
          <div>
            <Text style={styles.kicker}>
              <RocketOutlined /> Admin mission board
            </Text>

            <Title style={styles.title}>Manage Task Force missions</Title>

            <Text style={styles.subtitle}>
              Track every assignment, open missions for editing, and export the
              complete task report when needed.
            </Text>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
          >
            Export report
          </Button>
        </section>

        <Card style={styles.card} styles={{ body: { padding: 24 } }}>
          <GenericTaskList
            title="Mission Directory"
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
    padding: 28,
    borderRadius: 30,
    border: "1px solid rgba(148, 163, 184, 0.16)",
    background:
      "linear-gradient(135deg, rgba(56,189,248,0.14), rgba(168,85,247,0.1), rgba(249,115,22,0.12))",
    boxShadow: "0 24px 70px rgba(0,0,0,0.24)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
    flexWrap: "wrap",
  },
  kicker: {
    color: "#fed7aa",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 950,
    fontSize: 12,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  title: {
    color: "#f8fafc",
    margin: "10px 0 8px",
    fontSize: "clamp(28px, 4vw, 48px)",
    lineHeight: 1,
    letterSpacing: "-0.06em",
  },
  subtitle: {
    display: "block",
    color: "#cbd5e1",
    maxWidth: 720,
    fontSize: 15,
    lineHeight: 1.7,
  },
  card: {
    overflow: "hidden",
  },
};