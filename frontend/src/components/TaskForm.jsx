import { useCallback, useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Typography,
  message,
  Modal,
  Space,
  Row,
  Col,
  Divider,
} from "antd";
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  RocketOutlined,
  TeamOutlined,
  CheckSquareOutlined,
  LinkOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import AssignedUsersDisplay from "./AssignedUserDisplay";
import UserSelectionModal from "./UserSelectionModal";
import DynamicList from "./DynamicList";
import Loading from "./Loading";
import axiosInstance from "../utils/axiosConfig";
import { API_PATHS } from "../utils/apiPaths";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;

const inputStyle = {
  background: "rgba(15, 23, 42, 0.78)",
  border: "1px solid rgba(148, 163, 184, 0.18)",
  color: "#f8fafc",
  borderRadius: 14,
};

const TaskForm = () => {
  const location = useLocation();
  const taskID = location.state?.taskID;
  const isUpdate = typeof taskID === "string";

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [assignedTouched, setAssignedTouched] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [checklistTouched, setChecklistTouched] = useState(false);
  const [prevChecklist, setPrevChecklist] = useState([]);

  const init = {
    priority: "Low",
    title: "",
    dueDate: null,
    description: "",
  };

  const clearData = () => {
    form.resetFields();
    setSelectedUsers([]);
    setAttachments([]);
    setChecklist([]);
    setAssignedTouched(false);
    setChecklistTouched(false);
  };

  const handleSubmit = (values) => {
    setAssignedTouched(true);
    setChecklistTouched(true);

    if (selectedUsers.length === 0 || checklist.length === 0) {
      return;
    }

    if (isUpdate) {
      updateTask(values);
      return;
    }

    createTask(values);
  };

  const createTask = async (values) => {
    setLoading(true);

    try {
      const todoChecklist = checklist?.map((item) => ({
        text: item,
        completed: false,
      }));

      const assignedTo = selectedUsers.map((u) => u._id);

      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...values,
        dueDate: new Date(values.dueDate).toISOString(),
        todoChecklist,
        assignedTo,
        attachments,
      });

      message.success("Mission created successfully");
      clearData();
    } catch (error) {
      console.error("Error creating task:", error);
      message.error("Could not create mission");
    } finally {
      setLoading(false);
    }
  };

  const getTaskDetailsById = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID + taskID
      );

      if (response.data) {
        const taskInfo = response.data;

        form.setFieldsValue({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate ? dayjs(taskInfo.dueDate) : null,
        });

        setSelectedUsers(taskInfo?.assignedTo || []);
        setAttachments(taskInfo?.attachments || []);
        setChecklist(taskInfo?.todoChecklist?.map((item) => item?.text) || []);
        setPrevChecklist(
          taskInfo?.todoChecklist?.map((item) => ({
            text: item.text,
            completed: item.completed,
          })) || []
        );
      }
    } catch (error) {
      console.log(error);
      message.error("Could not load mission details");
    } finally {
      setLoading(false);
    }
  }, [form, taskID]);

  const updateTask = async (values) => {
    setLoading(true);

    try {
      const todolist = checklist?.map((item) => {
        const prevTodoChecklist = prevChecklist || [];
        const matchedTask = prevTodoChecklist.find((task) => task.text === item);

        return {
          text: item,
          completed: matchedTask ? matchedTask.completed : false,
        };
      });

      const assignedTo = selectedUsers.map((u) => u._id);

      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK + taskID, {
        ...values,
        dueDate: new Date(values.dueDate).toISOString(),
        todoChecklist: todolist,
        assignedTo,
        attachments,
      });

      message.success("Mission updated successfully");
    } catch (error) {
      console.log(error);
      message.error("Could not update mission");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = () => {
    confirm({
      title: "Delete Mission",
      icon: <ExclamationCircleOutlined />,
      content:
        "Are you sure you want to delete this mission? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        deleteTask();
      },
    });
  };

  const deleteTask = async () => {
    setLoading(true);

    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK + taskID);
      message.success("Mission deleted successfully");
      navigate("/admin/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
      message.error("Failed to delete mission");
    } finally {
      setLoading(false);
    }
  };

  const handleModalSave = (users) => {
    setSelectedUsers(users);
    setModalVisible(false);
    setAssignedTouched(true);
  };

  useEffect(() => {
    if (isUpdate) {
      getTaskDetailsById();
    }
  }, [isUpdate, getTaskDetailsById]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Card style={styles.shell} styles={{ body: { padding: 0 } }}>
        <div style={styles.header}>
          <div>
            <Text style={styles.kicker}>
              <RocketOutlined /> {isUpdate ? "Mission update" : "New mission"}
            </Text>

            <Title level={2} style={styles.title}>
              {isUpdate ? "Refine mission details" : "Launch a Task Force mission"}
            </Title>

            <Text style={styles.subtitle}>
              Fill in the mission briefing, assign your squad, add execution
              steps, and attach useful links.
            </Text>
          </div>

          {isUpdate && (
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDeleteTask}
              style={styles.deleteBtn}
            >
              Delete mission
            </Button>
          )}
        </div>

        <Divider style={styles.divider} />

        <Form
          form={form}
          layout="vertical"
          initialValues={init}
          onFinish={(values) => {
            setAssignedTouched(true);
            setChecklistTouched(true);

            if (selectedUsers.length === 0 || checklist.length === 0) return;

            handleSubmit(values);
          }}
          onFinishFailed={() => {
            setAssignedTouched(true);
            setChecklistTouched(true);
          }}
          style={styles.form}
        >
          <Row gutter={[18, 4]}>
            <Col xs={24} lg={14}>
              <Form.Item
                name="title"
                label={<span style={styles.label}>Mission title</span>}
                rules={[
                  { required: true, message: "Please enter a mission title" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Example: Build analytics dashboard"
                  style={inputStyle}
                />
              </Form.Item>
            </Col>

            <Col xs={24} lg={5}>
              <Form.Item
                name="priority"
                label={<span style={styles.label}>Priority</span>}
                rules={[{ required: true, message: "Please select priority" }]}
              >
                <Select size="large" style={{ width: "100%" }}>
                  <Option value="Low">Low</Option>
                  <Option value="Medium">Medium</Option>
                  <Option value="High">High</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} lg={5}>
              <Form.Item
                name="dueDate"
                label={<span style={styles.label}>Due date</span>}
                rules={[{ required: true, message: "Please select a due date" }]}
              >
                <DatePicker
                  size="large"
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label={<span style={styles.label}>Mission briefing</span>}
            rules={[{ required: true, message: "Please enter a briefing" }]}
          >
            <TextArea
              rows={5}
              placeholder="Describe what needs to be done, expected output, and any important context."
              style={inputStyle}
            />
          </Form.Item>

          <Row gutter={[18, 18]}>
            <Col xs={24} lg={12}>
              <div style={styles.panel}>
                <div style={styles.panelHead}>
                  <TeamOutlined style={styles.panelIcon} />
                  <div>
                    <Text style={styles.panelTitle}>Assigned squad</Text>
                    <Text style={styles.panelText}>
                      Select the users responsible for this mission.
                    </Text>
                  </div>
                </div>

                <Form.Item
                  required
                  validateStatus={
                    assignedTouched && selectedUsers.length === 0 ? "error" : ""
                  }
                  help={
                    assignedTouched && selectedUsers.length === 0
                      ? "Please assign at least one user"
                      : ""
                  }
                  style={{ marginBottom: 0 }}
                >
                  <AssignedUsersDisplay
                    users={selectedUsers}
                    onClick={() => {
                      setModalVisible(true);
                    }}
                  />
                </Form.Item>
              </div>
            </Col>

            <Col xs={24} lg={12}>
              <div style={styles.panel}>
                <div style={styles.panelHead}>
                  <CheckSquareOutlined style={styles.panelIcon} />
                  <div>
                    <Text style={styles.panelTitle}>Execution checklist</Text>
                    <Text style={styles.panelText}>
                      Add the smaller steps needed to complete the mission.
                    </Text>
                  </div>
                </div>

                <Form.Item
                  required
                  validateStatus={
                    checklistTouched && checklist.length === 0 ? "error" : ""
                  }
                  help={
                    checklistTouched && checklist.length === 0
                      ? "Please add at least one checklist item"
                      : ""
                  }
                  style={{ marginBottom: 0 }}
                >
                  <DynamicList
                    items={checklist}
                    onChange={(items) => {
                      setChecklist(items);
                      setChecklistTouched(true);
                    }}
                    placeholder="Add checklist item"
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <div style={styles.panel}>
            <div style={styles.panelHead}>
              <LinkOutlined style={styles.panelIcon} />
              <div>
                <Text style={styles.panelTitle}>Attachments</Text>
                <Text style={styles.panelText}>
                  Add helpful links, docs, references, or file URLs.
                </Text>
              </div>
            </div>

            <DynamicList
              items={attachments}
              onChange={setAttachments}
              placeholder="Add link, for example https://react.dev"
            />
          </div>

          <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<SaveOutlined />}
              >
                {isUpdate ? "Save mission changes" : "Create mission"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <UserSelectionModal
        visible={modalVisible}
        onCancel={() => {
          setAssignedTouched(true);
          setModalVisible(false);
        }}
        onSave={handleModalSave}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
      />
    </>
  );
};

