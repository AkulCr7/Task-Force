import React, { useCallback, useMemo } from "react";
import {
  Row,
  Col,
  Card,
  Tabs,
  Button,
  Avatar,
  Badge,
  Space,
  Tooltip,
  Typography,
  Input,
  Select,
  Grid,
  Empty,
  Tag,
  Progress,
} from "antd";
import {
  DownloadOutlined,
  PaperClipOutlined,
  SearchOutlined,
  LoadingOutlined,
  CalendarOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { debounce } from "lodash";

import Loading from "../components/Loading";
import { useTasks } from "../hooks/useTasks";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { useBreakpoint } = Grid;

const getSecureImageUrl = (url) => url?.replace(/^http:\/\//, "https://");

const statusStyles = {
  All: {
    color: "#e5e7eb",
    bg: "rgba(148, 163, 184, 0.12)",
    border: "rgba(148, 163, 184, 0.22)",
    icon: <FilterOutlined />,
  },
  Pending: {
    color: "#fed7aa",
    bg: "rgba(249, 115, 22, 0.12)",
    border: "rgba(249, 115, 22, 0.26)",
    icon: <ClockCircleOutlined />,
  },
  "In Progress": {
    color: "#bae6fd",
    bg: "rgba(56, 189, 248, 0.12)",
    border: "rgba(56, 189, 248, 0.26)",
    icon: <ThunderboltOutlined />,
  },
  Completed: {
    color: "#bbf7d0",
    bg: "rgba(34, 197, 94, 0.12)",
    border: "rgba(34, 197, 94, 0.26)",
    icon: <CheckCircleOutlined />,
  },
  Overdue: {
    color: "#fecaca",
    bg: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.26)",
    icon: <ExclamationCircleOutlined />,
  },
};

const priorityStyles = {
  High: {
    color: "#fecaca",
    bg: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.28)",
  },
  Medium: {
    color: "#fde68a",
    bg: "rgba(245, 158, 11, 0.12)",
    border: "rgba(245, 158, 11, 0.28)",
  },
  Low: {
    color: "#bbf7d0",
    bg: "rgba(34, 197, 94, 0.12)",
    border: "rgba(34, 197, 94, 0.28)",
  },
};

function MissionTag({ value, type = "status" }) {
  const map = type === "priority" ? priorityStyles : statusStyles;
  const item = map[value] || statusStyles.All;

  return (
    <Tag
      style={{
        color: item.color,
        background: item.bg,
        border: `1px solid ${item.border}`,
        borderRadius: 999,
        padding: "5px 10px",
        fontWeight: 900,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        marginInlineEnd: 0,
      }}
    >
      {item.icon} {value || "N/A"}
    </Tag>
  );
}

function getProgress(task) {
  const total = task?.todoChecklist?.length || 0;
  const completed =
    task?.todoChecklist?.filter((item) => item.completed).length || 0;

  if (!total) return 0;
  return Math.round((completed / total) * 100);
}

