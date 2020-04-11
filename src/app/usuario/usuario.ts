export class Usuario {
    public email: string;
    public nif: string;
    public nombre: string;
    public rol: string;
    public telefono: number;
    public alias: string;
    
    constructor(email: string, nif: string, nombre: string, rol: string, telefono: number, alias: string) {
    this.email = email;
    this.nif = nif;
    this.nombre = nombre;
    this.rol = rol;
    this.telefono = telefono;
    this.alias = alias;
    }
}