// Shop: products from the real shop API (/products, same as the app) and a cart kept in this browser.
// The cart stores only product ids + quantities; prices always come fresh from the API, and the server re-prices orders.
import { useSyncExternalStore } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useLang } from "@/hooks/useLang";

export type Product = {
  _id: string; product_id: string; name: string; description?: string; name_hi?: string; description_hi?: string;
  price: number; original_price?: number; category?: string; subcategory?: string; featured_image?: string | null;
  stock_quantity: number; tags?: string[]; rating?: number | string; total_sales?: number;
};

export const useShopProducts = () =>
  useQuery({ queryKey: ["shop-products"], queryFn: async () => (await api<{ products: Product[] }>("/products?limit=100")).products, staleTime: 60_000 });

const fetchProduct = async (id: string) => (await api<{ product: Product }>(`/products/${encodeURIComponent(id)}`)).product;
export const useShopProduct = (id?: string) =>
  useQuery({ queryKey: ["shop-product", id], queryFn: () => fetchProduct(id!), enabled: !!id, retry: false });

/** Product name/description in the current language. */
export function useProductText() {
  const { lang } = useLang();
  return (p: Product | undefined, field: "name" | "description"): string => {
    if (!p) return "";
    if (lang !== "hi") return p[field] || "";
    return p[`${field}_hi`] || p[field] || "";
  };
}

// ---- cart store (localStorage, shared across tabs) ----
export type CartLine = { id: string; qty: number };
const KEY = "astromate-cart";
const read = (): CartLine[] => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v.filter((l) => typeof l?.id === "string" && l.qty > 0) : [];
  } catch { return []; }
};
let lines = read();
const listeners = new Set<() => void>();
const write = (next: CartLine[]) => {
  lines = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* private mode */ }
  listeners.forEach((l) => l());
};
window.addEventListener("storage", (e) => { if (e.key === KEY) { lines = read(); listeners.forEach((l) => l()); } });

export const MAX_QTY = 10;
export const cart = {
  add(id: string, qty = 1) {
    const cur = lines.find((l) => l.id === id)?.qty || 0;
    cart.set(id, cur + qty);
  },
  set(id: string, qty: number) {
    qty = Math.min(Math.floor(qty), MAX_QTY);
    write(qty > 0
      ? lines.some((l) => l.id === id) ? lines.map((l) => (l.id === id ? { ...l, qty } : l)) : [...lines, { id, qty }]
      : lines.filter((l) => l.id !== id));
  },
  remove: (id: string) => write(lines.filter((l) => l.id !== id)),
  clear: () => write([]),
};

export const useCart = () => useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb); }, () => lines);
export const useCartCount = () => useCart().reduce((n, l) => n + l.qty, 0);

/** Cart lines joined with fresh product data. product is null if it no longer exists / is inactive. */
export function useCartItems() {
  const ls = useCart();
  const qs = useQueries({ queries: ls.map((l) => ({ queryKey: ["shop-product", l.id], queryFn: () => fetchProduct(l.id), retry: false })) });
  const items = ls.map((l, i) => ({ ...l, product: qs[i]?.data ?? null, error: qs[i]?.isError ?? false }));
  const loading = qs.some((q) => q.isLoading);
  const valid = items.filter((i) => i.product && i.product.stock_quantity >= i.qty);
  const subtotal = valid.reduce((s, i) => s + Number(i.product!.price) * i.qty, 0);
  return { items, loading, valid, subtotal, ok: !loading && items.length > 0 && valid.length === items.length };
}

export const shippingFor = (subtotal: number) => (subtotal < 500 ? 50 : 0); // same rule as POST /orders
export const inr = (n: number) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
