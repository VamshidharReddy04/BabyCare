import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/api";
import { authHeader, getUser } from "../utils/auth";

const statusClass = (status) => {
  if (status === "Delivered") return "status-pill delivered";
  if (status === "Cancelled") return "status-pill cancelled";
  if (status === "Shipped" || status === "Out for Delivery") {
    return "status-pill shipping";
  }
  return "status-pill pending";
};

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const user = useMemo(() => getUser(), []);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.token) {
      navigate("/login?next=/my-orders");
      return;
    }

    if (user.isAdmin) {
      navigate("/admin");
      return;
    }

    const loadOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(apiUrl("/api/orders/mine"), {
          headers: authHeader(),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Could not fetch orders");
        }
        setOrders(data);
      } catch (err) {
        setError(err.message || "Could not fetch orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [navigate, user]);

  return (
    <div className="orders-page">
      <div className="orders-head">
        <h1>My Orders</h1>
        <Link className="btn-outline" to="/">
          Continue Shopping
        </Link>
      </div>

      {error && <div className="auth-error">{error}</div>}
      {loading ? (
        <p>Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div className="orders-empty">
          <p>You have no orders yet.</p>
          <Link to="/">Place your first order</Link>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <article className="order-card" key={order._id}>
              <div className="order-top">
                <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                <span className={statusClass(order.status)}>
                  {order.status}
                </span>
              </div>

              <p className="order-date">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              <div className="order-items">
                {order.orderItems?.slice(0, 3).map((item, idx) => (
                  <div className="summary-item" key={idx}>
                    <span>{item.name}</span>
                    <span>
                      ₹{Number(item.price * item.qty).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
                {order.orderItems?.length > 3 && (
                  <p className="order-more">
                    +{order.orderItems.length - 3} more item(s)
                  </p>
                )}
              </div>

              <div className="order-total-row">
                <strong>Total</strong>
                <strong>
                  ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                </strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
