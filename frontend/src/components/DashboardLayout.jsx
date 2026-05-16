import { useContext, useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Drawer,
  Grid,
  Layout,
  Menu,
  Switch,
  Typography,
} from "antd";
import {
  CloseOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../context/UserContext";
import { ThemeContext } from "../context/ThemeContext";
import { SIDEBAR_ADMIN_ITEMS, SIDEBAR_USER_ITEMS } from "../utils/data";

const { Content, Sider } = Layout;
const { useBreakpoint } = Grid;
const { Text } = Typography;

const getSecureImageUrl = (url) => url?.replace(/^http:\/\//, "https://");

export default function DashboardLayout({
  defaultActiveKey = "dashboard",
  children,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(defaultActiveKey);

  const screens = useBreakpoint();
  const navigate = useNavigate();

  const { user, clearUser } = useContext(UserContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const isMobile = !screens.md;

  const menuItems =
    user?.role === "admin" ? SIDEBAR_ADMIN_ITEMS : SIDEBAR_USER_ITEMS;

  useEffect(() => {
    setCollapsed(false);
  }, [isMobile]);

  const items = useMemo(
    () =>
      menuItems.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: item.label,
      })),
    [menuItems]
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUser();
    navigate("/login");
  };

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);

    const item = menuItems.find((i) => i.key === key);

    if (!item) return;

    if (item.isLogout) {
      handleLogout();
      return;
    }

    navigate(item.path);
    setDrawerOpen(false);
  };

  const roleLabel = user?.role === "admin" ? "Admin" : "Member";

  const sidebarContent = (
    <div style={styles.sidebarInner}>
      <div style={styles.brand}>
        <div style={styles.logo}>
          <ThunderboltOutlined />
        </div>

        {!collapsed && (
          <div>
            <div style={styles.brandTitle}>Task Force</div>
            <div style={styles.brandSub}>Mission workspace</div>
          </div>
        )}
      </div>

      <div style={styles.profileCard}>
        <Avatar
          size={collapsed ? 42 : 58}
          src={getSecureImageUrl(user?.profileImageUrl)}
          style={styles.avatar}
        >
          {user?.name?.[0]?.toUpperCase() || "T"}
        </Avatar>

        {!collapsed && (
          <div style={styles.profileInfo}>
            <Text style={styles.profileName} ellipsis>
              {user?.name || "Task User"}
            </Text>

            <Text style={styles.profileEmail} ellipsis>
              {user?.email || "workspace@taskforce.app"}
            </Text>

            <Badge
              count={roleLabel}
              style={{
                background:
                  user?.role === "admin"
                    ? "linear-gradient(135deg, #38bdf8, #0284c7)"
                    : "linear-gradient(135deg, #f97316, #ea580c)",
                fontWeight: 800,
                marginTop: 8,
              }}
            />
          </div>
        )}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
        items={items}
        style={styles.menu}
      />

      <div style={styles.sidebarFooter}>
        {!collapsed && (
          <div style={styles.footerText}>
            <span>Theme</span>
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
            />
          </div>
        )}

        <Button
          block
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={styles.logoutBtn}
        >
          {!collapsed && "Logout"}
        </Button>
      </div>
    </div>
  );

  return (
    <Layout style={styles.root}>
      {!isMobile && (
        <Sider
          width={292}
          collapsedWidth={86}
          collapsible
          collapsed={collapsed}
          trigger={null}
          style={styles.sider}
        >
          {sidebarContent}
        </Sider>
      )}

      <Layout style={styles.main}>
        <header style={styles.topbar}>
          <div style={styles.topbarLeft}>
            {isMobile ? (
              <Button
                icon={<MenuUnfoldOutlined />}
                onClick={() => setDrawerOpen(true)}
                style={styles.iconButton}
              />
            ) : (
              <Button
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed((prev) => !prev)}
                style={styles.iconButton}
              />
            )}

            <div>
              <div style={styles.topbarTitle}>Task Force Control</div>
              <div style={styles.topbarSub}>
                Manage work, people, and progress from one place.
              </div>
            </div>
          </div>

          <div style={styles.topbarRight}>
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
            />

            <Avatar
              size={42}
              src={getSecureImageUrl(user?.profileImageUrl)}
              style={styles.avatar}
            >
              {user?.name?.[0]?.toUpperCase() || "T"}
            </Avatar>
          </div>
        </header>

        <Content style={styles.content}>{children}</Content>
      </Layout>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="left"
        width={300}
        closeIcon={<CloseOutlined style={{ color: "#e5e7eb" }} />}
        styles={{
          body: { padding: 0, background: "#07111f" },
          header: {
            background: "#07111f",
            borderBottom: "1px solid rgba(148, 163, 184, 0.16)",
          },
          content: { background: "#07111f" },
        }}
      >
        <div style={{ ...styles.sidebarInner, minHeight: "100vh" }}>
          {sidebarContent}
        </div>
      </Drawer>
    </Layout>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "transparent",
  },
  sider: {
    background: "rgba(2, 6, 23, 0.76)",
    borderRight: "1px solid rgba(148, 163, 184, 0.16)",
    backdropFilter: "blur(22px)",
    position: "sticky",
    top: 0,
    height: "100vh",
    overflow: "hidden",
  },
  sidebarInner: {
    height: "100%",
    padding: 18,
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  brand: {
    minHeight: 58,
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "4px 4px 10px",
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 16,
    display: "grid",
    placeItems: "center",
    color: "white",
    fontSize: 22,
    background: "linear-gradient(135deg, #38bdf8, #f97316)",
    boxShadow: "0 14px 34px rgba(56,189,248,0.24)",
    flexShrink: 0,
  },
  brandTitle: {
    color: "#f8fafc",
    fontSize: 22,
    fontWeight: 950,
    letterSpacing: "-0.05em",
  },
  brandSub: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 2,
  },
  profileCard: {
    padding: 14,
    borderRadius: 24,
    border: "1px solid rgba(148, 163, 184, 0.16)",
    background:
      "linear-gradient(135deg, rgba(56,189,248,0.12), rgba(168,85,247,0.08), rgba(249,115,22,0.1))",
    display: "flex",
    alignItems: "center",
    gap: 12,
    minHeight: 86,
  },
  avatar: {
    background: "linear-gradient(135deg, #38bdf8, #f97316)",
    color: "#fff",
    fontWeight: 900,
    flexShrink: 0,
  },
  profileInfo: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },
  profileName: {
    color: "#f8fafc",
    fontWeight: 900,
    fontSize: 15,
    maxWidth: 170,
  },
  profileEmail: {
    color: "#94a3b8",
    fontSize: 12,
    maxWidth: 170,
  },
  menu: {
    background: "transparent",
    borderInlineEnd: "none",
    fontWeight: 800,
  },
  sidebarFooter: {
    marginTop: "auto",
    display: "grid",
    gap: 12,
  },
  footerText: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#94a3b8",
    padding: "0 4px",
    fontWeight: 800,
  },
  logoutBtn: {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.28)",
    color: "#fecaca",
  },
  main: {
    minHeight: "100vh",
    background: "transparent",
  },
  topbar: {
    minHeight: 76,
    padding: "16px 26px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
    background: "rgba(2, 6, 23, 0.46)",
    borderBottom: "1px solid rgba(148, 163, 184, 0.14)",
    backdropFilter: "blur(18px)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  topbarLeft: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    minWidth: 0,
  },
  iconButton: {
    width: 42,
    height: 42,
    background: "rgba(15, 23, 42, 0.78)",
    color: "#e5e7eb",
    border: "1px solid rgba(148, 163, 184, 0.2)",
  },
  topbarTitle: {
    color: "#f8fafc",
    fontWeight: 950,
    fontSize: 18,
    letterSpacing: "-0.03em",
  },
  topbarSub: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 2,
  },
  topbarRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  content: {
    padding: 26,
    minHeight: "calc(100vh - 76px)",
    overflowY: "auto",
  },
};