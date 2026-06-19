import { useState } from "react";
import API_URL from "../../api/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        // buscamos usuarios para obtener el nombre
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: email.split("@")[0],
            email: email,
          })
        );

        alert("Inicio de sesión exitoso");

        window.location.href = "/";
      } else {
        alert("Email o contraseña incorrectos");
      }
    } catch (error) {
      console.error(error);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <div style={{ maxWidth: "400px" }}>
      <h1>Iniciar Sesión</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginTop: "20px" }}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
            }}
          />
        </div>

        <div style={{ marginTop: "20px" }}>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "12px",
            background: "black",
            color: "white",
            border: "none",
          }}
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}

export default Login;