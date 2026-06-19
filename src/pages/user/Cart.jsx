import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../../api/api";

function Cart() {
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch(`${API_URL}/api/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCart(data));

    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [token]);

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

  const updateQuantity = async (item, newQuantity) => {
    if (newQuantity < 0) return;

    const response = await fetch(`${API_URL}/api/cart/items/${item.cartItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        variantId: item.variant.variantId,
        quantity: newQuantity,
      }),
    });

    if (response.ok) {
      const updatedCart = await response.json();
      setCart(updatedCart);
    } else {
      alert("No se pudo actualizar la cantidad");
    }
  };

  const removeItem = async (cartItemId) => {
    const response = await fetch(`${API_URL}/api/cart/items/${cartItemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setCart((prevCart) => ({
        ...prevCart,
        cartItems: prevCart.cartItems.filter(
          (item) => item.cartItemId !== cartItemId
        ),
      }));
    }
  };

  const clearCart = async () => {
    const response = await fetch(`${API_URL}/api/cart`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setCart((prevCart) => ({
        ...prevCart,
        cartItems: [],
      }));
    }
  };

  if (!cart) return <h2>Cargando carrito...</h2>;

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
                <img src={getProductImage(product)} alt={product?.description} />

                <div className="cart-item-info">
                  <p className="product-brand">{product?.brand?.brandName}</p>

                  <h2>{product?.description}</h2>

                  <p>Talle: AR {item.variant.size}</p>

                  <div className="cart-quantity">
                    <button
                      onClick={() => updateQuantity(item, item.quantity - 1)}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.cartItemId)}
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
            onClick={clearCart}
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