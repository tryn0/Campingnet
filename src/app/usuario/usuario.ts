export class Usuario {
    /**
     * ID del usuario
     */
    public id: number;
    /**
     * Email del usuario
     */
    public email: string;
    /**
     * DNI del usuario
     */
    public nif: string;
    /**
     * Nombre del usuario
     */
    public nombre: string;
    /**
     * Rol del usuario
     */
    public rol: string;
    /**
     * Teléfono del usuario
     */
    public telefono: number;
    /**
     * Alias del usuario
     */
    public alias: string;
    
    /**
     * Constructor del objeto usuario
     * @param id 
     * @param email 
     * @param nif 
     * @param nombre 
     * @param rol 
     * @param telefono 
     * @param alias 
     */
    constructor(id: number, email: string, nif: string, nombre: string, rol: string, telefono: number, alias: string) {
        this.id = id;
        this.email = email;
        this.nif = nif;
        this.nombre = nombre;
        this.rol = rol;
        this.telefono = telefono;
        this.alias = alias;
    }
}