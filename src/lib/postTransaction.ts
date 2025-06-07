// src/lib/postTransaction.ts

import { CartItem } from "@/types/product";

export const postTransaction = async (items: CartItem[]) => {
  const payload = {
    items: items.map((item) => ({
      jan_code: item.jan_code,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("取引登録に失敗しました");
  }

  return res.json();
};