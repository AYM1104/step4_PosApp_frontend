// JANコードを使って、商品マスタから商品情報を取得する関数

import { Product } from "@/types/product";

const API_BASE = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const fetchProductByJanCode = async (janCode: string): Promise<Product | null> => {
  try {   
    const res = await fetch(`${API_BASE}/products/by-jan-code?jan_code=${janCode}`);
    if (!res.ok) throw new Error("商品が見つかりません");

    const data = await res.json();
    return data as Product;
  } catch (err) {
    console.error("商品取得エラー:", err);
    return null;
  }
};