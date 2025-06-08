'use client';

import { useEffect, useRef } from 'react';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';

type Props = {
  onDetect: (code: string) => void;
};

export default function QRCodeScanner({ onDetect }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const lastDetectedTimeRef = useRef<number>(0);
  const isProcessingRef = useRef<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const reader = new BrowserQRCodeReader();

    const startScanner = async () => {
      if (!videoRef.current) return;

      try {
        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result) => {
            if (!result || isProcessingRef.current) return;

            const now = Date.now();
            if (now - lastDetectedTimeRef.current < 3000) return;

            const code = result.getText();
            isProcessingRef.current = true;
            lastDetectedTimeRef.current = now;

            onDetect(code);

            setTimeout(() => {
              isProcessingRef.current = false;
            }, 3000);
          }
        );
        controlsRef.current = controls;
      } catch (err) {
        console.warn('[⚠️ QRコード読み取りエラー]', err);
      }
    };

    startScanner();

    return () => {
      controlsRef.current?.stop();
    };
  }, [onDetect]);

  return (
    <>
      {/* 📷 カメラスキャナー */}
      <div
        style={{
          position: 'relative',
          width: 200,
          height: 170,
          margin: '0 auto',
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: '#000',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* 🕶️ グレーオーバーレイ */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            pointerEvents: 'none',
            clipPath: `
              polygon(
                0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%,
                10% 10%, 10% 90%, 90% 90%, 90% 10%, 10% 10%
              )
            `,
          }}
        />

        {/* ⬜ コーナー */}
        {['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].map((corner) => {
          const styles: Record<string, React.CSSProperties> = {
            topLeft: { top: '10%', left: '10%', borderTop: '4px solid white', borderLeft: '4px solid white' },
            topRight: { top: '10%', right: '10%', borderTop: '4px solid white', borderRight: '4px solid white' },
            bottomLeft: { bottom: '10%', left: '10%', borderBottom: '4px solid white', borderLeft: '4px solid white' },
            bottomRight: { bottom: '10%', right: '10%', borderBottom: '4px solid white', borderRight: '4px solid white' },
          };
          return (
            <div
              key={corner}
              style={{
                position: 'absolute',
                width: 24,
                height: 24,
                ...styles[corner],
                borderRadius: 4,
                pointerEvents: 'none',
              }}
            />
          );
        })}
      </div>

      {/* 🟦 トップへ戻るボタン */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <Button variant="outlined" onClick={() => router.push('/')}>
          トップへ戻る
        </Button>
      </div>
    </>
  );
}