const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const {generarJWT} = require('../helpers/jwt');


const crearUsuario = async (req, res = response) => {

    const {email, password} = req.body

    try {
        let usuario = await Usuario.findOne({email})

        if(usuario) {
            return res.status(400).json({
                ok:false,
                msg: 'Un usuario existe con este correo'
            });
        }
        
        usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt); 
    
        await usuario.save();
        // Generar jwt

        const token = await generarJWT(usuario.id, usuario.name);
        
        res.status(201).json({ 
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        
        console.log(error)
        res.status(500).json({ 
            ok:false,
            msg: 'Error por favor contacte con el administrador',
        })
    }    
    
}

const loginUsuario = async(req, res = response) => {
    
    const {email, password} = req.body;

    try {

        let usuario = await Usuario.findOne({email})

        if(!usuario) {
            return res.status(400).json({
                ok:false,
                msg: 'email o contraseña erroneos'
            });
        }

        //confirmar passwords

        const validarPassword = bcrypt.compareSync(password, usuario.password);

        if(!validarPassword){
            return res.status(400).json({
                ok:false,
                msg: 'Password incorrecto'
            });
        }
        
        //generar token 

        const token = await generarJWT(usuario.id, usuario.name);

        res.status(200).json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        
        console.log(error)
        res.status(500).json({ 
            ok:false,
            msg: 'Error por favor contacte con el administrador',
        })
    }

    
}

const revalidarToken = async(req, res = response) => {
    
    const uid = req.uid;
    const name = req.name;

    const token = await generarJWT(uid, name);

    res.status(200).json({
        ok:true,
        msg: 'token renovado exitosamente',
        uid,
        name,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}