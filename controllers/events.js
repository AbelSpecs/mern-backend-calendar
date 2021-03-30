/* {
    ok:true,
    msg: 'obtener eventos'
} */

const {response} = require('express');
const Evento = require('../models/Evento');


const getEventos = async (req, res = response) => {

    /* const {title, notes, fechai, fechaf} = req.body; */

    try {
        const eventos = await Evento.find().populate('user','name');

        if(!eventos){
            return res.status(400).json({
                ok:false,
                msg: 'contacte con el administrador, no se encontraron eventos',
            })
        }

        res.status(201).json({
            ok:true,
            msg: 'Lista de ventos',
            eventos
        })
        
    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'contacte con el administrador',
        })

    }

}

const crearEvento = async (req, res = response) => {

    /* const {title, notes, start, end} = req.body; */
    console.log(req.body);
    const evento = new Evento(req.body);
    evento.user = req.uid;

    try {

        if(!evento){
            return res.status(400).json({
                ok:false,
                msg: 'contacte con el administrador',
            })
        }
    
        await evento.save();
    
        res.status(201).json({
            ok:true,
            msg: 'Evento Creado',
            evento
        })
        

    } catch (error) {
        res.status(500).json({
            ok:false,
            msg: 'contacte con el administrador',
        })
    }
}

const actualizarEvento = async (req, res = response) => {

    /* const {title, notes, fechai, fechaf} = req.body; */

    const eventoId = req.params.id;

    try {

        const evento = await Evento.findById(eventoId);
        console.log(evento);

        if(!evento){
           return res.status(404).json({
                ok:false,
                msg: 'evento no existe',
            })
        }

        if(evento.user.toString() !== req.uid){
            return res.status(401).json({
                ok:false,
                msg: 'no cuenta con autorizacion para editar este evento',
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: req.uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true});

        res.status(201).json({
            ok:true,
            msg: 'Evento Actualizado',
            evento: eventoActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'contactar con administrador',
        }) 
    }

}

const borrarEvento = async (req, res = response) => {

    /* const {title, notes, fechai, fechaf} = req.body; */

    const eventoId = req.params.id;

    try {
        
        const evento = await Evento.findById(eventoId);

        if(!evento) {
            return res.status(404).json({
                ok:false,
                msg: 'evento no encontrado',
            }) 
        }

        if(evento.user.toString() !== req.uid){
            return res.status(401).json({
                ok:false,
                msg: 'no cuenta con permisos para eliminar este evento',
            }) 
        }

        await Evento.findByIdAndDelete(eventoId);

        res.status(200).json({
            ok:true,
            msg: 'Evento borrado exitosamente',
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'contacte con administrador',
        }) 
    }
    
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    borrarEvento
}