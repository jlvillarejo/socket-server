import { Router, Request, Response } from 'express';
import Server from '../clases/server';
import { usuariosConectados, mapa, turno } from '../sockets/sockets';
import { GraficaData } from '../clases/grafica';
import { EncuestaData } from '../clases/encuesta';

const router = Router();

const grafica = new GraficaData();
const encuesta = new EncuestaData();

// Colas
router.get('/colas', ( req: Request, res: Response ) => {

    res.json (turno.getUltimo() );
})

router.get('/colas/:id', ( req: Request, res: Response ) => {

    const id = +req.params.id;

    res.json (turno.getAtendiendo(req.params.id) );
})

router.get('/turnos', ( req: Request, res: Response ) => {
    res.json ( turno.getAtendidos() );
})

// Mapa
router.get('/mapa', ( req: Request, res: Response ) => {

    res.json( mapa.getMarcadores() );

});

router.get('/grafica', ( req: Request, res: Response ) => {

    res.json( grafica.getDataGrafica() );

});

router.post('/grafica', ( req: Request, res: Response ) => {

    const mes   = req.body.mes;
    const valor = Number(req.body.valor);

     const server = Server.instance;
     server.io.emit('cambio-grafica', grafica.incrementarValor(mes, valor));

    res.json( grafica.getDataGrafica() );

});

router.get('/encuesta', ( req: Request, res: Response ) => {

    res.json( encuesta.getDataEncuesta() );

});

router.post('/encuesta', ( req: Request, res: Response ) => {

    const preg   = req.body.preg;
    const valor = Number(req.body.valor);

     const server = Server.instance;
     server.io.emit('cambio-encuesta', encuesta.incrementarValor(preg, valor));

    res.json( encuesta.getDataEncuesta()  );

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