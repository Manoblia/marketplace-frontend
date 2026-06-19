import { Link } from "react-router-dom";

function OrderSuccess() {
  const order = JSON.parse(
    localStorage.getItem("lastOrder")
  );

  return (
    <section className="success-page">
      <h1>Compra realizada</h1>

      <div className="success-box">

        <h2>Pedido confirmado correctamente</h2>

        {order ? (
          <>
            <p>
              Número de pedido:
              <strong> #STEP-{order.orderId}</strong>
            </p>

            <p>
              Nombre:
              <strong> {order.fullName}</strong>
            </p>

            <p>
              Dirección:
              <strong> {order.shippingAddress}</strong>
            </p>

            <p>
              Método de pago:
              <strong> {order.paymentMethod}</strong>
            </p>

            <p>
              Total:
              <strong>
                {" "}
                ARS {order.total?.toLocaleString("es-AR")}
              </strong>
            </p>
          </>
        ) : (
          <p>No se encontró información del pedido.</p>
        )}

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