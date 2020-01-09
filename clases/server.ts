import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';

import * as miSocket from '../sockets/sockets';

export default class Server {

    private static _instance: Server;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;

    private constructor() {

        this.app = express();
        this.port = SERVER_PORT;

        this.httpServer = new http.Server( this.app );
        this.io = socketIO( this.httpServer );

        this.escucharSocket();

    }

    public static get instance() {
        return this._instance || ( this._instance = new this() );
    }

    private escucharSocket() {
        console.log('Escuchando conexiones - sockets');

        this.io.on('connection', cliente => {

            //Conectar cliente
            miSocket.conectarCliente( cliente );

            // Configurar Usuario
            miSocket.configurarUsr( cliente, this.io );

            // Obtener usuariso activos
            miSocket.obtenerUsuarios( cliente, this.io );
            
            // Mensajes
            miSocket.mensaje( cliente, this.io );
            
            // Desconectar
            miSocket.desconectar( cliente, this.io );


        });
    }

    // Método para levantar el servidor
    start( callback: Function ){

        // this.app.listen( this.port, callback );
        this.httpServer.listen( this.port, callback() );
    }

}