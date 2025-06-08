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
  const beepRef = useRef<HTMLAudioElement | null>(null);
  const lastDetectedCodeRef = useRef<string | null>(null);
  const hasDetectedRef = useRef<boolean>(false); // 👈 一度読み取りを防ぐ
  const router = useRouter();

  useImperativeHandle(ref, () => ({
    stop: () => {
      controlsRef.current?.stop();
      hasDetectedRef.current = false; // 👈 次回のためにリセット
      if (beepRef.current) {
        beepRef.current.pause();
        beepRef.current.currentTime = 0;
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
            if (!result || hasDetectedRef.current) return;

            const code = result.getText();
            if (code === lastDetectedCodeRef.current) return;

            hasDetectedRef.current = true; // 👈 フラグを立てて再実行防止
            lastDetectedCodeRef.current = code;

            // ✅ カメラ停止
            controlsRef.current?.stop();

            // ✅ 音を再生（前の音が残ってたら止めてから）
            if (beepRef.current) {
              beepRef.current.pause();
              beepRef.current.currentTime = 0;
              beepRef.current.play().catch((e) => {
                console.warn('音声再生エラー', e);
              });
            }

            // ✅ 親に伝える
            onDetect(code);
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

// ✅ forwardRefで export
const QRCodeScanner = forwardRef(QRCodeScannerBase);
export default QRCodeScanner;