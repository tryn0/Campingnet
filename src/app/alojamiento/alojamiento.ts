export class Alojamiento {
    public idAlojamiento: number;
    public tipo: string;
    public sombra?: string;
    public dimension?: string;
    public habitaciones?: number;
    public maximo_personas?: number;
    public numeroAlojamiento: number;
    
    constructor(idAlojamiento: number, tipo: string, numeroAlojamiento: number, sombra?: string, dimension?: string, habitaciones?: number, maximo_personas?: number) {
    this.idAlojamiento = idAlojamiento;
    this.tipo = tipo;
    switch(sombra) { 
        case '0': { 
           this.sombra = 'Nada';
           break; 
        } 
        case '1': { 
           this.sombra = 'Media';
           break; 
        } 
        case '2': { 
           this.sombra = 'Bastante';
           break; 
        }
        case '3':{
           this.sombra = 'Mucha';
           break;
        }
     }
    this.dimension = dimension;
    this.habitaciones = habitaciones;
    this.maximo_personas = maximo_personas;
    this.numeroAlojamiento = numeroAlojamiento;
    }
}