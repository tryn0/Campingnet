# Campingnet
Proyecto Integrado de 2º DAW

## ¿En qué consiste?  
Aplicación web desarrollada en Angular para reservar alojamiento en un camping.  
La vista de la app web tiene bootstrap y módulos de Angular (Flex-Layout, Angular Material, moment e Ignite-UI)  
La comunicación con la base de datos se hace a través de PHP.

Para los automails de aviso de reserva, registro y de contacto he usado Firebase, concretamente su apartado de Cloud Functions, no es más que unas funciones desplegadas en la nube y junto con los módulos nodemailer y cors es capaz de enviar los emails.

## Creación del proyecto
Para crear el proyecto seguí estos pasos:  
+ Abrí una terminal NodeJS y ejecuté: 
```
ng new Campingnet
```  
+ A continuación elegí estas respuestas:  
  - **? Would you like to add Angular routing Yes**  
  - **? Which stylesheet format would you like to use? CSS**
  
+ Luego añadí al proyecto Material, que es como bootstrap (visualmente) para HTML, una biblioteca de componentes de diseño:

```
ng add @angular/material
```  
+ Y elegí estas respuestas:  
  - **? Choose a prebuilt theme name, or "custom" for a custom theme: Deep Purple/Amber**  
  - **? Set up global Angular Material typography styles? No**  
  - **? Set up browser animations for Angular Material? Yes**


Se agregó Flex Layout:
```
npm i -s @angular/flex-layout @angular/cdk
```  

Ignite UI (Carrusel):
```
ng add igniteui-angular
```
Elegir presionando Enter las opciones predeterminadas.  

Para seleccionar fecha uso el módulo moment:
```
npm i moment --save
```

