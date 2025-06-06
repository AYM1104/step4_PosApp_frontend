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
            <TableCell>JANコード</TableCell>
            <TableCell>商品名</TableCell>
            <TableCell>価格</TableCell>
            <TableCell>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.jan_code}>
              <TableCell>{item.jan_code}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>¥{item.price?.toLocaleString()}</TableCell>
              <TableCell>
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