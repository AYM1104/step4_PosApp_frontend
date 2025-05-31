// JANコードで商品マスタから商品情報を取得する



import { Product } from "@/types/product";

// FastAPIのエンドポイントを叩いて商品情報を取得する関数
export const fetchProductFromDB = async (janCode: string): Promise<Product | null> => {   
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/products/by-jan-code?jan_code=${janCode}`
        );
        if (!res.ok) return null;
        const data = await res.json();
        console.log('📦 fetchProductFromDB レスポンス:', data); // ←一時的に追加（確認用）
        return data;
    } catch (e) {
        console.error(`❌ 商品取得エラー: janCode=${janCode}`, e);
        return null;
    }
}