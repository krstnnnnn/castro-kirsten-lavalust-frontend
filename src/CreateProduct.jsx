import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import "./scrapbook.css";

export default function CreateProduct() {
  const [form, setForm] = useState({
    product_name: "",
    description: "",
    price: "",
    quantity: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/products", form);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.error || "Could not save product.");
    }
  };

  return (
    <div className="page-center">
      <div className="wrap-form">
        <div className="tape tape-form tape-sage"></div>
        <div className="card-form">
          <button onClick={() => navigate("/products")} className="back-link">
            ‹ Back to stock
          </button>
          <h1 className="form-title">Add a product</h1>
          <p className="form-lead">Write it down before it hits the shelf.</p>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label>Product name</label>
            <input
              type="text"
              placeholder="e.g. Sack of cloves"
              value={form.product_name}
              onChange={(e) =>
                setForm({ ...form, product_name: e.target.value })
              }
              required
            />
            <label>Description</label>
            <textarea
              rows="3"
              placeholder="What it is, where it's from"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <label>Price (₱)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <label>Quantity</label>
            <input
              type="number"
              placeholder="0"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              required
            />
            <button type="submit" className="btn-add">
              Save product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
