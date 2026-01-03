import { useEffect, useMemo, useState } from "preact/hooks";
import { getCart, updateQty, removeItem, cartSubtotal } from "./cart.js";

export default function CartClient() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const sync = () => setItems(getCart());
    sync();
    window.addEventListener("cart:updated", sync);
    return () => window.removeEventListener("cart:updated", sync);
  }, []);

  const subtotal = useMemo(() => cartSubtotal(), [items]);
  const shipping = useMemo(() => (subtotal >= 200 ? 0 : items.length ? 12 : 0), [subtotal, items]);
  const total = useMemo(() => Math.round((subtotal + shipping) * 100) / 100, [subtotal, shipping]);

  return (
    <div class="cartWrap">
      <section class="cartPanel">
        <h2 style="margin:0 0 10px;">Items</h2>

        {!items.length && (
          <p class="small" style="margin:0;">
            Your cart is empty. Add something from Clothing, Sculptures, or Jewelry.
          </p>
        )}

        {items.map((i) => (
          <div class="cartItem" key={i.id}>
            <img class="cartImg" src={i.image} alt={i.title} loading="lazy" />
            <div>
              <div style="display:flex; justify-content:space-between; gap:10px;">
                <div>
                  <div style="font-weight:700;">{i.title}</div>
                  <div class="small">{i.brand} • {i.category}</div>
                </div>
                <div style="font-weight:800;">${i.price}</div>
              </div>

              <div class="qtyRow" style="margin-top:10px;">
                <button class="qtyBtn" onClick={() => updateQty(i.id, i.qty - 1)} aria-label="Decrease quantity">−</button>
                <div class="qty">{i.qty}</div>
                <button class="qtyBtn" onClick={() => updateQty(i.id, i.qty + 1)} aria-label="Increase quantity">+</button>
                <button class="btn" style="margin-left:auto; max-width:140px;" onClick={() => removeItem(i.id)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      <aside class="stickyCta">
        <div class="cartPanel">
          <h2 style="margin:0 0 10px;">Summary</h2>

          <div class="totalRow"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div class="small" style="margin-top:6px;">Shipping: {shipping ? `$${shipping.toFixed(2)}` : items.length ? "Free" : "—"}</div>
          <hr style="border:0; border-top:1px solid var(--line); margin:12px 0;" />
          <div class="totalRow"><span>Total</span><span>${total.toFixed(2)}</span></div>

          <button class="btn primary" style="width:100%; margin-top:12px;" disabled={!items.length}>
            Checkout (demo)
          </button>
          <p class="small" style="margin:10px 0 0;">
            This is a demo cart. Connect Stripe/Shopify/Snipcart later.
          </p>
        </div>

        <div class="cartPanel">
          <div style="font-weight:800; margin-bottom:6px;">Revolve-style vibe, simplified</div>
          <div class="small">Fast pages, clean grids, add-to-cart islands.</div>
        </div>
      </aside>
    </div>
  );
}