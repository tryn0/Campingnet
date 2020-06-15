import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';

import { encriptar, desencriptar } from '../crypto-storage';

@Component({
  selector: 'app-reservas-usuario',
  templateUrl: './reservas-usuario.component.html',
  styleUrls: ['./reservas-usuario.component.css']
})
export class ReservasUsuarioComponent implements OnInit {

  /**
   * Variable que declara la página actual del pagination
   */
  public p: number = 1;
  /**
   * Variable de usuario con sesión iniciada
   */
  public usuarioActual: any = null;

  /**
   * Variable donde se almacenan todas las reservas del usuario
   */
  public reservas: any = null;
  
  /**
   * Constructor de reservas-usuario
   * @param router
   * @param http
   */
  constructor(private router: Router, private http: HttpClient) {}

  /**
   * Función para cambiar página del pagination
   * @param $event 
   */
  onChangePage($event) {    
    this.p = $event;
    try { 
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }

  /**
   * Al empezar a cargar el archivo .ts
   */
  ngOnInit(): void {
    if(localStorage.getItem('usuarioActual') != null){ // Comprobación de usuario con sesión iniciada
      this.usuarioActual = desencriptar(localStorage.getItem('usuarioActual'));
    }else{ // Si no tiene, redirección a inicio
      this.router.navigate(['/']);
    }

    if(this.usuarioActual != null) { // Si hay un usuario con sesión iniciada
      let params = new HttpParams()
      .set('idUsuario', this.usuarioActual.id);

      this.http.post<any>('http://34.206.59.221/reservas-usuario.php', params).subscribe(data => { // Búsqueda de reservas en la BD
        if(data != null && data != 0) {
          this.reservas = data;

          /**
           * Seteo de dias, cambio de formato de las fechas, seteo de sombra en las parcelas y cálculo de precio final
           */
          (this.reservas).forEach(element => {
            let diff = Math.floor((new Date(element.fecha_salida).getTime() - new Date(element.fecha_entrada).getTime())/86400000);
            element.dias = diff;

            let[year, month, day]: string[] = element.fecha_entrada.split('-');
            element.fecha_entrada = `${day}-${month}-${year}`;
            let[year2, month2, day2]: string[] = element.fecha_salida.split('-');
            element.fecha_salida = `${day2}-${month2}-${year2}`;

            element.caracteristicas.tipo = element.caracteristicas.tipo[0].toUpperCase()+element.caracteristicas.tipo.slice(1)
            if(element.caracteristicas.tipo == 'Parcela') {
              switch (element.caracteristicas.sombra) {
                case '0':
                  element.caracteristicas.sombra = 'Nada';
                  break;
                case '1':
                  element.caracteristicas.sombra = 'Media';
                  break;
                case '2':
                  element.caracteristicas.sombra = 'Bastante';
                  break;
                case '3':
                  element.caracteristicas.sombra = 'Mucha';
                  break;
                default:
                  element.caracteristicas.sombra = 'Desconocido';
                  break;
              }
            }

            let totalPagar = 0;
            totalPagar += (parseFloat(element.precioAlojamiento)*parseInt(element.dias))*parseFloat(element.multiplicativo);
            if(element.serviciosExtras) {
              (element.serviciosExtras).forEach(elemento => {
                totalPagar += parseFloat(elemento.precio)*parseInt(elemento.cantidad);
              });
            }
            element.totalPagar = totalPagar;
          });
          console.log(this.reservas)
        }else{
          this.reservas = 'NO';
        }
      });
    }
  }
}