// スマホやPCのカメラを使ってバーコードをスキャンするコンポーネント
// スキャンされたJANコードは `onDetect` コールバックを通じて親コンポーネントに渡される



'use client';

import { useEffect, useRef } from 'react';

// このコンポーネントが受け取るデータ型を定義
type Props = {
    onDetect:(code:string)=>void;
};

export default function BarcodScanner( { onDetect }: Props) {

    // 画面に表示されるvideoタグの「場所」を覚えておく変数
    const videoRef = useRef<HTMLVideoElement | null>(null);

    // 画面が表示された後に実行する処理
    useEffect(() => {

        // 1. カメラを起動
        const startCamera = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        };

        // 2. バーコードを検出する処理
        const detectBarcode = async () => {
            // 2-1. ブラウザがBarcodeDector APIに対応しているかを確認
            if (!window.BarcodeDetector) {
                alert('このブラウザはバーコードスキャンに対応していません。Chromeの最新版をお使いください。');
                return;
            }
            
            // 2-2. ean_13形式に対応したバーコード検出器を作成
            const detector = new window.BarcodeDetector({ formats: ['ean_13'] });

            // 2-3. 毎フレーム検出を試みるループ処理
            const scanLoop = async () => {
                if (videoRef.current && videoRef.current.readyState === 4) {
                    const barcodes = await detector.detect(videoRef.current);
                    // 最初に検出されたコードを親に渡す
                    if (barcodes.length > 0) {
                        onDetect(barcodes[0].rawValue);
                    }
                }
                // 次のフレームでも検出処理を繰り返す
                requestAnimationFrame(scanLoop);
            };
            // 検出ループ開始
            scanLoop();
        };
        // カメラ起動後にバーコード検出開始
        startCamera().then(detectBarcode);
    }, [onDetect]); // onDetectが変わったら再実行

    return (
        <video
        ref={videoRef}
        autoPlay
        style={{ width: '100%', maxWidth: '480px', borderRadius: '8px' }}
        />
    );
}
