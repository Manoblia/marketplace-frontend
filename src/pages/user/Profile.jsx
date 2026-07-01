import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../../store/slices/ordersSlice";
import { fetchProducts } from "../../store/slices/productsSlice";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: orders, loading } = useSelector((state) => state.orders);
  const { items: products } = useSelector((state) => state.products);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(fetchOrders());
    dispatch(fetchProducts());
  }, [dispatch, navigate]);

  const getProductByVariantId = (variantId) => {
    return products.find((product) =>
      product.variants?.some((variant) => variant.variantId === variantId)
    );
  };

  return (
    <section>
      <h1>Mi cuenta</h1>

      <h2 style={{ marginTop: "30px" }}>Mis pedidos</h2>

      {loading ? (
        <p>Cargando pedidos...</p>
      ) : orders.length === 0 ? (
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
