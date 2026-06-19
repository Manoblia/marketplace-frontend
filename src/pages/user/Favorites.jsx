import { useState } from "react";
import ProductCard from "../../components/common/ProductCard";

function Favorites() {
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  });

  const removeFavorite = (productId) => {
    const updatedFavorites = favorites.filter(
      (product) => product.productId !== productId
    );

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  const clearFavorites = () => {
    localStorage.removeItem("favorites");
    setFavorites([]);
  };

  if (favorites.length === 0) {
    return (
      <section>
        <h1 style={{ marginBottom: "25px" }}>Mis Favoritos</h1>

        <div className="success-box">
          <p>No tenés productos guardados en favoritos.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h1 style={{ marginBottom: "25px" }}>Mis Favoritos</h1>

      <button
        onClick={clearFavorites}
        style={{
          marginBottom: "25px",
          padding: "14px 22px",
          background: "#000",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Eliminar todos los favoritos
      </button>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {favorites.map((product) => (
          <div key={product.productId}>
            <ProductCard product={product} />

            <button
              onClick={() => removeFavorite(product.productId)}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "12px",
                border: "1px solid #111",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Quitar de favoritos
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Favorites;