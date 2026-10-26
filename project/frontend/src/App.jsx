
import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./App.css";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/feedback`;

const courses = {
  "Full Stack Development": "3 months",
  "Web Development": "2 months",
  "Python Programming": "2 months",
  "Data Analytics": "4 months",
  "UI/UX Design": "2 months",
};

function Dashboard() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const response = await axios.get(API);
      setItems(response.data);
      setError("");
    } catch {
      setError("Could not load feedback. Check the backend and database.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id) {
    if (!window.confirm("Delete this feedback?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      await load();
    } catch {
      setError("Unable to delete this feedback.");
    }
  }

  const average = items.length
    ? (items.reduce((sum, item) => sum + item.rating, 0) / items.length).toFixed(1)
    : "0.0";

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h2>Feedback Dashboard</h2>
          <p>Review and manage course feedback.</p>
        </div>
        <Link className="primary" to="/add">+ Add Feedback</Link>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="stats">
        <article><span>Total Feedback</span><strong>{items.length}</strong></article>
        <article><span>Average Rating</span><strong>{average} / 5</strong></article>
        <article><span>Five-Star Reviews</span><strong>{items.filter(x => x.rating === 5).length}</strong></article>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <h3>Submitted Feedback</h3>
          <span>{items.length} records</span>
        </div>

        {loading ? <p className="message">Loading feedback...</p> :
          items.length === 0 ? (
            <p className="message">No feedback submitted yet. Select Add Feedback to get started.</p>
          ) : (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Course ID</th>
                    <th>Course Name</th>
                    <th>Course Duration</th>
                    <th>Comments</th>
                    <th>Overall Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item._id}>
                      <td><span className="id-tag">{item._id.slice(-6).toUpperCase()}</span></td>
                      <td>{item.courseName}</td>
                      <td>{item.courseDuration}</td>
                      <td className="comment">{item.comments}</td>
                      <td><span className="rating">★ {item.rating}/5</span></td>
                      <td>
                        <div className="actions">
                          <Link className="edit" to={`/edit/${item._id}`}>Update</Link>
                          <button className="delete" onClick={() => remove(item._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </section>
    </>
  );
}

function FeedbackForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);

  const [form, setForm] = useState({
    courseName: "",
    courseDuration: "",
    comments: "",
    rating: "5",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    axios.get(API)
      .then(response => {
        const item = response.data.find(x => x._id === id);
        if (!item) {
          setError("Feedback record not found.");
          return;
        }
        setForm({
          courseName: item.courseName,
          courseDuration: item.courseDuration,
          comments: item.comments,
          rating: String(item.rating),
        });
      })
      .catch(() => setError("Unable to load the feedback record."));
  }, [id]);

  function changeCourse(courseName) {
    setForm({
      ...form,
      courseName,
      courseDuration: courses[courseName] || "",
    });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      ...form,
      rating: Number(form.rating),
    };

    try {
      if (editing) {
        await axios.put(`${API}/${id}`, payload);
      } else {
        await axios.post(API, payload);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save feedback.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="form-panel">
      <p className="eyebrow">{editing ? "EDIT RECORD" : "NEW SUBMISSION"}</p>
      <h2>{editing ? "Update Feedback" : "Add Feedback"}</h2>
      <p className="subheading">Please complete the details below.</p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={submit}>
        <label htmlFor="course">Course Name *</label>
        <select
          id="course"
          value={form.courseName}
          onChange={event => changeCourse(event.target.value)}
          required
        >
          <option value="">Select a course</option>
          {Object.keys(courses).map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        {form.courseDuration && (
          <p className="duration-note">
            Course duration: <strong>{form.courseDuration}</strong>
          </p>
        )}

        <label htmlFor="comments">Feedback Comments *</label>
        <textarea
          id="comments"
          rows="5"
          minLength="3"
          maxLength="2000"
          placeholder="Write your feedback here..."
          value={form.comments}
          onChange={event => setForm({ ...form, comments: event.target.value })}
          required
        />

        <fieldset className="rating-field">
          <legend>Feedback Rating *</legend>
          <div className="stars">
            {[1, 2, 3, 4, 5].map(value => (
              <button
                key={value}
                type="button"
                className={value <= Number(form.rating) ? "chosen" : ""}
                onClick={() => setForm({ ...form, rating: String(value) })}
                aria-label={`${value} out of 5 stars`}
                aria-pressed={Number(form.rating) === value}
              >★</button>
            ))}
            <span>{form.rating} / 5</span>
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="button" className="secondary" onClick={() => navigate("/")}>
            Cancel
          </button>
          <button className="primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : editing ? "Save Changes" : "Submit Feedback"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <Link to="/" className="brand"><span>F</span> FeedbackHub</Link>
        <p className="nav-label">WORKSPACE</p>
        <NavLink end to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          ◫ &nbsp; Dashboard
        </NavLink>
        <NavLink to="/add" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          ＋ &nbsp; Add Feedback
        </NavLink>
        <div className="sidebar-footer">
          <span>MER N STACK PROJECT</span>
          <p>Feedback that helps courses improve.</p>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div><span>ADMIN WORKSPACE</span><h1>Feedback Management</h1></div>
          <div className="admin-badge"><span /> Administrator</div>
        </header>
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<FeedbackForm />} />
            <Route path="/edit/:id" element={<FeedbackForm />} />
            <Route path="*" element={<div className="panel"><h2>Page not found</h2><Link to="/">Return to Dashboard</Link></div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
