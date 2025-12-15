import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  addedAt: number;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (product: Omit<WishlistItem, "addedAt">) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (product: Omit<WishlistItem, "addedAt">) => void;
  clearWishlist: () => void;
  getTotalItems: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const exists = get().items.some((item) => item.id === product.id);
        if (!exists) {
          set((state) => ({
            items: [...state.items, { ...product, addedAt: Date.now() }],
          }));
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      toggleItem: (product) => {
        const exists = get().isInWishlist(product.id);
        if (exists) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.length;
      },
    }),
    {
      name: "suqya-wishlist",
    }
  )
);
