import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../clases/usuarios-lista';
import { Usuario } from '../clases/usuario';

export const usuariosConectados = new UsuariosLista;

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