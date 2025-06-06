'use client';

import { useState, useEffect, useRef } from 'react';
import BarcodeScanner from '../BarcodeScanner_0';
import CartTable from '../CartTable';
import { Box, Button, Typography } from '@mui/material';




export default function ProductScanComponent() {
    // 状態の管理
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);





    const beepAudio = useRef<HTMLAudioElement | null>(null);

    // 	ビープ音を取得  ※コンポーネントがマウントされた時に１度だけ実行
    useEffect(() => {
        beepAudio.current = new Audio('/sound/barcode.mp3');
    }, []);

    // 音声再生を一度試みる関数（スマホでの自動再生制限を回避するため）
    const handleStartScan = () => {
        beepAudio.current?.play().catch((e) =>
        console.warn('📵 スマホの自動再生制限により音が鳴らない場合があります', e)
        );
        setIsScannerOpen(true);
    };




    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                商品をスキャンするステップ
            </Typography>

            {/* バーコードをスキャンするボタン */}
            <Button
                variant="contained"
                color="primary"
                onClick={handleStartScan}
                sx={{ mb: 3 }}
            >
                バーコードをスキャンする
            </Button>

            {/* 🛒 カート */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
            <CartTable
                items={cartItems}
                onDelete={(janCode: string) =>
                setCartItems((items) => items.filter((i) => i.jan_code !== janCode))
                }
            />
            </Box>

            {/* 会計ボタン */}
            <Box display="flex" justifyContent="flex-end" sx={{ mb: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsScannerOpen(true)}
                    sx={{ mb: 3 }}
                >
                    会計する
                </Button>
            </Box>
            
            

        </Box>
    );
}