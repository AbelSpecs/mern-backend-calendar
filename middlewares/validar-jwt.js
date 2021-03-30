const {response} = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {

    // recibir el jwt  x-token headers

    
    const token = req.header('x-token');
    console.log(token);

    if(!token){
        return res.status(401).json({
            ok:false,
            msg: 'No hay token en la petición'
        });
    }

    try {
        
        const payload = jwt.verify(
           token,
           process.env.SECRET_JWT_SEED 
        );

        console.log(payload);

        const {uid, name} = payload;
        req.uid = uid;
        req.name = name;
        

    } catch (error) {
        return res.status(401).json({
            ok:false,
            msg: 'Token no valido'
        })
    }

    next();

}


module.exports = {
    validarJWT
}