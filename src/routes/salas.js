const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
//referencia a la base de datos
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
const fs = require('fs');
const path = require('path'); // Importa el módulo 'path' para manejar rutas
const xml2js = require('xml2js');
const { DOMParser } = require('xmldom');
const XMLSerializer = require('xmldom').XMLSerializer;

router.get('/add', isLoggedIn, (req, res) => {
    //renderizar
    res.render('salas/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { title, xml, description } = req.body;
    const newSalas = {
        title,
        xml,
        description,
        user_id: req.user.id
    };
    const token = jwt.sign({ newSalas }, 'token_sala');
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
    const salas = await pool.query('SELECT * FROM salas where user_id = ?', [req.user.id]);
    res.render('salas/list', { salas });
});

router.get('/salasCompartidas', isLoggedIn, async (req, res) => {
    const idUs = req.user.id;
    console.log(idUs + 'id usuario');
    const salas = await pool.query('SELECT * from salas where id in ( SELECT usersalas.salas_id from usersalas where user_id = ?)', [req.user.id]);
    console.log(salas);
    res.render('salas/listCompartidas', { salas });
});

router.get('/delete/:id', async (req, res) => {
    console.log(req.params.id);
    const { id } = req.params;
    //agregar seguridad al eliminar
    await pool.query('DELETE FROM usersalas WHERE salas_id = ?', [id]);
    await pool.query('DELETE FROM salas WHERE ID = ?', [id]);
    req.flash('success', 'Sala eliminada de la base de datos');
    res.redirect('/salas');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const salas = await pool.query('SELECT * FROM salas WHERE id = ?', [id]);
    console.log(salas);
    res.render('salas/edit', { sala: salas[0] });
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, description, xml } = req.body;
    const newSala = {
        title,
        description,
        xml
    };
    await pool.query('UPDATE salas set ? WHERE id = ?', [newSala, id]);
    req.flash('success', 'Sala actualizada Successfully');
    res.redirect('/salas');
});

router.get('/inSala/:tokenS', isLoggedIn, async (req, res) => {
    const tokenU = req.user.tokenU;
    console.log(tokenU + 'token de usuario');
    const { tokenS } = req.params;
    console.log(req.params + ' requ parametros');
    const inSala = '?room=' + tokenS;
    const inUs = '&username=' + tokenU;
    const xml = 'http://localhost:8080/model-c4' + inSala + inUs;
    console.log(xml);
    res.redirect(xml);
});

router.get('/listUsuarios/:idSala', isLoggedIn, async (req, res, idS) => {
    const { idSala } = req.params;

    const users = await pool.query('SELECT * FROM users');
    console.log(users);
    console.log(idSala + 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    idS = idSala;
    res.render('salas/listUsuarios', { users, idSala });
});


router.post('/compartir/:idSala', isLoggedIn, async (req, res,) => {
    console.log('hola');
    console.log(req.body);
    const { idUsuario } = req.body;
    const { idSala } = req.params;

    console.log(idUsuario + 'id del usuario');
    console.log(idSala + ' id de las sala');
    const newUS = {
        user_id: idUsuario,
        salas_id: idSala
    };
    console.log('newUS');
    await pool.query('INSERT INTO usersalas set ?', [newUS]);
    req.flash('success', 'Compartido Successfully');
    res.redirect('/salas');
});

    // router.get('/exportar/:id', isLoggedIn, async (req, res) => { 
    //     const { id } = req.params;
    //     const salas = await pool.query('SELECT * FROM salas WHERE id = ?', [id]);
    //     const archivo = salas[0].xml;
    //     const xml = fs.readFileSync(archivo, 'utf8');
    //     const data = await new Promise((resolve, reject) => {
    //         xml2js.parseString(xml, { format: 'json' }, (err, result) => {
    //         if (err) reject(err);
    //         else resolve(result);
    //         });
    //     });
    //     const javaCode = generateJavaCode(data);
    //     res.render('salas/exportar', { javaCode, sala: salas[0] });
    // });
    router.get('/exportar/:id', isLoggedIn, async (req, res) => {
        try {
          const { id } = req.params;
          const salas = await pool.query('SELECT * FROM salas WHERE id = ?', [id]);
      
          // Obtiene el contenido XML de 'salas[0].xml'
          const xmlContent = salas[0].xml;

          var parser = new DOMParser();
var xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
var xmlSerializer = new XMLSerializer();
var xmlStringNew = xmlSerializer.serializeToString(xmlDoc);
      
          const parseXml = (xmlString) => {
            return new Promise((resolve, reject) => {
              const parser = new xml2js.Parser();
              parser.parseString(xmlString, (err, result) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              });
            });
          };
      
          // Ahora parseamos el XML en un objeto JSON
          const json = await parseXml(xmlContent);
      
   
          const jsonn = JSON.stringify(xmlStringNew, null, 2);



var objeto = JSON.parse(jsonn);


      
          res.render('salas/exportar', { xmlStringNew, sala: salas[0] });
        } catch (error) {
          console.error(error);
          res.status(500).send('Error interno del servidor');
        }
      });


      
      const xmldom = require('xmldom');

function xmlToJava(xmlString) {
  // Parse the XML string into a DOM document.
  const parser = new xmldom.DOMParser();
  const doc = parser.parseFromString(xmlString, "text/xml");

  // Get the root element of the document.
  const rootElement = doc.documentElement;

  // Create a new Java class to represent the sequence diagram.
  const javaClass = `public class ${rootElement.getAttribute('id')} {`;

  // Iterate over all of the child elements of the root element.
  for (const childElement of rootElement.children) {
    // If the child element is a lifeline, create a Java method to represent it.
    if (childElement.tagName === 'mxCell' && childElement.getAttribute('shape') === 'umlLifeline') {
      javaClass += `
        public void ${childElement.getAttribute('id')}() {
          // TODO: Implement the logic for the lifeline.
        }`;
    }
  }

  // Close the Java class.
  javaClass += '}';

  // Return the Java code.
  return javaClass;
}
    
      
      
      
      
  

module.exports = router;