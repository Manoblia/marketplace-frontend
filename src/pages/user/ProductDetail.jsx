import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API_URL from "../../api/api";

function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((error) =>
        console.error("Error al cargar producto:", error)
      );
  }, [id]);

  const increaseQuantity = () => {
    if (
      selectedVariant &&
      quantity < selectedVariant.stock
    ) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Tenés que iniciar sesión para agregar al carrito");
      window.location.href = "/login";
      return;
    }

    if (!selectedVariant) {
      alert("Seleccioná un talle");
      return;
    }

    if (selectedVariant.stock <= 0) {
      alert("Este talle no tiene stock disponible");
      return;
    }

    const response = await fetch(
      `${API_URL}/api/cart/items`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          variantId: selectedVariant.variantId,
          quantity: quantity,
        }),
      }
    );

    if (response.ok) {
      alert("Producto agregado al carrito");
      window.location.href = "/cart";
    } else {
      alert("No se pudo agregar al carrito");
    }
  };

  if (!product) {
    return <h2>Cargando producto...</h2>;
  }

  const image =
    product.images && product.images.length > 0
      ? `data:${product.images[0].fileType};base64,${product.images[0].image}`
      : "https://via.placeholder.com/500x500?text=Zapatilla";

  return (
    <section className="product-detail">
      <div className="product-detail-image">
        <img
          src={image}
          alt={product.description}
        />
      </div>

      <div className="product-detail-info">
        <p className="product-brand">
          {product.brand?.brandName}
        </p>

        <h1>{product.description}</h1>

        <h2>
          ARS {product.price?.toLocaleString("es-AR")}
        </h2>

        <p className="detail-description">
          Categoría: {product.category?.categoryName}
        </p>

        <div className="sizes">
          <p>Seleccionar talle</p>

          <div>
            {product.variants?.map((variant) => {
              const withoutStock =
                variant.stock <= 0;

              return (
                <button
                  key={variant.variantId}
                  disabled={withoutStock}
                  onClick={() => {
                    setSelectedVariant(variant);
                    setQuantity(1);
                  }}
                  style={{
                    background:
                      selectedVariant?.variantId ===
                      variant.variantId
                        ? "#000"
                        : "#fff",
                    color:
                      selectedVariant?.variantId ===
                      variant.variantId
                        ? "#fff"
                        : withoutStock
                        ? "#aaa"
                        : "#111",
                    border: withoutStock
                      ? "1px solid #ddd"
                      : "1px solid #111",
                    cursor: withoutStock
                      ? "not-allowed"
                      : "pointer",
                    opacity: withoutStock ? 0.5 : 1,
                  }}
                >
                  {variant.size}
                </button>
              );
            })}
          </div>

          {selectedVariant && (
            <>
              <p style={{ marginTop: "12px" }}>
                Stock disponible:{" "}
                <strong>
                  {selectedVariant.stock}
                </strong>{" "}
                unidades
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                <button
                  onClick={decreaseQuantity}
                >
                  -
                </button>

                <span>
                  Cantidad: {quantity}
                </span>

                <button
                  onClick={increaseQuantity}
                >
                  +
                </button>
              </div>
            </>
          )}
        </div>

        <button
          onClick={addToCart}
          className="detail-button"
        >
          Añadir al carrito
        </button>

        <Link
          to="/products"
          className="back-link"
        >
          Volver a productos
        </Link>
      </div>
    </section>
  );
}

export default ProductDetail;