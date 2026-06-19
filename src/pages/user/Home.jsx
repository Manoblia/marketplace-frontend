import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/common/ProductCard";
import API_URL from "../../api/api";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data.slice(0, 4)))
      .catch((error) => console.error("Error cargando productos:", error));
  }, []);

  return (
    <>
      <section className="home-hero">
        <div className="home-hero-content">
          <h1>ARCHIVO 01: EL FUTURO DEL STREETWEAR</h1>
          <p>Edición exclusiva de zapatillas urbanas premium.</p>

          <Link to="/products" className="detail-button">
            Comprar colección
          </Link>
        </div>
      </section>

      <section style={{ padding: "40px" }}>
        <h2 style={{ marginBottom: "20px" }}>Productos Destacados</h2>

        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;