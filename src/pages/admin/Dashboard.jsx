import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchProducts } from "../../store/slices/productsSlice";
import { fetchBrands } from "../../store/slices/brandsSlice";
import { fetchCategories } from "../../store/slices/categoriesSlice";
import { fetchAllOrders } from "../../store/slices/ordersSlice";

function Dashboard() {
  const dispatch = useDispatch();

  const { items: products } = useSelector((state) => state.products);
  const { items: brands } = useSelector((state) => state.brands);
  const { items: categories } = useSelector((state) => state.categories);
  const { items: orders, loading: ordersLoading } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchBrands());
    dispatch(fetchCategories());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const totalImages = products.reduce((total, product) => {
    return total + (product.images?.length || 0);
  }, 0);

  const getOrderTotal = (order) => {
    if (order.total) return order.total;
    if (order.totalPrice) return order.totalPrice;
    if (order.amount) return order.amount;

    if (order.orderItems) {
      return order.orderItems.reduce((acc, item) => {
        const price =
          item.price ||
          item.unitPrice ||
          item.product?.price ||
          item.variant?.product?.price ||
          0;

        return acc + price * (item.quantity || 1);
      }, 0);
    }

    return 0;
  };

  const totalSales = orders.reduce((acc, order) => {
    return acc + getOrderTotal(order);
  }, 0);

  const cards = [
    {
      icon: "💰",
      title: "Facturación",
      value: `ARS ${totalSales.toLocaleString("es-AR")}`,
      description: "Total vendido en la tienda",
    },
    {
      icon: "🛒",
      title: "Ventas",
      value: orders.length,
      description: "Pedidos realizados",
    },
    {
      icon: "📦",
      title: "Productos",
      value: products.length,
      description: "Productos disponibles",
    },
    {
      icon: "🏷",
      title: "Marcas",
      value: brands.length,
      description: "Marcas cargadas",
    },
    {
      icon: "📂",
      title: "Categorías",
      value: categories.length,
      description: "Categorías activas",
    },
    {
      icon: "🖼",
      title: "Imágenes",
      value: totalImages,
      description: "Imágenes asociadas",
    },
  ];

  const latestOrders = [...orders].slice(-8).reverse();

  return (
    <section>
      <div style={{ marginBottom: "35px" }}>
        <h1 style={{ marginBottom: "10px" }}>Dashboard</h1>
        <p style={{ color: "#666" }}>
          Resumen general de ventas y administración de STEP.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "20px",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "14px",
              boxShadow: "0 6px 16px rgba(0,0,0,.08)",
              border: "1px solid #eee",
            }}
          >
            <div style={{ fontSize: "34px", marginBottom: "12px" }}>
              {card.icon}
            </div>

            <h3>{card.title}</h3>

            <p
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                margin: "12px 0",
              }}
            >
              {card.value}
            </p>

            <p style={{ color: "#666" }}>{card.description}</p>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "35px",
          background: "#fff",
          padding: "25px",
          borderRadius: "14px",
          boxShadow: "0 6px 16px rgba(0,0,0,.08)",
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>Historial de ventas</h2>

        {ordersLoading ? (
          <p>Cargando ventas...</p>
        ) : latestOrders.length === 0 ? (
          <p style={{ color: "#666" }}>
            Todavía no hay ventas registradas.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "15px",
            }}
          >
            <thead>
              <tr style={{ background: "#111", color: "#fff" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>
                  Pedido
                </th>
                <th style={{ textAlign: "left" }}>Cliente</th>
                <th style={{ textAlign: "left" }}>Pago</th>
                <th style={{ textAlign: "left" }}>Total</th>
              </tr>
            </thead>

            <tbody>
              {latestOrders.map((order) => (
                <tr
                  key={order.orderId}
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  <td style={{ padding: "12px" }}>
                    #STEP-{order.orderId}
                  </td>

                  <td>
                    {order.fullName ||
                      order.user?.name ||
                      order.user?.email ||
                      "Cliente"}
                  </td>

                  <td>{order.paymentMethod || "No informado"}</td>

                  <td>
                    <strong>
                      ARS {getOrderTotal(order).toLocaleString("es-AR")}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default Dashboard;