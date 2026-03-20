import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function ScrollToTop() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const didHandleInitialLoad = useRef(false);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (didHandleInitialLoad.current) return;
    didHandleInitialLoad.current = true;

    const navEntry = performance.getEntriesByType("navigation")[0];
    const navType = navEntry?.type;

    if ((navType === "reload" || navType === "navigate") && pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [navigate, pathname]);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);

  return null;
}
