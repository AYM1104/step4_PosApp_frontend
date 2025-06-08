'use client';

import {
  useEffect,
  useRef,
  useImperativeHandle,
  ForwardedRef,
} from 'react';
import { forwardRef } from 'react';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';

type Props = {
  onDetect: (code: string) => void;
};

export type QRCodeScannerRef = {
  stop: () => void;
};

function QRCodeScannerBase({ onDetect }: Props, ref: ForwardedRef<QRCodeScannerRef>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const lastDetectedTimeRef = useRef<number>(0);
  const isProcessingScanRef = useRef<boolean>(false);
  const lastDetectedCodeRef = useRef<string | null>(null);
  const beepRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  useImperativeHandle(ref, () => ({
    stop: () => {
      controlsRef.current?.stop();
      // ✅ ビープ音を完全に停止
      if (beepRef.current) {
        beepRef.current.pause();           // 再生を止める
        beepRef.current.currentTime = 0;   // 再生位置をリセット
      }
    },
  }));

  useEffect(() => {
    beepRef.current = new Audio('/sound/barcode.mp3');
    const reader = new BrowserQRCodeReader();

    const startScanner = async () => {
      if (!videoRef.current) return;

      try {
        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result) => {
            if (!result) return;
            const now = Date.now();

            if (now - lastDetectedTimeRef.current < 3000) {
              isProcessingScanRef.current = false;
              return;
            }

            lastDetectedTimeRef.current = now;
            const code = result.getText();
            // ✅ 同じQRコードを連続で読み取らないようにする
            if (code === lastDetectedCodeRef.current) return;
            lastDetectedCodeRef.current = code;
            
            lastDetectedTimeRef.current = now;
            isProcessingScanRef.current = true;

            try {
              beepRef.current?.play().catch((e) => {
                console.warn('音声再生エラー', e);
              });
              onDetect(code);
            } finally {
              setTimeout(() => {
                isProcessingScanRef.current = false;
              }, 3000);
            }
          }
        );

        controlsRef.current = controls;
      } catch (err) {
        console.warn('[⚠️ スキャンエラー]', err);
      }
    };

    startScanner();

    return () => {
      controlsRef.current?.stop();
    };
  }, [onDetect]);

  return (
    <>
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

      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <Button variant="outlined" onClick={() => router.push('/')}>
          トップへ戻る
        </Button>
      </div>
    </>
  );
}

// ✅ ここで default export を実現（forwardRefを使って）
const QRCodeScanner = forwardRef(QRCodeScannerBase);
export default QRCodeScanner;