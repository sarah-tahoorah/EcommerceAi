import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useApp } from "../context/AppContext";
import { useFadeIn } from "../hooks/useFadeIn";
import { useLocation, useNavigate } from "react-router-dom";

export function ProfilePage() {
  const { user, setUser } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [orders, setOrders] = useState([]);
  const [mode, setMode] = useState("login");
  const sectionRef = useFadeIn();
  const redirectTo = location.state?.redirectTo;

  useEffect(() => {
    if (user) api.get("/orders").then((r) => setOrders(r.data)).catch(() => undefined);
  }, [user]);

  useEffect(() => {
    if (user && redirectTo) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, redirectTo, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    const endpoint = mode === "login" ? "/auth/login" : "/auth/signup";
    const { data } = await api.post(endpoint, form);
    localStorage.setItem("glamora_token", data.token);
    localStorage.setItem("glamora_user", JSON.stringify(data.user));
    setUser(data.user);
    if (redirectTo) {
      navigate(redirectTo, { replace: true });
    }
  };

  if (!user) {
    return (
      <form onSubmit={submit} className="mx-auto max-w-md space-y-3 rounded-2xl card-soft p-6 fade-in" ref={sectionRef}>
        <h1 className="display-font text-3xl">{mode === "login" ? "Login" : "Signup"}</h1>
        {mode === "signup" && <input required placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} className="glam-input w-full rounded-lg px-3 py-2" />}
        <input required type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} className="glam-input w-full rounded-lg px-3 py-2" />
        <input required type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} className="glam-input w-full rounded-lg px-3 py-2" />
        <button className="w-full rounded-lg py-2 gold-button shimmer-button">{mode === "login" ? "Login" : "Create Account"}</button>
        <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-sm text-neutral-600">
          {mode === "login" ? "New user? Signup" : "Already have account? Login"}
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-6 fade-in" ref={sectionRef}>
      <h1 className="display-font text-3xl">Welcome, {user.name}</h1>
      <section className="rounded-2xl card-soft p-6">
        <h2 className="text-xl font-semibold">Orders</h2>
        {orders.map((o) => (
          <div key={o._id} className="mt-3 rounded-xl border border-purple-200 p-3">
            <p>Order #{o._id.slice(-6)}</p>
            <p>Status: {o.status}</p>
            <p>Total: Rs {o.total}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
