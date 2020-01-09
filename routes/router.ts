import { Router, Request, Response } from 'express';
import Server from '../clases/server';
import { usuariosConectados } from '../sockets/sockets';

const router = Router();

router.get('/mensajes', ( req: Request, res: Response ) => {

    res.json({
        ok: true,
        mensaje: 'Todo está bien!!'
    });

});

router.post('/mensajes', ( req: Request, res: Response ) => {

    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;

    const payload = {
        cuerpo,
        de
    };

    const server = Server.instance;
    server.io.emit('mensaje-nuevo', payload);

    res.json({
        ok: true,
        mensaje: 'POST - Todo está bien!!',
        cuerpo: cuerpo,
        de: de
    });

});

router.post('/mensajes/:id', ( req: Request, res: Response ) => {

    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;
    const id = req.params.id;

    const payload = {
        de,
        cuerpo
    }

    const server = Server.instance;

    server.io.in( id ).emit( 'mensaje-privado', payload );

    res.json({
        ok: true,
        mensaje: 'POST - parámetros en URL y Socket',
        cuerpo: cuerpo,
        de: de,
        id
    });

});

// Servicio para obtener los IDs de los usuarios
router.get('/usuarios', ( req: Request, res: Response) =>{

    const server = Server.instance;

    server.io.clients( ( err: any, clientes: string[]) => {

        if ( err ) {
            return res.json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            clientes
        });

    });
});

// Obtener ID de clientes y sus nombres
router.get('/usuarios/detalle', ( req: Request, res: Response) => {

    res.json({
        ok: true,
        clientes: usuariosConectados.getLista()
    });

});


export default router;