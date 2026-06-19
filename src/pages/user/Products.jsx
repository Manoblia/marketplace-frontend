import { useEffect, useState } from "react";
import ProductCard from "../../components/common/ProductCard";
import API_URL from "../../api/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [brand, setBrand] = useState("Todos");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Productos recibidos:", data);
        setProducts(data);
      })
      .catch((error) => console.error("Error al cargar productos:", error));
  }, []);

  const brands = [
    "Todos",
    ...new Set(products.map((product) => product.brand?.brandName)),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesBrand =
      brand === "Todos" || product.brand?.brandName === brand;

    const matchesSearch = (
      product.description || ""
    )
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesBrand && matchesSearch;
  });

  return (
    <section>
      <h1 style={{ marginBottom: "25px" }}>Productos</h1>

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

      <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
        {brands.map((item) => (
          <button
            key={item}
            onClick={() => setBrand(item)}
            style={{
              padding: "10px 18px",
              border: "1px solid #111",
              background: brand === item ? "#000" : "#fff",
              color: brand === item ? "#fff" : "#111",
              cursor: "pointer",
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <p style={{ marginBottom: "20px" }}>
        Filtro seleccionado: <strong>{brand}</strong>
      </p>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
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
    </section>
  );
}

export default Products;