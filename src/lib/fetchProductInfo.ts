// JANコードを使ってJANコードAPIから商品情報を取得する


import { Product } from "@/types/product";

// envからJANコードのAPIキーを取得
const JAN_CODE_API_KEY = process.env.NEXT_PUBLIC_JANCODE_API_KEY!;


// JANコードを使って商品情報を取得する関数
export const fetchProductInfoByJan = async (janCode: string): Promise<Product | null> => {
    
    // 1. APIのベースURL
    const baseUrl = "https://api.jancodelookup.com/" ;

    // 2. 検索パラメータの組み立て
    const params = new URLSearchParams({
        appId: JAN_CODE_API_KEY,    // アプリID（APIキー）
        query: janCode,             // 検索ワード（JANコードで検索）
        hits: '1',                  // 一度に取得する件数
        page: '1',                  // 取得ページ数
    });

    // 3. リクエストURL
    const url = `${baseUrl}?${params.toString()}`;

    // 4. 商品情報を取得する処理
    try {
        // APIにリクエストを送信
        const res = await fetch(url);
        console.log('[🌐 ステータスコード]', res.status);

        // ステータスコードが２００番以外ならエラー扱いにする
        if (!res.ok) throw new Error('JANコードAPI取得失敗： ${res.status}');

        // レスポンスをJSON形式で取得
        const data = await res.json();
        console.log('[📦 レスポンスデータ]', data);

        // 商品データが存在するかチェック（存在すれば最初の1件を取り出す）
        const item = data.product?.[0];
        if (!item) return null;

        // 商品データを整形して返す（Product型に沿って）
        return {
        jan_code: janCode,
        name: item.itemName,
        image_url: item.itemImageUrl,
        };
    } catch (error) {
        // ネットワークエラーやパースエラー時の処理
        console.error('[JANコード商品取得エラー]', error);
        return null;
    }
};
