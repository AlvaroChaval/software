const express = require('express');
const router= express.Router();
const jwt = require('jsonwebtoken');
//referencia a la base de datos
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn,(req, res) => {
    //renderizar
    res.render('salas/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { title, url, description } = req.body;
    const newSalas = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    const token = jwt.sign({newSalas}, 'token_sala');
    console.log(token);
    newSalas.tokenS = token;
    const sala = await pool.query('INSERT INTO salas set ?', [newSalas]);
    console.log(sala);
    newSalas.id = sala.insertId;
    console.log(newSalas.id);
    const newUS = {
        user_id: req.user.id,  
        salas_id: newSalas.id
    };
    await pool.query('INSERT INTO usersalas set ?', [newUS]);
    //mensajes nombre del mensaje
    req.flash('success', 'Salas guardada Successfully');
    res.redirect('/salas');
    // res.send('recibido');
});

router.get('/', isLoggedIn, async (req, res) => {
     const salas = await pool.query('SELECT * FROM salas where user_id = ?',[req.user.id]);
    res.render('salas/list', { salas });
});

router.get('/salasCompartidas', isLoggedIn, async (req, res) => {
    const salas = await pool.query('SELECT * from salas where id in ( SELECT usersalas.salas_id from usersalas where user_id = ?',[req.user.id],')');
   console.log(salas);
    res.render('salas/list', { salas });
});

router.get('/delete/:id', async (req, res) => {
    console.log(req.params.id);
    const { id } = req.params;
    //agregar seguridad al eliminar
    await pool.query('DELETE FROM salas WHERE ID = ?', [id]);
     req.flash('success', 'Sala eliminada de la base de datos');
    res.redirect('/salas');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const salas = await pool.query('SELECT * FROM salas WHERE id = ?', [id]);
    console.log(salas);
    res.render('salas/edit', {sala: salas[0]});
});

router.post('/edit/:id', isLoggedIn,async (req, res) => {
    const { id } = req.params;
    const { title, description, url} = req.body; 
    const newSala = {
        title,
        description,
        url
    };
    await pool.query('UPDATE salas set ? WHERE id = ?', [newSala, id]);
    req.flash('success', 'Sala actualizada Successfully');
    res.redirect('/salas');
});

router.get('/inSala/:id', isLoggedIn,async (req, res) => {
    const tokenU = req.user.tokenU;
    console.log(tokenU);
    const { id } = req.params;
    const inSala = '?room=' + id;
    const inUs = '&username=' + tokenU;
    const url = 'http://localhost:8080/model-c4' + inSala + inUs;
    res.redirect(url);
});

router.get('/listUsuarios/:idSala', isLoggedIn,async (req, res) => {
    const { idSala } = req.params;
    console.log(idSala);
    const users = await pool.query('SELECT * FROM users');
    console.log(users);
    res.render('salas/listUsuarios', {users, idSala});
});


router.post('/compartir', isLoggedIn, async (req, res) => {
    console.log(req.body);
    // const newSala = await pool.query('select * salas where id ?', [id]);
    // console.log(newSala);

    // console.log(salaCompartida);
    // const newUS = {
    //     user_id: req.idUsuario,  
    //     salas_id: newSala.id
    // };
    // await pool.query('INSERT INTO usersalas set ?', [newUS]);
    // req.flash('success', 'Compartido Successfully');
    res.redirect('/salas');
});
 module.exports = router;