import { useCallback, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../../store/slices/productsSlice";
import { addToCart } from "../../store/slices/cartSlice";

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    selectedProduct: product,
    loading,
    error,
  } = useSelector((state) => state.products);

  const user = useSelector((state) => state.auth.user);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
    setSelectedVariant(null);
    setQuantity(1);
  }, [dispatch, id]);

  const increaseQuantity = useCallback(() => {
    if (selectedVariant && quantity < selectedVariant.stock) {
      setQuantity((prev) => prev + 1);
    }
  }, [selectedVariant, quantity]);

  const decreaseQuantity = useCallback(() => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  }, [quantity]);

  const handleAddToCart = async () => {
    if (!user) {
      alert("Tenés que iniciar sesión para agregar al carrito");
      navigate("/login");
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

    const result = await dispatch(
      addToCart({
        variantId: selectedVariant.variantId,
        quantity,
      })
    );

    if (addToCart.fulfilled.match(result)) {
      alert("Producto agregado al carrito");
      navigate("/cart");
    } else {
      alert(result.payload || "No se pudo agregar al carrito");
    }
  };

  if (loading) {
    return <h2>Cargando producto...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!product) {
    return <h2>No se encontró el producto.</h2>;
  }

  const {
    description,
    price,
    discount,
    brand,
    category,
    variants,
    images,
  } = product;

  const hasDiscount = discount > 0;

  const finalPrice = hasDiscount
    ? price - (price * discount) / 100
    : price;

  const image =
    images?.length > 0
      ? `data:${images[0].fileType};base64,${images[0].image}`
      : "https://via.placeholder.com/500x500?text=Zapatilla";

  return (
    <section className="product-detail">
      <div className="product-detail-image">
        <img src={image} alt={description} />
      </div>

      <div className="product-detail-info">
        <p className="product-brand">
          {brand?.brandName}
        </p>

        <h1>{description}</h1>

        {hasDiscount && (
          <p
            style={{
              display: "inline-block",
              background: "#d32f2f",
              color: "#fff",
              padding: "6px 10px",
              borderRadius: "6px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            {discount}% OFF
          </p>
        )}

        {hasDiscount && (
          <p
            style={{
              textDecoration: "line-through",
              color: "#888",
              fontSize: "20px",
              margin: "8px 0",
            }}
          >
            ARS {price?.toLocaleString("es-AR")}
          </p>
        )}

        <h2
          style={{
            color: hasDiscount ? "#d32f2f" : "#111",
          }}
        >
          ARS {finalPrice?.toLocaleString("es-AR")}
        </h2>

        <p className="detail-description">
          Categoría: {category?.categoryName}
        </p>

        <div className="sizes">
          <p>Seleccionar talle</p>

          <div>
            {variants?.map((variant) => {
              const withoutStock = variant.stock <= 0;

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
                      selectedVariant?.variantId === variant.variantId
                        ? "#000"
                        : "#fff",
                    color:
                      selectedVariant?.variantId === variant.variantId
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
                Stock disponible:
                <strong> {selectedVariant.stock}</strong> unidades
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                <button onClick={decreaseQuantity}>-</button>

                <span>Cantidad: {quantity}</span>

                <button onClick={increaseQuantity}>+</button>
              </div>
            </>
          )}
        </div>

        <button
          onClick={handleAddToCart}
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
