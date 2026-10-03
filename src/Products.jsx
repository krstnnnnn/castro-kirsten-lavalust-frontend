import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./api";
import "./scrapbook.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [confirmTarget, setConfirmTarget] = useState(null); // product pending deletion
  const navigate = useNavigate();

  const totalTypes = products.length;
  const totalItems = products.reduce(
    (sum, p) => sum + Number(p.quantity || 0),
    0,
  );

  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.products);
    } catch (err) {
      setError("Failed to load products.");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const confirmDelete = async () => {
    if (!confirmTarget) return;
    await api.delete(`/products/${confirmTarget.id}`);
    setConfirmTarget(null);
    loadProducts();
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <div className="page-loose">
      <div className="wrap-wide">
        <div className="tape tape-left"></div>
        <div className="card">
          <div className="top-row">
            <div>
              <h1 className="title title-left">Tindahan ni Aling Nena</h1>
              <p className="subtitle">
                Shop 'til your wallet begs for mercy! — welcome back, admin.
              </p>
            </div>
            <div className="actions-top">
              <Link to="/products/create" className="btn btn-add">
                + Add product
              </Link>
              <button onClick={handleLogout} className="btn btn-logout">
                Logout
              </button>
            </div>
          </div>

          <div className="stats">
            <div className="stat">
              <p className="stat-label">Kinds of goods</p>
              <p className="stat-value">{totalTypes}</p>
            </div>
            <div className="stat">
              <p className="stat-label">Pieces in stock</p>
              <p className="stat-value">{totalItems}</p>
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <h2 className="section">Current stock</h2>

          {products.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 20px",
                color: "var(--ink-soft)",
              }}
            >
              <p>
                The shelves are bare. Add your first product to start the
                ledger.
              </p>
              <Link to="/products/create" className="btn btn-add">
                + Add product
              </Link>
            </div>
          ) : (
            <table>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th></th>
              </tr>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="item-name">{p.product_name}</div>
                    <div className="item-desc">{p.description}</div>
                  </td>
                  <td className="price">₱{Number(p.price).toFixed(2)}</td>
                  <td>{p.quantity}</td>
                  <td className="row-actions">
                    <Link to={`/products/edit/${p.id}`} className="btn-edit">
                      Edit
                    </Link>
                    <button
                      onClick={() => setConfirmTarget(p)}
                      className="btn-delete"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </table>
          )}
        </div>
      </div>

      {confirmTarget && (
        <div className="modal-backdrop" onClick={() => setConfirmTarget(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Wait a moment...</h3>
            <p>
              Remove <strong>{confirmTarget.product_name}</strong> from the
              shelf? This can't be undone.
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setConfirmTarget(null)}
                className="btn-cancel"
              >
                Keep it
              </button>
              <button
                onClick={confirmDelete}
                className="btn-add"
                style={{ background: "var(--brick)" }}
              >
                Remove it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
