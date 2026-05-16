import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  List,
  Progress,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  LinkOutlined,
  PaperClipOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";

import DashboardLayout from "../components/DashboardLayout";
import Loading from "../components/Loading";
import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";

const { Title, Text, Paragraph } = Typography;

const getSecureImageUrl = (url) => url?.replace(/^http:\/\//, "https://");

const statusMap = {
  Completed: {
    icon: <CheckCircleOutlined />,
    color: "#86efac",
    bg: "rgba(34, 197, 94, 0.12)",
    border: "rgba(34, 197, 94, 0.26)",
  },
  "In Progress": {
    icon: <ThunderboltOutlined />,
    color: "#93c5fd",
    bg: "rgba(59, 130, 246, 0.12)",
    border: "rgba(59, 130, 246, 0.26)",
  },
  Pending: {
    icon: <ClockCircleOutlined />,
    color: "#fed7aa",
    bg: "rgba(249, 115, 22, 0.12)",
    border: "rgba(249, 115, 22, 0.26)",
  },
  Overdue: {
    icon: <ExclamationCircleOutlined />,
    color: "#fecaca",
    bg: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.26)",
  },
};

const priorityMap = {
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

function SoftTag({ value, map }) {
  const style = map[value] || {
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
        borderRadius: 999,
        padding: "6px 12px",
        fontWeight: 950,
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
      }}
    >
      {style.icon} {value || "N/A"}
    </Tag>
  );
}

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);

  const getTaskDetailsById = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID + id
      );

      if (response.data) {
        setTask(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const updateTodoChecklist = async (index) => {
    const todoChecklist = [...(task?.todoChecklist || [])];
    const taskId = id;

    if (todoChecklist && todoChecklist[index]) {
      todoChecklist[index].completed = !todoChecklist[index].completed;
    }

    try {
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TODO_CHECKLIST + taskId + "/todo",
        { todoChecklist }
      );

      if (response.status === 200) {
        setTask(response.data?.task || task);
      } else {
        todoChecklist[index].completed = !todoChecklist[index].completed;
      }
    } catch (error) {
      todoChecklist[index].completed = !todoChecklist[index].completed;
      console.log(error);
    }
  };

  const openAttachment = (link) => {
    let finalLink = link;

    if (!/^https?:\/\//i.test(finalLink)) {
      finalLink = "https://" + finalLink;
    }

    window.open(finalLink, "_blank");
  };

  useEffect(() => {
    if (id) {
      getTaskDetailsById();
    }
  }, [id, getTaskDetailsById]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    return new Date(dateString).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const completedTasks =
    task?.todoChecklist?.filter((item) => item.completed).length || 0;
  const totalTasks = task?.todoChecklist?.length || 0;

  const progressPercent = useMemo(() => {
    if (!totalTasks) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  }, [completedTasks, totalTasks]);

  if (loading || !task) {
    return <Loading />;
  }

  return (
    <DashboardLayout defaultActiveKey="my-tasks">
      <div style={styles.page}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/user/tasks")}
          style={styles.backBtn}
        >
          Back to my missions
        </Button>

        <section style={styles.hero}>
          <div>
            <Text style={styles.kicker}>Mission details</Text>

            <Title style={styles.title}>{task.title}</Title>

            <Space size={[10, 10]} wrap>
              <SoftTag value={task.status} map={statusMap} />
              <SoftTag value={task.priority} map={priorityMap} />
              <Tag style={styles.dateTag}>
                <CalendarOutlined /> Due {formatDate(task.dueDate)}
              </Tag>
            </Space>
          </div>

          <div style={styles.progressPanel}>
            <Progress
              type="circle"
              percent={progressPercent}
              size={104}
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
              <Text style={styles.progressTitle}>Checklist progress</Text>
              <Text style={styles.progressText}>
                {completedTasks} of {totalTasks} items completed
              </Text>
            </div>
          </div>
        </section>

        <Row gutter={[20, 20]}>
          <Col xs={24} lg={16}>
            <Card style={styles.card} styles={{ body: { padding: 24 } }}>
              <Text style={styles.sectionKicker}>Briefing</Text>
              <Title level={4} style={styles.sectionTitle}>
                Description
              </Title>

              <Paragraph style={styles.description}>
                {task.description || "No description added."}
              </Paragraph>
            </Card>

            <Card
              style={{ ...styles.card, marginTop: 20 }}
              styles={{ body: { padding: 24 } }}
            >
              <Text style={styles.sectionKicker}>Execution list</Text>
              <Title level={4} style={styles.sectionTitle}>
                Todo checklist
              </Title>

              {task.todoChecklist?.length ? (
                <List
                  dataSource={task.todoChecklist}
                  renderItem={(item, index) => (
                    <List.Item style={styles.todoItem}>
                      <Checkbox
                        checked={item.completed}
                        onChange={() => updateTodoChecklist(index)}
                      />

                      <Text
                        style={{
                          ...styles.todoText,
                          opacity: item.completed ? 0.52 : 1,
                          textDecoration: item.completed
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {item.text}
                      </Text>
                    </List.Item>
                  )}
                />
              ) : (
                <Empty
                  description={
                    <span style={{ color: "#94a3b8" }}>No checklist items</span>
                  }
                />
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card style={styles.card} styles={{ body: { padding: 24 } }}>
              <Text style={styles.sectionKicker}>Assigned squad</Text>
              <Title level={4} style={styles.sectionTitle}>
                Team members
              </Title>

              {task.assignedTo?.length ? (
                <Avatar.Group
                  size={48}
                  max={{
                    count: 4,
                    style: {
                      color: "#bae6fd",
                      backgroundColor: "rgba(56, 189, 248, 0.14)",
                      cursor: "pointer",
                    },
                  }}
                >
                  {task.assignedTo.map((member) => (
                    <Tooltip
                      key={member._id}
                      title={`${member.name} (${member.email})`}
                    >
                      <Avatar
                        src={getSecureImageUrl(member.profileImageUrl)}
                        icon={<UserOutlined />}
                        style={styles.avatar}
                      >
                        {member.name?.charAt(0)}
                      </Avatar>
                    </Tooltip>
                  ))}
                </Avatar.Group>
              ) : (
                <Text style={styles.muted}>No members assigned.</Text>
              )}
            </Card>

            <Card
              style={{ ...styles.card, marginTop: 20 }}
              styles={{ body: { padding: 24 } }}
            >
              <Text style={styles.sectionKicker}>Resources</Text>
              <Title level={4} style={styles.sectionTitle}>
                Attachments
              </Title>

              {task.attachments?.length ? (
                <Space direction="vertical" style={{ width: "100%" }}>
                  {task.attachments.map((attachment, index) => (
                    <Button
                      key={`${attachment}-${index}`}
                      icon={<LinkOutlined />}
                      onClick={() => openAttachment(attachment)}
                      style={styles.attachmentBtn}
                    >
                      <span style={styles.attachmentText}>
                        <PaperClipOutlined /> Resource {index + 1}
                      </span>
                    </Button>
                  ))}
                </Space>
              ) : (
                <Text style={styles.muted}>No attachments added.</Text>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </DashboardLayout>
  );
}

export default TaskDetails;

const styles = {
  page: {
    display: "grid",
    gap: 20,
  },
  backBtn: {
    width: "fit-content",
    background: "rgba(15, 23, 42, 0.78)",
    color: "#e5e7eb",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    fontWeight: 800,
  },
  hero: {
    padding: 28,
    borderRadius: 30,
    border: "1px solid rgba(148, 163, 184, 0.16)",
    background:
      "linear-gradient(135deg, rgba(56,189,248,0.14), rgba(168,85,247,0.1), rgba(249,115,22,0.12))",
    boxShadow: "0 24px 70px rgba(0,0,0,0.24)",
    display: "flex",
    justifyContent: "space-between",
    gap: 24,
    alignItems: "center",
    flexWrap: "wrap",
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
    margin: "8px 0 16px",
    fontSize: "clamp(30px, 5vw, 56px)",
    lineHeight: 1,
    letterSpacing: "-0.06em",
  },
  dateTag: {
    color: "#e5e7eb",
    background: "rgba(148, 163, 184, 0.12)",
    border: "1px solid rgba(148, 163, 184, 0.22)",
    borderRadius: 999,
    padding: "6px 12px",
    fontWeight: 950,
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
  },
  progressPanel: {
    minWidth: 285,
    padding: 16,
    borderRadius: 26,
    background: "rgba(2, 6, 23, 0.42)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  progressTitle: {
    display: "block",
    color: "#f8fafc",
    fontWeight: 950,
    fontSize: 16,
  },
  progressText: {
    display: "block",
    color: "#94a3b8",
    marginTop: 4,
  },
  card: {
    overflow: "hidden",
  },
  sectionKicker: {
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 950,
    fontSize: 11,
  },
  sectionTitle: {
    color: "#f8fafc",
    margin: "4px 0 16px",
    letterSpacing: "-0.04em",
  },
  description: {
    color: "#cbd5e1",
    fontSize: 15,
    lineHeight: 1.8,
    marginBottom: 0,
  },
  todoItem: {
    padding: "14px 0",
    borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  todoText: {
    color: "#e5e7eb",
    fontSize: 15,
  },
  avatar: {
    background: "linear-gradient(135deg, #38bdf8, #f97316)",
    color: "#fff",
    fontWeight: 900,
  },
  muted: {
    color: "#94a3b8",
  },
  attachmentBtn: {
    width: "100%",
    minHeight: 46,
    justifyContent: "flex-start",
    background: "rgba(15, 23, 42, 0.78)",
    color: "#bae6fd",
    border: "1px solid rgba(56, 189, 248, 0.22)",
    borderRadius: 14,
    fontWeight: 850,
  },
  attachmentText: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
};