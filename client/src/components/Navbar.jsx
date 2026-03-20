import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Mic } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useVoiceSearch } from "../hooks/useVoiceSearch";
import { useState } from "react";

export function Navbar() {
  const { cart, user, setUser } = useApp();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const voice = useVoiceSearch((text) => {
    setSearch(text);
    navigate(`/category?search=${encodeURIComponent(text)}`);
  });

  const submit = (e) => {
    e.preventDefault();
    navigate(`/category?search=${encodeURIComponent(search)}`);
  };

  const logout = () => {
    localStorage.removeItem("glamora_token");
    localStorage.removeItem("glamora_user");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="glass-nav sticky top-0 z-30 border-b border-black/5 shadow-[0_8px_18px_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
        <Link to="/" className="display-font text-2xl font-semibold tracking-[0.35em] glam-gradient">
          GLAMORA
        </Link>
        <form
          onSubmit={submit}
          className="flex flex-1 items-center gap-2 rounded-full border border-black/5 bg-[#e5e7eb] px-4 py-2 text-text-primary shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
        >
          <Search size={18} className="text-[#7c3aed]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fashion, sarees, kurti..."
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-secondary focus:outline-none"
          />
          {voice.supported && (
            <button type="button" onClick={voice.start} className="rounded-full bg-[#f5f3ff] p-2 text-[#7c3aed] hover:text-text-primary">
              <Mic size={16} />
            </button>
          )}
        </form>
        <NavLink
          to="/veinglow-finder"
          className={({ isActive }) => `nav-link text-sm font-medium ${isActive ? "nav-link-active" : ""}`}
        >
          VeinGlow Finder
        </NavLink>
        {user ? (
          <>
            <NavLink to="/profile" className={({ isActive }) => `nav-link text-sm font-medium ${isActive ? "nav-link-active" : ""}`}>
              Profile
            </NavLink>
            <button onClick={logout} className="nav-link text-sm font-medium">
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/profile" className={({ isActive }) => `nav-link text-sm font-medium ${isActive ? "nav-link-active" : ""}`}>
            Login
          </NavLink>
        )}
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `relative flex h-11 w-11 items-center justify-center rounded-full border border-black/5 bg-white ${isActive ? "text-[#7c3aed] shadow-[0_4px_12px_rgba(0,0,0,0.08)]" : "text-text-secondary hover:text-text-primary"}`
          }
        >
          <ShoppingBag />
          <span className="absolute -right-2 -top-2 min-w-5 rounded-full bg-[#ff2e63] px-1.5 text-center text-xs text-white shadow-[0_4px_12px_rgba(255,46,99,0.18)]">
            {cart.length}
          </span>
        </NavLink>
      </div>
    </header>
  );
}
