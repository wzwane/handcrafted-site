const KEY = "astro_cart_v1";

export function getCart() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function setCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart:updated"));
}

export function addToCart(product, qty = 1) {
  const cart = getCart();
  const idx = cart.findIndex((i) => i.id === product.id);
  if (idx >= 0) cart[idx].qty += qty;
  else cart.push({ ...product, qty });
  setCart(cart);
}

export function updateQty(id, qty) {
  const cart = getCart().map((i) => (i.id === id ? { ...i, qty } : i));
  setCart(cart.filter((i) => i.qty > 0));
}

export function removeItem(id) {
  setCart(getCart().filter((i) => i.id !== id));
}

export function cartCount() {
  return getCart().reduce((sum, i) => sum + (i.qty || 0), 0);
}

export function cartSubtotal() {
  const total = getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
  return Math.round(total * 100) / 100;
}