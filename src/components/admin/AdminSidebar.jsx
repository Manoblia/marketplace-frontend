import { NavLink } from "react-router-dom";

function AdminSidebar() {
  const linkStyle = ({ isActive }) => ({
    color: "#fff",
    textDecoration: "none",
    padding: "12px 14px",
    borderRadius: "8px",
    background: isActive ? "#333" : "transparent",
    fontWeight: isActive ? "bold" : "normal",
  });

  return (
    <aside
      style={{
        width: "250px",
        background: "#111",
        color: "#fff",
        padding: "30px 20px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "40px" }}>
        STEP ADMIN
      </h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <NavLink to="/admin" end style={linkStyle}>
          🏠 Dashboard
        </NavLink>

        <NavLink to="/admin/products" style={linkStyle}>
          📦 Productos
        </NavLink>

        <NavLink to="/admin/brands" style={linkStyle}>
          🏷 Marcas
        </NavLink>

        <NavLink to="/admin/categories" style={linkStyle}>
          📂 Categorías
        </NavLink>

        <NavLink to="/" style={linkStyle}>
          🛍 Volver a la tienda
        </NavLink>
      </nav>
    </aside>
  );
}

export default AdminSidebar;