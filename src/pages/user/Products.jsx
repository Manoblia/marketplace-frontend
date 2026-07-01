import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../../components/common/ProductCard";
import { fetchProducts } from "../../store/slices/productsSlice";

function Products() {
  const dispatch = useDispatch();

  const {
    items,
    loading,
    error,
  } = useSelector((state) => state.products);

  const [brand, setBrand] = useState("Todos");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  const brands = useMemo(
    () => [
      "Todos",
      ...new Set(
        items
          .map((product) => product.brand?.brandName)
          .filter(Boolean)
      ),
    ],
    [items]
  );

  const filteredProducts = useMemo(() => {
    return items.filter((product) => {
      const matchesBrand =
        brand === "Todos" ||
        product.brand?.brandName === brand;

      const matchesSearch = (product.description || "")
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesBrand && matchesSearch;
    });
  }, [items, brand, search]);

  return (
    <section>
      <h1 style={{ marginBottom: "25px" }}>
        Productos
      </h1>

      <input
        type="text"
        placeholder="Buscar zapatillas..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "14px",
          marginBottom: "25px",
          border: "1px solid #bbb",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        {brands.map((item) => (
          <button
            key={item}
            onClick={() => setBrand(item)}
            style={{
              padding: "10px 18px",
              border: "1px solid #111",
              background:
                brand === item ? "#000" : "#fff",
              color:
                brand === item ? "#fff" : "#111",
              cursor: "pointer",
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <p style={{ marginBottom: "20px" }}>
        Mostrando{" "}
        <strong>{filteredProducts.length}</strong>{" "}
        producto
        {filteredProducts.length !== 1 ? "s" : ""} ·
        Filtro: <strong>{brand}</strong>
      </p>

      {loading && <p>Cargando productos...</p>}

      {error && (
        <p
          style={{
            color: "red",
            marginBottom: "20px",
          }}
        >
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
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
              />
            ))
          ) : (
            <p>No se encontraron productos.</p>
          )}
        </div>
      )}
    </section>
  );
}

export default Products;
