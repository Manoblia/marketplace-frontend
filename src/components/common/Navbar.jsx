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

        <Link to="/profile">
          Mi cuenta
        </Link>

        {isAdmin && (
          <Link
            to="/admin"
            style={{
              color: "#d32f2f",
              fontWeight: "bold",
            }}
          >
            Panel Admin
          </Link>
        )}
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
          <Link to="/login">
            Iniciar sesión
          </Link>
        )}
      </div>
    </header>
  );
}

export default Navbar;