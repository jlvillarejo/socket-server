import { Turno } from '../interfaces/turno';

export class Fifo {

    private cola: number[] = [];
    private last: number = 0;
    private atendidos: Turno[] = [];

    constructor() {
        this.reinicia();
     }

    nuevo() {
        this.last += 1;
        this.cola.push( this.last );
        return this.last;
    }

    siguiente(mostrador: number) {
        const proximo =  this.cola[0];

        // const atendido: Turno = { mostrador: mostrador, ticket: proximo };

        this.cola.shift();
        this.gestionAtendidos(mostrador, proximo);
        // this.atendidos.unshift( atendido );

        function comparar (a, b){
            if (a.ticket < b.ticket){
                return 1;
            } else {
                return -1;
            }
        }
        
        this.atendidos.sort( comparar );

        if (this.atendidos.length > 4) {
            this.atendidos.pop();
        }
        return proximo;
    }

    private reinicia() {

        this.last = 0;
        this.atendidos = [];
        this.cola = [];
    }

    getCola() {
        return this.cola;
    }

    getAtendidos() {
        // console.log('atendidos', this.atendidos);
        return this.atendidos;
    }

    getUltimo() {
        return this.last;
    }

    gestionAtendidos( mostrador: number, siguiente: number) {

        // console.log('gestionAtendidos');
        const atendido: Turno = { mostrador: mostrador, ticket: siguiente };

        var elemento = this.atendidos.map( function(e) { return e.mostrador; }).indexOf(mostrador);

        if (elemento < 0){
            // console.log('añado');
            this.atendidos.unshift( atendido );
        }
        else {
            this.atendidos[elemento].ticket = siguiente;
        }


    }

    getAtendiendo ( mostrador: any){

        // const mostradores = this.atendidos.map( function(e) { return e.mostrador; });
        // var elemento = mostradores.indexOf(mostrador);
        var elemento = this.atendidos.map( function(e) { return e.mostrador; }).indexOf(mostrador);
        // console.log( 'atendiendo: ', elemento );

        if ( elemento < 0 ){
            return 0;
        }else{
            return this.atendidos[elemento].ticket;
        }
    }

}

