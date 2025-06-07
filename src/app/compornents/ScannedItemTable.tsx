// スキャンされた商品をテーブル表示し、各商品に対して “カートに追加” ボタンを表示するコンポーネント

'use client';

import { Table, Button, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { ScanItem } from '@/types/product';

type Props = {
  items: ScanItem[];
  onAddToCart: (janCode: string) => void;
};

export default function ScannedItemTable({ items, onAddToCart }: Props) {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        スキャンされた商品
      </Typography>
      <Table>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell sx={{ width: '20%' }}>JANコード</TableCell>
            <TableCell sx={{ width: '50%' }}>商品名</TableCell>
            <TableCell sx={{ width: '15%' }}>価格</TableCell>
            <TableCell sx={{ width: '15%' }}>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.jan_code}>
              <TableCell sx={{ width: '20%' }}>{item.jan_code}</TableCell>
              <TableCell sx={{ width: '50%' }}>{item.name}</TableCell>
              <TableCell sx={{ width: '15%' }}>¥{item.price?.toLocaleString()}</TableCell>
              <TableCell sx={{ width: '15%' }}>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => onAddToCart(item.jan_code)} 
                >
                    カートに追加
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}