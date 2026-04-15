import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../utils/api";
import { authHeader, getUser } from "../utils/auth";

const STATUS_OPTIONS = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export default function AdminPage() {
  const user = useMemo(() => getUser(), []);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    if (!user?.token) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(apiUrl("/api/orders"), {
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

  const loadUsers = async () => {
    if (!user?.token) return;
    try {
      const res = await fetch(apiUrl("/api/users"), {
        headers: authHeader(),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Could not fetch users");
      }
      setUsers(data);
    } catch (err) {
      setError(err.message || "Could not fetch users");
    }
  };

  useEffect(() => {
    loadOrders();
    loadUsers();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(apiUrl(`/api/orders/${id}/status`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Status update failed");
      }

      setOrders((prev) => prev.map((o) => (o._id === data._id ? data : o)));
    } catch (err) {
      setError(err.message || "Status update failed");
    }
  };

  const removeOrder = async (id) => {
    try {
      const res = await fetch(apiUrl(`/api/orders/${id}`), {
        method: "DELETE",
        headers: authHeader(),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Order removal failed");
      }

      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      setError(err.message || "Order removal failed");
    }
  };

  const toggleBanUser = async (targetUser) => {
    try {
      const res = await fetch(apiUrl(`/api/users/${targetUser._id}/ban`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify({ isBanned: !targetUser.isBanned }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "User update failed");
      }

      setUsers((prev) =>
        prev.map((u) => (u._id === data._id ? { ...u, ...data } : u)),
      );
    } catch (err) {
      setError(err.message || "User update failed");
    }
  };

  const removeUser = async (id) => {
    try {
      const res = await fetch(apiUrl(`/api/users/${id}`), {
        method: "DELETE",
        headers: authHeader(),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "User removal failed");
      }

      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      setError(err.message || "User removal failed");
    }
  };

  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const revenue = orders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);
  const customerUsers = users.filter((u) => !u.isAdmin);
  const activeCustomers = customerUsers.filter((u) => !u.isBanned).length;
  const bannedCustomers = customerUsers.filter((u) => u.isBanned).length;

  if (!user?.token) {
    return (
      <div className="admin-page">
        <div className="admin-shell">
          <h1>Admin Panel</h1>
          <p>
            Please <Link to="/login?next=/admin">sign in</Link> with an admin
            account.
          </p>
        </div>
      </div>
    );
  }

  if (!user.isAdmin) {
    return (
      <div className="admin-page">
        <div className="admin-shell">
          <h1>Admin Panel</h1>
          <p>This page is for admin users only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <div className="admin-banner">
          <div>
            <h1>Admin Order Desk</h1>
            <p>Approve customer purchases and manage delivery workflow.</p>
          </div>
          <div className="admin-banner-actions">
            <Link className="btn-outline" to="/">
              Back to Dashboard
            </Link>
            <button
              className="btn-outline"
              onClick={() => {
                loadOrders();
                loadUsers();
              }}
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Delivered</span>
            <strong>{deliveredCount}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Revenue</span>
            <strong>₹{revenue.toLocaleString("en-IN")}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Customers</span>
            <strong>{customerUsers.length}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Active Customers</span>
            <strong>{activeCustomers}</strong>
          </div>
          <div className="admin-stat-card">
            <span>Banned Customers</span>
            <strong>{bannedCustomers}</strong>
          </div>
        </div>
        {error && <div className="auth-error">{error}</div>}

        <section className="admin-section">
          <div className="admin-section-head">
            <h2>Order Desk</h2>
            <p>Track, update, and remove customer orders.</p>
          </div>

          {loading ? (
            <p className="admin-subtext">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="admin-subtext">No customer orders yet.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Update</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <span className="admin-order-id">
                          #{order._id.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td>{order.user?.name || "Customer"}</td>
                      <td>{order.orderItems?.length || 0}</td>
                      <td>
                        ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                      </td>
                      <td>
                        <span
                          className={`status-pill ${order.status.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="admin-select"
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(order._id, e.target.value)
                          }
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          className="admin-danger"
                          onClick={() => removeOrder(order._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="admin-users-block">
          <div className="admin-section-head">
            <h2>Customer Users</h2>
            <p>Ban, unban, and delete customer accounts.</p>
          </div>
          <p className="admin-note">
            Deleted users are removed permanently from this list.
          </p>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Ban/Unban</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.isAdmin ? "Admin" : "Customer"}</td>
                      <td>
                        <span
                          className={`status-pill ${u.isBanned ? "cancelled" : "delivered"}`}
                        >
                          {u.isBanned ? "Banned" : "Active"}
                        </span>
                      </td>
                      <td>
                        {u.isAdmin ? (
                          <span className="admin-protected">Protected</span>
                        ) : (
                          <button
                            className="admin-action"
                            onClick={() => toggleBanUser(u)}
                          >
                            {u.isBanned ? "Unban" : "Ban"}
                          </button>
                        )}
                      </td>
                      <td>
                        {u.isAdmin ? (
                          <span className="admin-protected">Protected</span>
                        ) : (
                          <button
                            className="admin-danger"
                            onClick={() => removeUser(u._id)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
