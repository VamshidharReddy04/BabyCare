import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/api";
import { authHeader, getUser } from "../utils/auth";
import { clearCart, getCart } from "../utils/cart";

const toObjectId = (id) => id.toString(16).padStart(24, "0").slice(-24);

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => getCart());
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [shipping, setShipping] = useState({
    street: "",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "",
    country: "India",
  });

  const user = useMemo(() => getUser(), []);

  useEffect(() => {
    if (!user?.token) {
      navigate("/login?next=/checkout");
      return;
    }

    if (user.isAdmin) {
      navigate("/admin");
    }
  }, [navigate, user]);

  const itemsPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingPrice = itemsPrice >= 999 ? 0 : 59;
  const taxPrice = Math.round(itemsPrice * 0.05);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setPlacing(true);

    try {
      const payload = {
        orderItems: cart.map((item) => ({
          product: toObjectId(item.id),
          name: item.name,
          image: "",
          price: item.price,
          qty: item.qty,
        })),
        shippingAddress: shipping,
        paymentMethod: "COD",
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      const res = await fetch(apiUrl("/api/orders"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Order failed");
      }

      clearCart();
      setCart([]);
      navigate("/my-orders?new=1");
    } catch (err) {
      setError(err.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-wrap">
        <div>
          <h1>Customer Checkout</h1>
          <p>Review your cart and place your order.</p>

          {error && <div className="auth-error">{error}</div>}

          <form className="checkout-form" onSubmit={placeOrder}>
            <input
              type="text"
              placeholder="Street address"
              value={shipping.street}
              onChange={(e) =>
                setShipping((s) => ({ ...s, street: e.target.value }))
              }
              required
            />
            <input
              type="text"
              placeholder="City"
              value={shipping.city}
              onChange={(e) =>
                setShipping((s) => ({ ...s, city: e.target.value }))
              }
              required
            />
            <div className="checkout-grid-2">
              <input
                type="text"
                placeholder="State"
                value={shipping.state}
                onChange={(e) =>
                  setShipping((s) => ({ ...s, state: e.target.value }))
                }
                required
              />
              <input
                type="text"
                placeholder="Pincode"
                value={shipping.pincode}
                onChange={(e) =>
                  setShipping((s) => ({ ...s, pincode: e.target.value }))
                }
                required
              />
            </div>
            <button className="btn-primary" disabled={placing} type="submit">
              {placing ? "Placing order..." : "Place Order (COD)"}
            </button>
          </form>
        </div>

        <aside className="checkout-summary">
          <h3>Order Summary</h3>
          {cart.length === 0 ? (
            <p>
              No items selected. <Link to="/">Go shopping</Link>
            </p>
          ) : (
            <>
              {cart.map((item) => (
                <div className="summary-item" key={item.id}>
                  <span>{item.name}</span>
                  <span>
                    ₹{(item.price * item.qty).toLocaleString("en-IN")} x{" "}
                    {item.qty}
                  </span>
                </div>
              ))}
              <hr />
              <div className="summary-item">
                <span>Items</span>
                <span>₹{itemsPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="summary-item">
                <span>Shipping</span>
                <span>₹{shippingPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="summary-item">
                <span>Tax</span>
                <span>₹{taxPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="summary-item total">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
