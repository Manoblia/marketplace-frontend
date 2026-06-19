import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../api/api";

function Checkout() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Tarjeta");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Tenés que iniciar sesión");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/orders/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: name,
          shippingAddress: address,
          paymentMethod: payment,
        }),
      });

      if (response.ok) {
        const order = await response.json();

        localStorage.setItem(
          "lastOrder",
          JSON.stringify(order)
        );

        alert("Compra confirmada");

        navigate("/order-success");
      } else {
        alert("No se pudo confirmar la compra");
      }
    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <section className="checkout-page">
      <h1>Checkout</h1>

      <form onSubmit={handleSubmit} className="checkout-form">
        <input
          type="text"
          placeholder="Nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Dirección de envío"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <select
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
        >
          <option>Tarjeta</option>
          <option>Mercado Pago</option>
          <option>Transferencia</option>
        </select>

        <button type="submit">
          Confirmar compra
        </button>
      </form>
    </section>
  );
}

export default Checkout;