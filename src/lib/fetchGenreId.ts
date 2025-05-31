
// const RAKUTEN_APP_ID = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID!;


// // JANコードを使って楽天ジャンルIDを取得する関数
// export const fetchGenreIdByJanCode = async (janCode: string): Promise<string | null> => {
//     console.log('[🔐 RAKUTEN_APP_ID]', RAKUTEN_APP_ID);

//     // 1. APIのベースURL
//     const baseUrl = "https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601"

//     // 2. 検索パラメータの組み立て
//     const params = new URLSearchParams({
//         applicationId: RAKUTEN_APP_ID ,  // アプリID（APIキー）
//         keyword: janCode,        // 検索ワード（JANコードを使用）
//         format: "json",                 // レスポンス形式
//         hits: '1',                  // 一度に取得する件数
//         page: '1',                  // 取得ページ数
//     });

//     // 3. リクエストURL
//     const url = `${baseUrl}?${params.toString()}`;
//     console.log('[🧪 リクエストURL]', url); 

//     // 4. 商品情報を取得する処理
//     try {
//         // APIにリクエストを送信
//         const res = await fetch(url);
//         console.log('[🌐 ステータスコード]', res.status);

//         // ステータスコードが２００番以外ならエラー扱いにする
//         if (!res.ok) throw new Error('楽天商品検索API失敗: ${res.status}');

//         // レスポンスをJSON形式で取得
//         const data = await res.json();
//         console.log('[📦 レスポンスデータ]', data);

//         // 商品データが存在するかチェック（存在すれば最初の1件を取り出す）
//         const item = data.Items?.[0]?.Item;
//         if (!item) return null;

//         // 商品データを整形して返す（RakutenProductInfo型に沿って）
//         return item.genreId ?? null;

//     } catch (error) {
//         console.error('[楽天ジャンルID取得エラー]', error);
//         return null;
//     }
// };