import React, { useEffect, useMemo, useState } from "react";
import { Card, Col, Empty, Row, Typography } from "antd";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import {
  BarChartOutlined,
  PieChartOutlined,
} from "@ant-design/icons";

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const { Text, Title } = Typography;

const chartColors = {
  pending: "#f97316",
  progress: "#38bdf8",
  completed: "#22c55e",
  overdue: "#ef4444",
  low: "#22c55e",
  medium: "#38bdf8",
  high: "#f97316",
};

const commonPluginOptions = {
  legend: {
    labels: {
      color: "#cbd5e1",
      boxWidth: 12,
      boxHeight: 12,
      padding: 18,
      font: {
        size: 12,
        weight: "700",
      },
    },
  },
  tooltip: {
    backgroundColor: "rgba(2, 6, 23, 0.92)",
    titleColor: "#f8fafc",
    bodyColor: "#cbd5e1",
    borderColor: "rgba(148, 163, 184, 0.18)",
    borderWidth: 1,
    padding: 12,
    cornerRadius: 12,
  },
};

const TaskCharts = ({ data }) => {
  const [pieData, setPieData] = useState(null);
  const [barData, setBarData] = useState(null);

  useEffect(() => {
    const taskDistribution = data?.taskDistribution || {};
    const taskPriorityLevels = data?.taskPriorityLevels || {};

    setPieData({
      labels: ["Pending", "In Progress", "Completed", "Overdue"],
      datasets: [
        {
          data: [
            taskDistribution.Pending || 0,
            taskDistribution.InProgress || 0,
            taskDistribution.Completed || 0,
            taskDistribution.Overdue || 0,
          ],
          backgroundColor: [
            chartColors.pending,
            chartColors.progress,
            chartColors.completed,
            chartColors.overdue,
          ],
          borderColor: "rgba(15, 23, 42, 0.96)",
          borderWidth: 4,
          hoverOffset: 10,
        },
      ],
    });

    setBarData({
      labels: ["Low", "Medium", "High"],
      datasets: [
        {
          label: "Tasks",
          data: [
            taskPriorityLevels.Low || 0,
            taskPriorityLevels.Medium || 0,
            taskPriorityLevels.High || 0,
          ],
          backgroundColor: [
            chartColors.low,
            chartColors.medium,
            chartColors.high,
          ],
          borderRadius: 14,
          borderSkipped: false,
          maxBarThickness: 62,
        },
      ],
    });
  }, [data]);

  const hasPieData = useMemo(
    () => pieData?.datasets?.[0]?.data?.some((value) => value > 0),
    [pieData]
  );

  const hasBarData = useMemo(
    () => barData?.datasets?.[0]?.data?.some((value) => value > 0),
    [barData]
  );

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
    plugins: {
      ...commonPluginOptions,
      legend: {
        ...commonPluginOptions.legend,
        position: "bottom",
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...commonPluginOptions,
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#cbd5e1",
          font: {
            size: 12,
            weight: "700",
          },
        },
        grid: {
          display: false,
        },
        border: {
          color: "rgba(148, 163, 184, 0.16)",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#94a3b8",
          precision: 0,
          font: {
            size: 12,
          },
        },
        grid: {
          color: "rgba(148, 163, 184, 0.12)",
        },
        border: {
          color: "rgba(148, 163, 184, 0.16)",
        },
      },
    },
  };

  return (
    <Row gutter={[20, 20]}>
      <Col xs={24} lg={12}>
        <Card style={styles.card} styles={{ body: { padding: 24 } }}>
          <ChartHeader
            icon={<PieChartOutlined />}
            kicker="Distribution"
            title="Mission status"
            subtitle="How work is currently moving through the system."
          />

          <div style={styles.chartBox}>
            {hasPieData ? (
              <Doughnut data={pieData} options={pieOptions} />
            ) : (
              <Empty
                description={<span style={{ color: "#94a3b8" }}>No data</span>}
              />
            )}
          </div>
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card style={styles.card} styles={{ body: { padding: 24 } }}>
          <ChartHeader
            icon={<BarChartOutlined />}
            kicker="Priority"
            title="Priority load"
            subtitle="Task pressure split across low, medium, and high priority."
          />

          <div style={styles.chartBox}>
            {hasBarData ? (
              <Bar data={barData} options={barOptions} />
            ) : (
              <Empty
                description={<span style={{ color: "#94a3b8" }}>No data</span>}
              />
            )}
          </div>
        </Card>
      </Col>
    </Row>
  );
};

function ChartHeader({ icon, kicker, title, subtitle }) {
  return (
    <div style={styles.header}>
      <div style={styles.iconBox}>{icon}</div>

      <div>
        <Text style={styles.kicker}>{kicker}</Text>
        <Title level={4} style={styles.title}>
          {title}
        </Title>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </div>
    </div>
  );
}

export default TaskCharts;

const styles = {
  card: {
    minHeight: 430,
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 22,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    display: "grid",
    placeItems: "center",
    color: "#bae6fd",
    background: "rgba(56, 189, 248, 0.12)",
    border: "1px solid rgba(56, 189, 248, 0.22)",
    fontSize: 22,
    flexShrink: 0,
  },
  kicker: {
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 900,
    fontSize: 11,
  },
  title: {
    color: "#f8fafc",
    margin: "3px 0 2px",
    letterSpacing: "-0.04em",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 13,
  },
  chartBox: {
    height: 310,
    position: "relative",
  },
};