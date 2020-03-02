export class GraficaData {

    private meses: string[] =  ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio'];
    private valores: number[] = [0, 0, 0, 0, 0, 0];

    constructor() {

    }

    getDataGrafica() {
        return [
            { data: this.valores, label: 'Ventas' }
        ]
    }

    incrementarValor( mes: string, valor: number ) {
        mes = mes.toLowerCase().trim();

        console.log( valor );
        for( let i in this.meses ){
            if ( this.meses[i] === mes ){
                this.valores[i] += valor;
            }
        }

        return this.getDataGrafica();
    }

    cambiarValor( mes: string, valor: number ) {
        mes = mes.toLowerCase().trim();

        for( let i in this.meses ){
            if ( this.meses[i] === mes ){
                this.valores[i] = valor;
            }
        }

        return this.getDataGrafica();

    }

}