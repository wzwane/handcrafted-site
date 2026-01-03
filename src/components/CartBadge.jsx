import { useEffect, useState } from "preact/hooks";
import { cartCount } from "./cart.js";

export default function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(cartCount());
    update();
    window.addEventListener("cart:updated", update);
    return () => window.removeEventListener("cart:updated", update);
  }, []);

  if (!count) return null;
  return <span class="badge">{count}</span>;
}