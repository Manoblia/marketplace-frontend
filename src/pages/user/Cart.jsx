import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../../store/slices/cartSlice";
import { fetchProducts } from "../../store/slices/productsSlice";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: cart, loading } = useSelector((state) => state.cart);
  const { items: products } = useSelector((state) => state.products);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(fetchCart());
    dispatch(fetchProducts());
  }, [dispatch, navigate]);

  const getProductByVariantId = (variantId) => {
    return products.find((product) =>
      product.variants?.some((variant) => variant.variantId === variantId)
    );
  };

  const getProductImage = (product) => {
    if (product?.images && product.images.length > 0) {
      return `data:${product.images[0].fileType};base64,${product.images[0].image}`;
    }
    return "https://via.placeholder.com/300x300?text=Zapatilla";
  };

  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity < 0) return;
    dispatch(
      updateCartItem({
        cartItemId: item.cartItemId,
        variantId: item.variant.variantId,
        quantity: newQuantity,
      })
    );
  };

  const handleRemoveItem = (cartItemId) => {
    dispatch(removeCartItem(cartItemId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  if (loading || !cart) return <h2>Cargando carrito...</h2>;

  if (!cart.cartItems || cart.cartItems.length === 0) {
    return (
      <section className="cart-page">
        <h1>Tu Bolsa</h1>
        <h2>Tu carrito está vacío</h2>
      </section>
    );
  }

  const shipping = 12000;

  const subtotal = cart.cartItems.reduce((acc, item) => {
    const product = getProductByVariantId(item.variant.variantId);
    return acc + (product?.price || 0) * item.quantity;
  }, 0);

  const total = subtotal + shipping;

  return (
    <section className="cart-page">
      <h1>Tu Bolsa</h1>

      <div className="cart-layout">
        <div>
          {cart.cartItems.map((item) => {
            const product = getProductByVariantId(item.variant.variantId);

            return (
              <div className="cart-item" key={item.cartItemId}>
                <img
                  src={getProductImage(product)}
                  alt={product?.description}
                />

                <div className="cart-item-info">
                  <p className="product-brand">{product?.brand?.brandName}</p>

                  <h2>{product?.description}</h2>

                  <p>Talle: AR {item.variant.size}</p>

                  <div className="cart-quantity">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item, item.quantity - 1)
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        handleUpdateQuantity(item, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.cartItemId)}
                    style={{
                      marginTop: "15px",
                      padding: "10px",
                      border: "1px solid #111",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Eliminar producto
                  </button>
                </div>

                <strong>
                  ARS{" "}
                  {((product?.price || 0) * item.quantity).toLocaleString(
                    "es-AR"
                  )}
                </strong>
              </div>
            );
          })}
        </div>

        <aside className="cart-summary">
          <h2>Resumen</h2>

          <div>
            <span>Subtotal</span>
            <strong>ARS {subtotal.toLocaleString("es-AR")}</strong>
          </div>

          <div>
            <span>Envío</span>
            <strong>ARS {shipping.toLocaleString("es-AR")}</strong>
          </div>

          <hr />

          <div>
            <span>Total</span>
            <strong>ARS {total.toLocaleString("es-AR")}</strong>
          </div>

          <Link to="/checkout" className="detail-button">
            Finalizar compra
          </Link>

          <button
            onClick={handleClearCart}
            style={{
              width: "100%",
              padding: "18px",
              border: "1px solid #111",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Vaciar carrito
          </button>
        </aside>
      </div>
    </section>
  );
}

export default Cart;