export default TaskForm;

const styles = {
  shell: {
    overflow: "hidden",
    borderRadius: 30,
    background:
      "linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(2, 6, 23, 0.98))",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.28)",
  },
  header: {
    padding: 26,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 18,
    flexWrap: "wrap",
    background:
      "linear-gradient(135deg, rgba(56,189,248,0.12), rgba(249,115,22,0.1))",
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
    margin: "8px 0 8px",
    letterSpacing: "-0.06em",
    lineHeight: 1,
  },
  subtitle: {
    display: "block",
    color: "#cbd5e1",
    maxWidth: 680,
    lineHeight: 1.7,
  },
  deleteBtn: {
    background: "rgba(239, 68, 68, 0.12)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#fecaca",
    fontWeight: 900,
  },
  divider: {
    margin: 0,
    borderColor: "rgba(148, 163, 184, 0.14)",
  },
  form: {
    padding: 26,
  },
  label: {
    color: "#cbd5e1",
    fontWeight: 900,
  },
  panel: {
    padding: 18,
    borderRadius: 24,
    background: "rgba(15, 23, 42, 0.72)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    marginBottom: 18,
  },
  panelHead: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 14,
  },
  panelIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    padding: 11,
    color: "#bae6fd",
    background: "rgba(56, 189, 248, 0.12)",
    border: "1px solid rgba(56, 189, 248, 0.18)",
    fontSize: 18,
  },
  panelTitle: {
    display: "block",
    color: "#f8fafc",
    fontWeight: 950,
    fontSize: 16,
  },
  panelText: {
    display: "block",
    color: "#94a3b8",
    marginTop: 2,
  },
};