// POSアプリで使用する商品関連の型定義ファイル



// 商品の基本情報
export type Product = {
    jan_code: string;       // JANコード
    name: string;           // 商品名
    price?: number;         // 価格（任意）
    image_url?: string;     // 商品画像のURL（任意）
} 

// 商品の情報に数量を追加した型（カートでの利用を想定）
export type ProductWithQuantity = Product & {
    quantity: number;   // 商品の購入数
}

// バーコードがスキャンされた時に取得する情報
export type ScanTrigger = {
    code: string;           // スキャンされたJANコード
    timestamp: number;      // スカｙんされた時刻
}

// 楽天APIから取得した商品情報
export type RakutenProductInfo = {
  itemName: string;
  genreId: string;
};

// 楽天APIから取得した商品ジャンル情報
// export type ProductGenreInfo = {
//   itemName: string;
//   genreId: string;
//   genreHierarchy: string;
// };