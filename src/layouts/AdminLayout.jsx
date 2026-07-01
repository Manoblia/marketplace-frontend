import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

function AdminLayout() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >
      <AdminSidebar />

      <main
        style={{
          flex: 1,
          padding: "40px",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;