export default function GenericTaskList({
  title,
  defaultActiveKey,
  onCardClick,
  showDownload = false,
  onDownload,
}) {
  const [filterStatus, setFilterStatus] = React.useState(defaultActiveKey);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchInputValue, setSearchInputValue] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("newest");
  const [isSearching, setIsSearching] = React.useState(false);

  const screens = useBreakpoint();

  const { allTasks, statusSummary, loading } = useTasks(
    filterStatus,
    searchQuery,
    sortOrder
  );

  const handleSearch = useCallback(
    debounce((value) => {
      setIsSearching(true);
      setSearchQuery(value);
    }, 300),
    []
  );

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchInputValue(value);
    handleSearch(value);
  };

  React.useEffect(() => {
    if (searchQuery !== "") setIsSearching(true);
    else setIsSearching(false);
  }, [searchQuery]);

  React.useEffect(() => {
    if (!loading) setIsSearching(false);
  }, [loading]);

  const tabs = useMemo(
    () => [
      {
        key: "All",
        label: (
          <span style={styles.tabLabel}>
            <Badge count={statusSummary.all || 0} overflowCount={999}>
              <span style={styles.tabInner}>All</span>
            </Badge>
          </span>
        ),
      },
      {
        key: "Pending",
        label: (
          <span style={styles.tabLabel}>
            <Badge count={statusSummary.pending || 0} overflowCount={999}>
              <span style={styles.tabInner}>Pending</span>
            </Badge>
          </span>
        ),
      },
      {
        key: "In Progress",
        label: (
          <span style={styles.tabLabel}>
            <Badge count={statusSummary.inProgress || 0} overflowCount={999}>
              <span style={styles.tabInner}>In Progress</span>
            </Badge>
          </span>
        ),
      },
      {
        key: "Completed",
        label: (
          <span style={styles.tabLabel}>
            <Badge count={statusSummary.completed || 0} overflowCount={999}>
              <span style={styles.tabInner}>Completed</span>
            </Badge>
          </span>
        ),
      },
      {
        key: "Overdue",
        label: (
          <span style={styles.tabLabel}>
            <Badge count={statusSummary.overdue || 0} overflowCount={999}>
              <span style={styles.tabInner}>Overdue</span>
            </Badge>
          </span>
        ),
      },
    ],
    [statusSummary]
  );

  return (
    <div style={styles.wrapper}>
      <div style={styles.topbar}>
        <div>
          <Text style={styles.kicker}>Task Force command center</Text>
          <Title level={2} style={styles.title}>
            {title}
          </Title>
        </div>

        {showDownload && (
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={onDownload}
            size="large"
          >
            Export report
          </Button>
        )}
      </div>

      <Row gutter={[14, 14]} align="middle">
        <Col xs={24} md={14}>
          <Search
            placeholder="Search missions by title or briefing..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onChange={handleSearchInputChange}
            value={searchInputValue}
            suffix={
              isSearching ? (
                <LoadingOutlined
                  style={{
                    color: "#38bdf8",
                    fontSize: 18,
                  }}
                  spin
                />
              ) : null
            }
          />
        </Col>

        <Col xs={24} md={10}>
          <Select
            style={{ width: "100%" }}
            size="large"
            value={sortOrder}
            onChange={setSortOrder}
            options={[
              { value: "newest", label: "Newest due date first" },
              { value: "oldest", label: "Oldest due date first" },
            ]}
          />
        </Col>
      </Row>

      <div style={styles.tabsShell}>
        <Tabs
          activeKey={filterStatus}
          onChange={setFilterStatus}
          items={tabs}
          size="large"
          tabBarStyle={{
            margin: 0,
            overflow: screens.xs ? "auto" : "visible",
            whiteSpace: screens.xs ? "nowrap" : "normal",
          }}
        />
      </div>

      {loading && (
        <div style={styles.loadingBox}>
          <Loading />
        </div>
      )}

      {!loading && allTasks.length === 0 && (
        <div style={styles.emptyBox}>
          <Empty
            description={
              <span style={{ color: "#94a3b8" }}>
                {searchQuery
                  ? "No missions matched your search."
                  : filterStatus === "All"
                  ? "No missions found."
                  : `No ${filterStatus.toLowerCase()} missions found.`}
              </span>
            }
          />
        </div>
      )}

      {!loading && allTasks.length > 0 && (
        <Row gutter={[18, 18]} wrap style={{ width: "100%" }}>
          {allTasks.map((task) => {
            const progress = getProgress(task);
            const assignedCount = task.assignedTo?.length || 0;

            return (
              <Col key={task._id} xs={24} sm={12} xl={8} xxl={6}>
                <Card
                  hoverable
                  onClick={() => onCardClick(task)}
                  style={styles.card}
                  styles={{ body: { padding: 18 } }}
                >
                  <div style={styles.cardGlow} />

                  <div style={styles.cardHead}>
                    <MissionTag value={task.priority} type="priority" />

                    <Tooltip
                      title={`Due: ${moment(task.dueDate).format(
                        "DD MMM YYYY"
                      )}`}
                    >
                      <span style={styles.datePill}>
                        <CalendarOutlined />{" "}
                        {moment(task.dueDate).format("DD MMM")}
                      </span>
                    </Tooltip>
                  </div>

                  <Title level={4} style={styles.cardTitle} ellipsis>
                    {task.title}
                  </Title>

                  <Paragraph
                    ellipsis={{ rows: 3 }}
                    style={styles.description}
                  >
                    {task.description || "No mission briefing added."}
                  </Paragraph>

                  <div style={styles.metaGrid}>
                    <div style={styles.metaBox}>
                      <Text style={styles.metaLabel}>Status</Text>
                      <MissionTag value={task.status || "Pending"} />
                    </div>

                    <div style={styles.metaBox}>
                      <Text style={styles.metaLabel}>Squad</Text>
                      <Text style={styles.metaValue}>
                        <TeamOutlined /> {assignedCount}
                      </Text>
                    </div>
                  </div>

                  <div style={styles.progressWrap}>
                    <div style={styles.progressTop}>
                      <Text style={styles.progressLabel}>Completion</Text>
                      <Text style={styles.progressValue}>{progress}%</Text>
                    </div>

                    <Progress
                      percent={progress}
                      showInfo={false}
                      strokeColor={{
                        "0%": "#38bdf8",
                        "100%": "#f97316",
                      }}
                      trailColor="rgba(148, 163, 184, 0.16)"
                    />
                  </div>

                  <div style={styles.footer}>
                    <Avatar.Group
                      max={{
                        count: 3,
                        style: {
                          color: "#bae6fd",
                          backgroundColor: "rgba(56, 189, 248, 0.16)",
                        },
                      }}
                    >
                      {task.assignedTo?.map((user) => (
                        <Tooltip key={user._id} title={user.name}>
                          <Avatar
                            src={getSecureImageUrl(user.profileImageUrl)}
                            style={styles.avatar}
                          >
                            {user.name?.charAt(0)}
                          </Avatar>
                        </Tooltip>
                      ))}
                    </Avatar.Group>

                    {task.attachments?.length > 0 && (
                      <span style={styles.attachments}>
                        <PaperClipOutlined /> {task.attachments.length}
                      </span>
                    )}
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    display: "grid",
    gap: 20,
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    flexWrap: "wrap",
  },
  kicker: {
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 950,
    fontSize: 11,
  },
  title: {
    color: "#f8fafc",
    margin: "4px 0 0",
    letterSpacing: "-0.05em",
  },
  tabsShell: {
    padding: 10,
    borderRadius: 20,
    background: "rgba(15, 23, 42, 0.66)",
    border: "1px solid rgba(148, 163, 184, 0.12)",
    overflowX: "auto",
  },
  tabLabel: {
    paddingInline: 6,
  },
  tabInner: {
    color: "#e5e7eb",
    fontWeight: 850,
  },
  loadingBox: {
    textAlign: "center",
    padding: "44px 0",
  },
  emptyBox: {
    padding: "44px 0",
    borderRadius: 24,
    background: "rgba(15, 23, 42, 0.48)",
    border: "1px dashed rgba(148, 163, 184, 0.22)",
  },
  card: {
    height: "100%",
    overflow: "hidden",
    position: "relative",
    borderRadius: 24,
    background:
      "linear-gradient(180deg, rgba(15, 23, 42, 0.96), rgba(2, 6, 23, 0.96))",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    boxShadow: "0 18px 48px rgba(0,0,0,0.26)",
  },
  cardGlow: {
    position: "absolute",
    top: -90,
    right: -90,
    width: 180,
    height: 180,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(56,189,248,0.22), transparent 68%)",
    pointerEvents: "none",
  },
  cardHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  datePill: {
    color: "#cbd5e1",
    background: "rgba(148, 163, 184, 0.1)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    borderRadius: 999,
    padding: "5px 9px",
    fontWeight: 800,
    fontSize: 12,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    whiteSpace: "nowrap",
  },
  cardTitle: {
    color: "#f8fafc",
    margin: "0 0 8px",
    letterSpacing: "-0.04em",
  },
  description: {
    color: "#94a3b8",
    minHeight: 66,
    marginBottom: 16,
    lineHeight: 1.55,
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginBottom: 16,
  },
  metaBox: {
    padding: 12,
    borderRadius: 18,
    background: "rgba(15, 23, 42, 0.76)",
    border: "1px solid rgba(148, 163, 184, 0.12)",
  },
  metaLabel: {
    display: "block",
    color: "#64748b",
    fontSize: 11,
    fontWeight: 950,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: 8,
  },
  metaValue: {
    color: "#e5e7eb",
    fontWeight: 900,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },
  progressWrap: {
    padding: 12,
    borderRadius: 18,
    background: "rgba(15, 23, 42, 0.76)",
    border: "1px solid rgba(148, 163, 184, 0.12)",
  },
  progressTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    color: "#94a3b8",
    fontWeight: 800,
  },
  progressValue: {
    color: "#f8fafc",
    fontWeight: 950,
  },
  footer: {
    marginTop: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  avatar: {
    background: "linear-gradient(135deg, #38bdf8, #f97316)",
    color: "#fff",
    fontWeight: 900,
  },
  attachments: {
    color: "#bae6fd",
    fontWeight: 900,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },
};