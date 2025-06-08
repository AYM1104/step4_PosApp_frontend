import { Suspense } from 'react';
import ConfirmPage from './ConfirmPage';

export default function Page() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <ConfirmPage />
    </Suspense>
  );
}