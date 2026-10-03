import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "./api";
import "./scrapbook.css";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    product_name: "",
    description: "",
    price: "",
    quantity: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => {
        const p = res.data.product;
        setForm({
          product_name: p.product_name,
          description: p.description,
          price: p.price,
          quantity: p.quantity,
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load that product.");
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.put(`/products/${id}`, form);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.error || "Could not update product.");
    }
  };

  if (loading) return <div className="page-center">Loading...</div>;

  return (
    <div className="page-center">
      <div className="wrap-form">
        <div className="tape tape-form tape-brick"></div>
        <div className="card-form">
          <button onClick={() => navigate("/products")} className="back-link">
            ‹ Back to stock
          </button>
          <h1 className="form-title">Edit product</h1>
          <p className="form-lead">
            Update the page before it goes back on the shelf.
          </p>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label>Product name</label>
            <input
              type="text"
              value={form.product_name}
              onChange={(e) =>
                setForm({ ...form, product_name: e.target.value })
              }
              required
            />
            <label>Description</label>
            <textarea
              rows="3"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <label>Price (₱)</label>
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <label>Quantity</label>
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              required
            />
            <button type="submit" className="btn-add">
              Update product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
