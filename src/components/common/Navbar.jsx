import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(
      localStorage.getItem("user")
    );

    setUser(savedUser);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("lastOrder");

    window.location.href = "/";
  };

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        STEP
      </Link>

      <nav className="nav-links">
        <Link to="/">Inicio</Link>

        <Link to="/products">
          Productos
        </Link>

        <Link to="/favorites">
          Favoritos
        </Link>

        <Link to="/cart">
          Carrito
        </Link>

        <Link to="/profile">
          Mi cuenta
        </Link>
      </nav>

      <div
        className="nav-actions"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {user ? (
          <>
            <span
              style={{
                whiteSpace: "nowrap",
                fontWeight: "500",
              }}
            >
              Hola, {user.name || user.email?.split("@")[0]}
            </span>

            <button
              onClick={logout}
              style={{
                padding: "8px 16px",
                background: "#fff",
                border: "1px solid #111",
                cursor: "pointer",
              }}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link to="/login">
            Iniciar sesión
          </Link>
        )}
      </div>
    </header>
  );
}

export default Navbar;