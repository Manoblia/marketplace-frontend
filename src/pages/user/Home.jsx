import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../components/common/ProductCard";
import { fetchProducts } from "../../store/slices/productsSlice";

function Home() {
  const dispatch = useDispatch();

  const {
    items,
    loading,
    error,
  } = useSelector((state) => state.products);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  const featured = useMemo(
    () => items.slice(0, 4),
    [items]
  );

  return (
    <>
      <section className="home-hero">
        <div className="home-hero-content">
          <h1>ARCHIVO 01: EL FUTURO DEL STREETWEAR</h1>

          <p>
            Edición exclusiva de zapatillas urbanas premium.
          </p>

          <Link
            to="/products"
            className="detail-button"
          >
            Comprar colección
          </Link>
        </div>
      </section>

      <section style={{ padding: "40px" }}>
        <h2 style={{ marginBottom: "20px" }}>
          Productos Destacados
        </h2>

        {loading && <p>Cargando productos...</p>}

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        {!loading && !error && (
          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            {featured.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Home;