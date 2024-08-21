const express = require('express');
const net = require('net');
const cors = require('cors');

const app = express();
const port = 3001; // Porta do servidor backend

// Middleware para permitir requisições do frontend
app.use(cors());

app.get('/api/check', (req, res) => {
  const { ip, port } = req.query;

  console.log(`Recebendo solicitação para IP: ${ip} e Porta: ${port}`);

  if (!ip || !port) {
    console.log('Erro: IP e porta são necessários.');
    return res.status(400).json({ error: 'IP e porta são necessários.' });
  }

  const socket = new net.Socket();
  const timeout = 2000; // Tempo limite em ms

  socket.setTimeout(timeout);

  socket.on('connect', () => {
    console.log(`Conectado a IP: ${ip} na Porta: ${port}`);
    socket.destroy();
    res.json({ open: true });
  });

  socket.on('timeout', () => {
    console.log(`Tempo limite ao conectar a IP: ${ip} na Porta: ${port}`);
    socket.destroy();
    res.json({ open: false });
  });

  socket.on('error', (err) => {
    console.log(`Erro ao conectar a IP: ${ip} na Porta: ${port}. Erro: ${err.message}`);
    res.json({ open: false });
  });

  socket.connect(parseInt(port, 10), ip);
});

app.listen(port, () => {
  console.log(`Servidor backend rodando na porta ${port}`);
});
