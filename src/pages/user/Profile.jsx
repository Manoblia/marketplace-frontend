import { useEffect, useState } from "react";
import API_URL from "../../api/api";

function Profile() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch(`${API_URL}/api/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error cargando pedidos:", error));

    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error cargando productos:", error));
  }, [token]);

  const getProductByVariantId = (variantId) => {
    return products.find((product) =>
      product.variants?.some((variant) => variant.variantId === variantId)
    );
  };

  return (
    <section>
      <h1>Mi cuenta</h1>

      <h2 style={{ marginTop: "30px" }}>Mis pedidos</h2>

      {orders.length === 0 ? (
        <p>No tenés pedidos todavía.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.orderId}
            style={{
              marginTop: "20px",
              padding: "20px",
              border: "1px solid #ddd",
              background: "#fff",
            }}
          >
            <h3>Pedido #STEP-{order.orderId}</h3>

            <p>
              Fecha:{" "}
              {new Date(order.orderDate).toLocaleDateString("es-AR")}
            </p>

            <p>Nombre: {order.fullName}</p>
            <p>Dirección: {order.shippingAddress}</p>
            <p>Pago: {order.paymentMethod}</p>

            <h4 style={{ marginTop: "20px" }}>Productos comprados</h4>

            {order.orderItems?.map((item) => {
              const product = getProductByVariantId(item.variant.variantId);

              return (
                <div
                  key={item.orderItemId}
                  style={{
                    marginTop: "10px",
                    padding: "12px",
                    border: "1px solid #eee",
                  }}
                >
                  <p>
                    <strong>{product?.description}</strong>
                  </p>

                  <p>Marca: {product?.brand?.brandName}</p>
                  <p>Talle: AR {item.variant.size}</p>
                  <p>Cantidad: {item.quantity}</p>
                  <p>
                    Precio unitario: ARS{" "}
                    {item.unitPrice.toLocaleString("es-AR")}
                  </p>
                </div>
              );
            })}

            <h3 style={{ marginTop: "20px" }}>
              Total: ARS {order.total.toLocaleString("es-AR")}
            </h3>
          </div>
        ))
      )}
    </section>
  );
}

export default Profile;