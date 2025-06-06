'use client';

import { Button } from '@mui/material';

// コンポーネントに渡すpropsの型定義
type Props = {
  onClick: () => void;
};

export default function ScanButton({ onClick }: Props) {
  return (
    <Button variant="contained" color="primary" onClick={onClick}>
      スキャンを開始
    </Button>
  );
}