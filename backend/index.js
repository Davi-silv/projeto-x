const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = 'gestaomei_secret_key'; // Em produção, use variável de ambiente

// Usuário fixo para teste
const usuarioTeste = {
  username: 'admin',
  // senha: 123456 (hash gerado abaixo)
  passwordHash: bcrypt.hashSync('123456', 8)
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username !== usuarioTeste.username || !bcrypt.compareSync(password, usuarioTeste.passwordHash)) {
    return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
  }
  const token = jwt.sign({ username }, SECRET, { expiresIn: '2h' });
  res.json({ token });
});

// Middleware para proteger rotas
function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Token não fornecido' });
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ erro: 'Token inválido' });
    req.user = user;
    next();
  });
}

// Configuração da conexão MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Altere para seu usuário
  password: '', // Altere para sua senha
  database: 'gestaomei' // Altere para o nome do seu banco
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err.message);
  } else {
    console.log('Conectado ao MySQL!');
  }
});

app.get('/', (req, res) => {
  res.send('API GestãoMEI rodando!');
});

// Rota protegida para buscar produtos do MySQL
app.get('/produtos', autenticarToken, (req, res) => {
  db.query('SELECT * FROM produtos', (err, results) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar produtos no banco de dados' });
    }
    res.json(results);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 