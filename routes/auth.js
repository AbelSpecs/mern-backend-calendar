/* const express = require('express'); 
const router = express.Router */

/* 
    Rutas de Usuarios / Auth
    host + /api/auth
*/ 

const { Router } = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const router = Router();

const {crearUsuario, loginUsuario, revalidarToken} = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt');
 

/* router.get('/', (req, res) => {
    
    res.json({
        ok:true
    })
});  */

router.post('/new', 
            [// middlewares
               check('name', 'el nombre es obligatorio').not().isEmpty(),
               check('email', 'el email es obligatorio o no posee @').isEmail(),
               check('password', 'el password debe ser de 6 caracteres').isLength({min: 6}),
               validarCampos
            ],
            crearUsuario); 

router.post('/', 
            [ //middlewares
                check('email', 'el email es obligatorio o no posee @').isEmail(),
                check('password', 'el password debe ser de 6 caracteres').isLength({min: 6}),
                validarCampos
            ]
            ,loginUsuario); 

router.get('/renew', 
            validarJWT, 
            revalidarToken); 

module.exports = router;