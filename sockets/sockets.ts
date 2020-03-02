import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../clases/usuarios-lista';
import { Usuario } from '../clases/usuario';
import { Mapa } from '../clases/mapa';
import { Marcador } from '../clases/marcador';
import { Fifo } from '../clases/fifo';
import { Turno } from '../interfaces/turno';

export const usuariosConectados = new UsuariosLista;
export const mapa = new Mapa();
export const turno = new Fifo();
export const ocupados: Turno[] = [];


// Eventos cola Fifo
export const colaSocket = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on( 'ticket-nuevo', () => {
        // console.log('en ticket-nuevo');
        var ticket = turno.nuevo();
        // console.log(turno.getCola());
        cliente.emit( 'ticket-nuevo', ticket );
    });
    
    cliente.on( 'ticket-siguiente', ( mostrador: number ) => {
        
        var ticket = turno.siguiente( mostrador );
        // console.log( ticket );
        // console.log(turno.getCola());
        io.to( cliente.id ).emit('ticket-siguiente', ticket);
        // console.log('ticket siguiente atendido:', ticket);
        cliente.broadcast.emit('ticket-mostradores', turno.getAtendidos());

    });
}


// Eventos de mapa
export const mapaSockets = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on( 'marcador-nuevo', ( marcador: Marcador ) => {
        mapa.agregarMarcador( marcador );
        cliente.broadcast.emit( 'marcador-nuevo', marcador );
    });

    cliente.on( 'marcador-borrar', ( id: string ) => {
        mapa.borrarMarcador( id );
        cliente.broadcast.emit( 'marcador-borrar', id );
    });
    
    cliente.on ( 'marcador-mover', ( marcador: Marcador ) => {
        mapa.moverMarcador( marcador );
        cliente.broadcast.emit( 'marcador-mover', marcador );
    })
}


export const conectarCliente = ( cliente: Socket ) => {

    const usr = new Usuario( cliente.id );
    usuariosConectados.agregar( usr );

}

export const desconectar = ( cliente: Socket, io: socketIO.Server) => {

    cliente.on('disconnect', () => {
        console.log('Cliente desconectado!!!!**');
        usuariosConectados.borrarUsr( cliente.id );

        io.emit('usuarios-activos', usuariosConectados.getLista() );
    });

}

// escuchar mensajes
export const mensaje = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('mensaje', ( payload: { de: string, cuerpo: string } ) => {

        console.log('Mensaje recibido', payload);

        io.emit('mensaje-nuevo', payload );

    });
}

// escuchar mensajes
export const configurarUsr = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('configurar-usuario', ( payload: { nombre: string }, callback: Function ) => {
        usuariosConectados.actualizarNombre( cliente.id, payload.nombre );

        // io.emit( 'usuario-configurado', payload );
        io.emit('usuarios-activos', usuariosConectados.getLista() );
        
        callback({
            ok: true,
            mensaje: `Usuario ${ payload.nombre } configurado`
        });
        
    })

}

// Obtener usuarios
export const obtenerUsuarios = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('obtener-usuarios', () => {

        // io.emit('usuarios-activos', usuariosConectados.getLista() );  // Se envia a todos los clientes
        io.to( cliente.id ).emit('usuarios-activos', usuariosConectados.getLista() );  // Se envia solo al nuevo cliente
                
    })

}