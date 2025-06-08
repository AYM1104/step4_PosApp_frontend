// src/lib/sendToLine.ts

import { CartItem } from "@/types/product";

export const sendPurchaseToLine = async (
  userId: string,
  cartItems: CartItem[]
): Promise<boolean> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/line/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        cart_items: cartItems,
      }),
    });

    return res.ok;
  } catch (err) {
    console.error('[LINE送信エラー]', err);
    return false;
  }
};