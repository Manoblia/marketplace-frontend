import { useState } from "react";
import API_URL from "../../api/api";

function Register() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          email,
          password,
          rolId: 1,
        }),
      });

      if (response.ok) {
        alert("Usuario registrado correctamente");
        window.location.href = "/login";
      } else {
        alert("Error al registrarse");
      }
    } catch (error) {
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div style={{ maxWidth: "400px" }}>
      <h1>Registro</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          style={{ width: "100%", padding: "12px", marginBottom: "10px" }}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "12px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "12px", marginBottom: "10px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "black",
            color: "white",
            border: "none",
          }}
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Register;