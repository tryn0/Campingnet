export class Alojamiento {
   /**
    * ID del alojamiento
    */
    public idAlojamiento: number;
    /**
     * Tipo del alojamiento
     */
    public tipo: string;
    /**
     * Sombra del alojamiento (opcional)
     */
    public sombra?: string;
    /**
     * Dimensiones del alojamiento (opcional)
     */
    public dimension?: string;
    /**
     * Habitaciones del alojamiento (opcional)
     */
    public habitaciones?: number;
    /**
     * Máximo de personas del alojamiento (opcional)
     */
    public maximo_personas?: number;
    /**
     * Número del alojamiento
     */
    public numeroAlojamiento: number;
    
    /**
     * Constructor del objeto alojamiento
     * @param idAlojamiento 
     * @param tipo 
     * @param numeroAlojamiento 
     * @param sombra 
     * @param dimension 
     * @param habitaciones 
     * @param maximo_personas 
     */
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