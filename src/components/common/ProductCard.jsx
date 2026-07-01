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

  const hasDiscount = product.discount > 0;

  const finalPrice = hasDiscount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  return (
    <article className="product-card" style={{ position: "relative" }}>
      <button
        onClick={toggleFavorite}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          width: "38px",
          height: "38px",
          background: "#fff",
          color: "#111",
          border: "1px solid #ccc",
          fontSize: "22px",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        {isFavorite ? "♥" : "♡"}
      </button>

      {hasDiscount && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            background: "#d32f2f",
            color: "#fff",
            padding: "6px 10px",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "14px",
            zIndex: 10,
          }}
        >
          {product.discount}% OFF
        </div>
      )}

      <img src={image} alt={product.description} />

      <div className="product-info">
        <p className="product-brand">{product.brand?.brandName}</p>

        <h3>{product.description}</h3>

        {hasDiscount && (
          <p
            style={{
              textDecoration: "line-through",
              color: "#888",
              marginBottom: "4px",
            }}
          >
            ARS {product.price?.toLocaleString("es-AR")}
          </p>
        )}

        <p
          className="product-price"
          style={{
            color: hasDiscount ? "#d32f2f" : "#111",
            fontWeight: "bold",
            fontSize: "22px",
          }}
        >
          ARS {finalPrice.toLocaleString("es-AR")}
        </p>

        <Link to={`/product/${productId}`} className="product-button">
          Ver detalle
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;