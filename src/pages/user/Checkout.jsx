import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkout } from "../../store/slices/ordersSlice";

function Checkout() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Tarjeta");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.orders);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Tenés que iniciar sesión");
      navigate("/login");
      return;
    }

    const result = await dispatch(
      checkout({
        fullName: name,
        shippingAddress: address,
        paymentMethod: payment,
      })
    );

    if (checkout.fulfilled.match(result)) {
      localStorage.setItem("lastOrder", JSON.stringify(result.payload));
      alert("Compra confirmada");
      navigate("/order-success");
    } else {
      alert(result.payload || "No se pudo confirmar la compra");
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

        <button type="submit" disabled={loading}>
          {loading ? "Procesando..." : "Confirmar compra"}
        </button>
      </form>
    </section>
  );
}

export default Checkout;
