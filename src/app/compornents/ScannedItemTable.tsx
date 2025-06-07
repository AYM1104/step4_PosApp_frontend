// スキャンされた商品をテーブル表示し、各商品に対して “カートに追加” ボタンを表示するコンポーネント

'use client';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton } from '@mui/material';
import { ScanItem } from '@/types/product';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

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
      <Table sx={{ tableLayout: 'fixed' }}>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell align="center"  sx={{ width: '20%' }}>JANコード</TableCell>
            <TableCell align="center"  sx={{ width: '40%' }}>商品名</TableCell>
            <TableCell align="center"  sx={{ width: '15%' }}>価格</TableCell>
            <TableCell align="center"  sx={{ width: '15%' }}>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.jan_code}>
              <TableCell 
                sx={{ 
                  width: '20%',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word'
                }}
              >
                {item.jan_code}
              </TableCell>
              <TableCell sx={{ width: '40%' }}>{item.name}</TableCell>
              <TableCell align="center" sx={{ width: '15%' }}>¥{item.price?.toLocaleString()}</TableCell>
              <TableCell align="center" sx={{ width: '25%' }}>
                <IconButton
                  color="primary"
                  onClick={() => onAddToCart(item.jan_code)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 1,
                  }}
                >
                  <ShoppingCartIcon />
                  <Typography variant="caption" sx={{ mt: 0.5, fontSize: '0.6rem' }}>
                    追加
                  </Typography>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}