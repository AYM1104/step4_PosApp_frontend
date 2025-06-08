// src/lib/sendToLine.ts

import { CartItem } from "@/types/product";

export const sendPurchaseToLine = async (
  userId: string,
  cartItems: CartItem[]
): Promise<boolean> => {
  const payload = {
    user_id: userId,
    cart_items: cartItems,
  };

  console.log("📤 送信payload:", JSON.stringify(payload, null, 2)); // 👈ここ追加

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/line/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (err) {
    console.error('[LINE送信エラー]', err);
    return false;
  }
};