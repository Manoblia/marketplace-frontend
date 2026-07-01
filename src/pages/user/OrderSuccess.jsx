import { Link } from "react-router-dom";

function OrderSuccess() {
  let order = null;

  try {
    order = JSON.parse(localStorage.getItem("lastOrder"));
  } catch {
    order = null;
  }

  if (!order) {
    return (
      <section className="success-page">
        <h1>Compra realizada</h1>

        <div className="success-box">
          <p>No se encontró información del pedido.</p>

          <Link
            to="/products"
            className="detail-button"
          >
            Volver a productos
          </Link>
        </div>
      </section>
    );
  }

  const {
    orderId,
    fullName,
    shippingAddress,
    paymentMethod,
    total,
  } = order;

  return (
    <section className="success-page">
      <h1>Compra realizada</h1>

      <div className="success-box">
        <h2>Pedido confirmado correctamente</h2>

        <p>
          Número de pedido:
          <strong> #STEP-{orderId}</strong>
        </p>

        <p>
          Nombre:
          <strong> {fullName}</strong>
        </p>

        <p>
          Dirección:
          <strong> {shippingAddress}</strong>
        </p>

        <p>
          Método de pago:
          <strong> {paymentMethod}</strong>
        </p>

        <p>
          Total:
          <strong>
            {" "}
            ARS{" "}
            {Number(total).toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </strong>
        </p>

        <Link
          to="/products"
          className="detail-button"
        >
          Seguir comprando
        </Link>
      </div>
    </section>
  );
}

export default OrderSuccess;