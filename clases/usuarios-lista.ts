import { Usuario } from "./usuario";

export class UsuariosLista {

    private lista: Usuario[] = [];

    constructor() {}

    // Agregar un usuario
    public agregar( usr: Usuario ){

        this.lista.push( usr );
        console.log( this.lista );
        return usr;

    }

    // Añadir nombre a un usuario
    public actualizarNombre( id: string, nombre: string ){

        for( let usuario of this.lista ) {
            if ( usuario.id === id ){
                usuario.nombre = nombre;
                break;
            }
        }

        console.log ('-------- Actualizando usuario -----------');
        console.log ( this.lista );

    }

    // Añadir sala a usuario
    public actualizarSala ( id: string, sala: string ){
        for ( let usuario of this.lista ) {
            if ( usuario.id === id ){
                usuario.sala = sala;
                break;
            }
        }
        console.log('------ Sala actualizada --------');
        console.log ( this.lista );
    }

    // Obtener lista de usuarios
    public getLista() {
        return this.lista.filter( usuario => usuario.nombre !== 'sinnombre');
    }

    // Obtener un usuario
    public getUsr( id: string ) {

        // return this.lista.find( usuario => {
        //     return usuario.id === id;
        // });

        return this.lista.find( usuario => usuario.id === id ); // esto es igual a lo anterior.
    }

    // Obtener los usuarios de una sala
    public getUsrSala( sala: string ) {

        return this.lista.filter ( usuario => usuario.sala === sala );
    }

    // Eliminar un usuario
    public borrarUsr ( id: string ){

        const tmpUsr = this.getUsr( id );

        this.lista = this.lista.filter( usuario => usuario.id !== id );
        console.log( this.lista );

        return tmpUsr;
    }

}