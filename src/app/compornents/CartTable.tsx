// src/app/compornents/CartTable.tsx
'use client';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { CartItem } from '@/types/product';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

type Props = {
  items: CartItem[];
  onDelete: (janCode: string) => void;
};

export default function CartTable({ items, onDelete }: Props) {
  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" sx={{ p: 2 }}>
        カートに追加された商品
      </Typography>
      <Table sx={{ tableLayout: 'fixed' }}>
        <TableHead sx={{ backgroundColor: '#e0f2f1' }}>
          <TableRow>
            <TableCell align="center"  sx={{ width: '5%' }}>No.</TableCell>
            <TableCell align="center"  sx={{ width: '40%' }}>商品名称</TableCell>
            <TableCell align="center"  sx={{ width: '10%' }}>数量</TableCell>
            <TableCell align="center"  sx={{ width: '15%' }}>価格</TableCell> 
            <TableCell align="center"  sx={{ width: '15%' }}>小計</TableCell>
            <TableCell align="center"  sx={{ width: '15%' }}>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={`${item.jan_code}-${index}`}>
              <TableCell sx={{ width: '5%' }}>{index + 1}</TableCell>
              <TableCell sx={{ width: '40%' }}>{item.name}</TableCell>
              <TableCell align="center" sx={{ width: '10%' }}>{item.quantity}</TableCell>
              <TableCell align="center" sx={{ width: '15%' }}>¥{item.price.toLocaleString()}</TableCell>
              <TableCell align="center" sx={{ width: '15%' }}>¥{(item.price * item.quantity).toLocaleString()}</TableCell>
              <TableCell align="center" sx={{ width: '15%' }}>
              <IconButton
                color="error"
                onClick={() => onDelete(item.jan_code)}
                sx={{ display: 'flex', flexDirection: 'column' }}
              >
                <DeleteIcon />
                <Typography variant="caption" sx={{ mt: 0.5, fontSize: '0.6rem' }}>
                  削除
                </Typography>
              </IconButton>
            </TableCell>
            </TableRow>
          ))}
          {items.length > 0 ? (
            <TableRow>
              <TableCell colSpan={2}>合計</TableCell>
              <TableCell>{items.reduce((sum, item) => sum + item.quantity, 0)} 点</TableCell>
              <TableCell><span style={{ display: 'none' }}>空</span></TableCell>
              <TableCell>
                ¥{items.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}
                <br />
                <span style={{ fontSize: '0.6rem', marginLeft: 4 }}>(税抜)</span>
              </TableCell>
              <TableCell>
                ¥{Math.round(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.1).toLocaleString()}
                <br />
                <span style={{ fontSize: '0.6rem', marginLeft: 4 }}>(税込)</span>
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
}