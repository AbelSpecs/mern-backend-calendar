// Obtener eventos todas deben pasar por la validacion del jwt
const { Router } = require('express');
const router = Router();
const {check} = require('express-validator');
const {getEventos, crearEvento, actualizarEvento, borrarEvento} = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// todas las peticiones siguientes deben tener el token validado
router.use(validarJWT);

// obtener eventos
router.get('/', getEventos);

// crear un nuevo evento

router.post('/', 
            [
                check('title', 'el titulo es obligatorio').not().isEmpty(),
                check('start', 'la fecha inicial es obligatoria o debe ser una fecha').custom(isDate),
                check('end', 'la fecha final es obligatoria o debe ser una fecha').custom(isDate),  
                validarCampos
            ],
            crearEvento);

// actualizar evento

router.put('/:id', 
            [ 
                check('title', 'el titulo es obligatorio').not().isEmpty(),
                check('start', 'la fecha inicial es obligatoria o debe ser una fecha').isDate(),
                check('end', 'la fecha final es obligatoria o debe ser una fecha').isDate(),  
                validarCampos
            ],
            actualizarEvento); 

// borrar evento
router.delete('/:id', borrarEvento)

module.exports = router;