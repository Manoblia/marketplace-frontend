import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchProducts } from "../../store/slices/productsSlice";
import { fetchBrands } from "../../store/slices/brandsSlice";
import { fetchCategories } from "../../store/slices/categoriesSlice";

function Dashboard() {
  const dispatch = useDispatch();

  const { items: products } = useSelector((state) => state.products);
  const { items: brands } = useSelector((state) => state.brands);
  const { items: categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchBrands());
    dispatch(fetchCategories());
  }, [dispatch]);

  const totalImages = products.reduce((total, product) => {
    return total + (product.images?.length || 0);
  }, 0);

  const cards = [
    {
      icon: "📦",
      title: "Productos",
      value: products.length,
      description: "Productos disponibles en la tienda",
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
      description: "Imágenes asociadas a productos",
    },
  ];

  return (
    <section>
      <div style={{ marginBottom: "35px" }}>
        <h1 style={{ marginBottom: "10px" }}>Dashboard</h1>
        <p style={{ color: "#666" }}>
          Resumen general del panel de administración de STEP.
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
            <div
              style={{
                fontSize: "34px",
                marginBottom: "12px",
              }}
            >
              {card.icon}
            </div>

            <h3>{card.title}</h3>

            <p
              style={{
                fontSize: "36px",
                fontWeight: "bold",
                margin: "12px 0",
              }}
            >
              {card.value}
            </p>

            <p style={{ color: "#666" }}>
              {card.description}
            </p>
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
        <h2 style={{ marginBottom: "15px" }}>
          Estado del sistema
        </h2>

        <p style={{ color: "#666" }}>
          El panel permite administrar productos, marcas, categorías e imágenes
          de la tienda utilizando Redux Toolkit, Axios y la API Spring Boot.
        </p>
      </div>
    </section>
  );
}

export default Dashboard;