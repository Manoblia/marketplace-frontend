import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
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

        {user && (
          <Link to="/profile">
            Mi cuenta
          </Link>
        )}
      </nav>

      <div
        className="nav-actions"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
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

            {isAdmin && (
              <Link
                to="/admin"
                style={{
                  padding: "8px 16px",
                  background: "#111",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "4px",
                }}
              >
                Panel Admin
              </Link>
            )}

            <button
              onClick={handleLogout}
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
          <>
            <Link
              to="/login"
              style={{
                textDecoration: "none",
              }}
            >
              Iniciar sesión
            </Link>

            <Link
              to="/register"
              style={{
                padding: "8px 16px",
                background: "#111",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "4px",
              }}
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;