Para la encriptación y decriptación de datos:
```
npm install crypto-js
```
[Mini tutorial de cómo implementarlo en el proyecto](https://stackoverflow.com/questions/53478860/how-to-encrypt-and-decrypt-in-angular-6?noredirect=1&lq=1)

Para la paginación usé NGX-Pagination:
```
npm install ngx-pagination --save
```

Para los automails uso firebase (tools y functions):
```
npm install -g firebase-tools
```
[Tutorial seguido para empezar a crear las funciones](https://medium.com/@edigleyssonsilva/cloud-functions-for-firebase-sending-e-mail-1f2631d1022e)

Y con este último ya estarían todas las dependencias externas instaladas.

## Proceso de instalación
Para el proceso de instalación o importación de este proyecto deberá tener instalado nodeJS y npm.  
Una vez se tengan instalar Angular:
```
npm install -g @angular/cli
```

Clonar el repositorio donde se quiera tener el proyecto. En la raíz del proyecto ejecutar a través de una terminal:
```
npm install
```
Este comando instalará todas las dependencias del proyecto en la carpeta node_modules.

La carpeta functions no hace falta, esta carpeta es sencillamente el lugar donde están las cloud functions, pero como ya están desplegadas en la nube no hace falta dicha carpeta, la tengo en el repositorio como parte del código fuente.
Aún así para desplegar las cloud functions se tiene que estar en la raíz de functions y ejecutar:
```
firebase deploy
```
Aunque previamente se tiene que ejecutar:
```
firebase login
```
E identificarse en la web de firebase, como esas cloud functions están en "mi nube" nadie más podrá modificarlas.


## Despliegue de la web app
Una vez se hayan instalado las dependencias, se compila y lanza la app ejecutando en la raíz del proyecto a través de una terminal:
```
ng serve
```
Navegar a la URL `http://localhost:4200/` y aparecerá la web app recargada automáticamente.
## Herramientas usadas
Este proyecto ha sido creado con:  
- [Angular CLI](https://github.com/angular/angular-cli) versión 9.1.4.  
- [Angular Material](https://material.angular.io/) versión 9.2.1  
- [Angular FlexLayout](https://github.com/angular/flex-layout) versión 9.0.0  
- [Ignite UI Angular](https://github.com/angular/flex-layout) versión 9.0.12  
- [Moment](https://momentjs.com/) versión 2.25.1
- [CryptoJS](https://github.com/brix/crypto-js) versión 4.0.0
- [NGX-Pagination](https://github.com/michaelbromley/ngx-pagination) versión 5.0.0 [NGX-Pagination en npmjs.com](https://www.npmjs.com/package/ngx-pagination)
- [Firebase](https://firebase.google.com/?hl=es)


## Errores conocidos y sus soluciones
A lo largo del desarrollo del proyecto han surgido varios errores, los explicaré aquí junto a las soluciones que me han servido.

### Errores con nodeJS, npm o el paquete de Angular (npm)
En Windows no da ningún problema, ya que se descarga todo desde la web oficial y no da problemas.

En la máquina de AWS de Ubuntu Server he tenido muchos problemas a la hora de instalar nodeJS, npm y Angular (a través de npm).  
Para instalarlo todo correctamente, desinstalar todos estos paquetes si se tiene alguno instalado.  
Instalar nodeJS y npm siguiendo [este tutorial](https://ubunlog.com/nodejs-npm-instalacion-ubuntu-20-04-18-04/) solo hasta la parte de instalación a través de Snap.  
Luego instalar Angular con [este tutorial](https://ubunlog.com/angular-instala-framework-ubuntu/) solo la parte de Instalar CLI Angular en Ubuntu.  

Y se tendría instalado limpia y correctamente todo lo necesario.

### Memoria insuficiente en máquina AWS
Al usar cuentas de estudiantes de AWS tenemos un límite de $$$, por lo que usamos todo free tie.  
Y el mayor error de todos es que la máquina de AWS solo tiene ~980Mb de memoria RAM, nada en esta época.  
Lo cual hace imposible el tema de compilación y lanzamiento de la app.

Al indagar por internet encontré la solución perfecta, crear un archivo swap, para usar memoria interna como memoria de intercambio (memoria RAM).
Para ello a la hora de crear la máquina AWS elegí 15Gb de espacio, en vez de los 8Gb por defecto (creo que hasta 100Gb no hay probelmas con el tema free).
[Tutorial](https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-18-04) para el swapfile. A la hora de seguir este tutorial, yo solo creé un swap file de 2Gb, con esto es suficiente y no es un gran impacto en la memoria interna.

Una vez creado el swapfile y sin problema alguno para compilar y lanzar la app se deberá seguir estos pasos:  
Ejecutar:
```
free -h
```

Devovlerá la memoria RAM libre, por ejemplo 700Mb, pues se usará 685 por ejemplo.  
Una vez se tenga en cuenta la cantidad de RAM libre, se lanzará la app ejecutando:
```
node --max-old-space-size=3000 ./node_modules/@angular/cli/bin/ng serve --host=172.31.88.175
```

Donde max-old-space-size se le dice la cantidad de memoria a usar, como se puede apreciar se usó algo menos de memoria RAM libre, para que no use el 100% y los 2Gb del swapfile.

### Warning del módulo moment
Este módulo sirve para la elección de fechas y su manejo.  
A la hora de compilar y lanzar la app empezó a lanzar un warning indicando que no podía resolver './locale/' en el fichero locales.js.  
Busqué en internet y no encontré una solución en concreto y el error llevaba ya varias versiones sin un fix que lo arreglara.  
Por lo que decidí abrir el archivo /node_modules/moment/src/lib/locale/locales.js y buscar con CTRL+F ./locale y encontré una línea en la que por lo visto usa los módulo de la carpeta locale,
```
'./locale/'+name
```
pero locales.js ya estaba en la carpeta locale, así que copié la línea, comenté la original y la copia la modifiqué:
```
'./'+name
```
Y ya no me daba warning. Si en algún momento da algún error, borro la línea modificada y descomento la original.

### Warning del módulo crypto-js
Este módulo sirve para encriptar con una key la información de localStorage, para que no pueda verse, o ser intento de robo, phising, etc.  
Cuando compilas y lanzas la app salta un warning parecido al de justo arriba, no puede resolver crypto. Para ello abre el archivo /node_modules/crypto-js/core.js y encuentra la función con sobre la línea 40, con esta descripción:  
```
// Native crypto import via require (NodeJS)
```
Cambiar:  
```
crypto = require('crypto');
```
por
```
crypto = require('crypto-js');
```
Yo copié la línea, y modifiqué la copia comentando la original, por si en un futuro diese problemas.  


### Seguridad
Para poder usar la web app con total seguridad sugiero cambiar las claves secretas ('Pi7@') de encriptación y desencriptación ubicadas en:
```
Campingnet/src/app/crypto-storage.ts
```
```
Campingnet/functions/index.js
```

Yo dejaré esas mismas claves como modo de muestra, pero en mi web app desplegada usaré otras.

---

Este proyecto no puede copiarse y/o usarse sin el consentimiento de su creador, [tryn0](https://github.com/tryn0)  
&copy;tryn0 2020