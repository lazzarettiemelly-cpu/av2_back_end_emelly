const express = require('express');
const app = express();

app.use(express.json());

// "Banco de dados" em memória
let filmes = [];
let usuarios = [];
let favoritos = [];

// Contadores de ID
let idFilme = 1;
let idUsuario = 1;
let idFavorito = 1;

/* =========================
   GESTÃO DE FILMES
========================= */

// GET /filmes
app.get('/filmes', (req, res) => {
    res.json(filmes);
});

// POST /filmes
app.post('/filmes', (req, res) => {
    const { titulo, genero, ano_lancamento } = req.body;

    const novoFilme = {
        id: idFilme++,
        titulo,
        genero,
        ano_lancamento
    };

    filmes.push(novoFilme);
    res.status(201).json(novoFilme);
});

// DELETE /filmes/:id
app.delete('/filmes/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = filmes.findIndex(f => f.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: 'Filme não encontrado' });
    }

    filmes.splice(index, 1);
    res.json({ mensagem: 'Filme removido com sucesso' });
});

/* =========================
   GESTÃO DE USUÁRIOS
========================= */

// GET /usuarios
app.get('/usuarios', (req, res) => {
    res.json(usuarios);
});

// POST /usuarios
app.post('/usuarios', (req, res) => {
    const { nome, email, plano } = req.body;

    const novoUsuario = {
        id: idUsuario++,
        nome,
        email,
        plano
    };

    usuarios.push(novoUsuario);
    res.status(201).json(novoUsuario);
});

// PUT /usuarios/:id
app.put('/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, email, plano } = req.body;

    const usuario = usuarios.find(u => u.id === id);

    if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    if (nome) usuario.nome = nome;
    if (email) usuario.email = email;
    if (plano) usuario.plano = plano;

    res.json(usuario);
});

/* =========================
   FAVORITOS
========================= */

// POST /favoritos
app.post('/favoritos', (req, res) => {
    const { id_usuario, id_filme } = req.body;

    const usuario = usuarios.find(u => u.id === id_usuario);
    const filme = filmes.find(f => f.id === id_filme);

    if (!usuario || !filme) {
        return res.status(404).json({ erro: 'Usuário ou Filme não encontrado' });
    }

    const novoFavorito = {
        id: idFavorito++,
        id_usuario,
        id_filme
    };

    favoritos.push(novoFavorito);
    res.status(201).json(novoFavorito);
});

// GET /favoritos
app.get('/favoritos', (req, res) => {
    res.json(favoritos);
});

// GET /favoritos/usuario/:id_usuario
app.get('/favoritos/usuario/:id_usuario', (req, res) => {
    const id_usuario = parseInt(req.params.id_usuario);

    const lista = favoritos.filter(f => f.id_usuario === id_usuario);

    const filmesFavoritos = lista.map(fav => {
        return filmes.find(f => f.id === fav.id_filme);
    });

    res.json(filmesFavoritos);
});

/* =========================
   SERVIDOR
========================= */

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});