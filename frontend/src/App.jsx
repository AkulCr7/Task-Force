import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { useContext } from "react";

import Signup from "./auth/Signup";
import Login from "./auth/Login";

import PrivateRoute from "./routes/PrivateRoute";

import AdminDashboard from "./Admin/Dashboard";
import CreateTask from "./Admin/CreateTask";
import ManageTask from "./Admin/ManageTask";
import ManageUsers from "./Admin/ManageUsers";
import UserManagement from "./Admin/UserManagement";

import UserDashboard from "./User/UserDashboard";
import MyTasks from "./User/MyTasks";
import TaskDetails from "./User/TaskDetails";

import ProfilePage from "./components/ProfilePage";
import NotFoundPage from "./components/NotFoundPage";

import UserProvider from "./context/userProvider";
import { UserContext } from "./context/UserContext";
import ThemeProvider from "./context/ThemeProvider";

export const APP_NAME = "Task Force";
export const APP_TAGLINE = "Command your workflow.";

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={<Login appName={APP_NAME} tagline={APP_TAGLINE} />}
            />
            <Route
              path="/signup"
              element={<Signup appName={APP_NAME} tagline={APP_TAGLINE} />}
            />

            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route
                path="/admin/dashboard"
                element={<AdminDashboard appName={APP_NAME} />}
              />
              <Route path="/admin/create-task" element={<CreateTask />} />
              <Route path="/admin/tasks" element={<ManageTask />} />
              <Route path="/admin/team-members" element={<ManageUsers />} />
              <Route
                path="/admin/user-management"
                element={<UserManagement />}
              />
            </Route>

            <Route element={<PrivateRoute allowedRoles={["member"]} />}>
              <Route
                path="/user/dashboard"
                element={<UserDashboard appName={APP_NAME} />}
              />
              <Route path="/user/tasks" element={<MyTasks />} />
              <Route path="/user/task-details/:id" element={<TaskDetails />} />
            </Route>

            <Route element={<PrivateRoute allowedRoles={["admin", "member"]} />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            <Route path="/" element={<Root />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
}

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Outlet />;

  if (!user) return <Navigate to="/login" replace />;

  return user.role === "admin" ? (
    <Navigate to="/admin/dashboard" replace />
  ) : (
    <Navigate to="/user/dashboard" replace />
  );
};

export default App;