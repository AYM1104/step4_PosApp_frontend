'use client';

import { useState } from "react";
import { Box, Typography} from "@mui/material";

// カスタムコンポーネント
import ScanButton from "./compornents/ScanButton";    // スキャンボタン
import BarcodeScanner from "./compornents/BarcodeScanner"; // スキャナー追加
import ScannedItemTable from "./compornents/ScannedItemTable"; // スキャンアイテムテーブル追加
import CartTable from "./compornents/CartTable";  // 購入カートアイテムテーブル

import { ScanItem, CartItem } from "@/types/product";
import { fetchProductByJanCode } from "@/lib/fetchProductByJanCode";  // 商品取得関数

import { postTransaction } from "@/lib/postTransaction";


export default function ScanPage() {
  
  // スキャナー表示状態の管理
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  // 読み取ったコードを保存
  // const [scannedCode, setScannedCode] = useState<string | null>(null);
  // スキャン済み商品の配列
  const [scannedItems, setScannedItems] = useState<ScanItem[]>([]);
  // スキャン処理中かどうか
  const [isProcessingScan, setIsProcessingScan] = useState(false); 
  // 購入カートの配列
  const [cartItems, setCartItems] = useState<CartItem[]>([]);



  // スキャンボタンを押したとき：スキャナーを開く
  const handleScanButtonClick = () => {
    setIsScannerOpen(true);
  };

  // スキャン後に商品マスタからJANコードで商品情報を取得して表示
  const handleDetected = async (code: string) => {
    if (isProcessingScan) return; // ✅ 重複処理防止
    setIsProcessingScan(true);

    try {
      // setScannedCode(code);
      // setIsScannerOpen(false);

      const product = await fetchProductByJanCode(code);

      if (!product) {
        alert("商品が見つかりませんでした");
        return;
      }

      // すでに追加されている場合はスキップ（重複チェック）
      const alreadyExists = scannedItems.some(item => item.jan_code === product.jan_code);
      if (alreadyExists) return;

      // 商品情報をスキャンアイテムテーブルに追加
      const item: ScanItem = {
        jan_code: product.jan_code,
        name: product.name,
        price: product.price ?? 0,
      };

      setScannedItems(prev => [...prev, item]);
    } finally {
      setTimeout(() => {
        setIsProcessingScan(false);
      }, 3000); // ✅ 3秒間スキャン禁止
    }
  };

  // カートに追加する処理
  const handleAddToCart = (janCode: string) => {
    const item = scannedItems.find(i => i.jan_code === janCode);
    if (!item) return;

    setCartItems(prev => {
      const existing = prev.find(i => i.jan_code === janCode);
      if (existing) {
        return prev.map(i =>
          i.jan_code === janCode ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });


    // スキャンアイテムテーブルから削除
    setScannedItems(prev => prev.filter(i => i.jan_code !== janCode));
  };


  

  // 以下、ページ描画
  return (
    <Box p={2}>
      {/* アプリタイトル部分 */}
      <Box mb={2}>
        <Typography variant="h5">POSアプリ</Typography>
      </Box>

      <Box
        display="flex"
        alignItems="flex-start" // ← 上揃え
        gap={2} // ← ボタンとカメラの間にスペース
        mb={2}
      >
        {/* 左側：スキャンボタン */}
        <ScanButton onClick={handleScanButtonClick} />

        {/* 右側：カメラ映像 */}
        {isScannerOpen && (
          <Box minWidth={320}>
            <BarcodeScanner onDetect={handleDetected} />
          </Box>
        )}
      </Box>

      {/* 読み取った商品情報を表示 */}
      <Box>
        {scannedItems.length > 0 && (
          <ScannedItemTable items={scannedItems} onAddToCart={handleAddToCart} />
        )}
      </Box>
      <Box>
        {cartItems.length > 0 && (
          <CartTable items={cartItems} onDelete={(janCode) => {
            setCartItems(prev => prev.filter(item => item.jan_code !== janCode));
          }} />
        )}
      </Box>
      <Box mt={4}>
        {cartItems.length > 0 && (
          <Box mt={2} display="flex" justifyContent="flex-end">
            <button
              onClick={async () => {
                try {
                  await postTransaction(cartItems);
                  alert("購入が完了しました！");
                  setCartItems([]); // ✅ カートをクリア
                  setIsScannerOpen(false); // ✅ カメラを閉じる
                } catch (err) {
                  alert("購入処理に失敗しました");
                  console.error(err);
                }
              }}
              style={{
                backgroundColor: "#4caf50",
                color: "#fff",
                padding: "12px 24px",           // 少し大きめに調整
                border: "none",
                borderRadius: "6px",
                fontSize: "20px",               // 👈 フォントサイズを大きく
                fontWeight: "bold",            // 👈 太字で目立たせる
                cursor: "pointer",
              }}
            >
              購入する
            </button>
          </Box>
        )}
      </Box>
    </Box>
  );
}