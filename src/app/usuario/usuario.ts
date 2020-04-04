export class Usuario {
    public email: string;
    public nif: string;
    public nombre: string;
    public pwd: string;
    public rol: string;
    public telefono: number;
    
    constructor(email: string, nif: string, nombre: string, pwd: string, rol: string, telefono: number) {
    this.email = email;
    this.nif = nif;
    this.nombre = nombre;
    this.pwd = pwd;
    this.rol = rol;
    this.telefono = telefono;
    }
}