import { useState } from "react";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const productId = product.productId;

  const image =
    product.images && product.images.length > 0
      ? `data:${product.images[0].fileType};base64,${product.images[0].image}`
      : "https://via.placeholder.com/300x300?text=Zapatilla";

  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    return favorites.some((item) => item.productId === productId);
  });

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (isFavorite) {
      const updatedFavorites = favorites.filter(
        (item) => item.productId !== productId
      );
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      localStorage.setItem("favorites", JSON.stringify([...favorites, product]));
      setIsFavorite(true);
    }
  };

  return (
    <article className="product-card" style={{ position: "relative" }}>
      <button onClick={toggleFavorite} style={{
        position: "absolute", top: "12px", right: "12px", width: "38px",
        height: "38px", background: "#fff", color: "#111",
        border: "1px solid #ccc", fontSize: "22px", cursor: "pointer", zIndex: 10,
      }}>
        {isFavorite ? "♥" : "♡"}
      </button>

      <img src={image} alt={product.description} />

      <div className="product-info">
        <p className="product-brand">{product.brand?.brandName}</p>
        <h3>{product.description}</h3>
        <p className="product-price">
          ARS {product.price?.toLocaleString("es-AR")}
        </p>

        <Link to={`/product/${productId}`} className="product-button">
          Ver detalle
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;