# Campingnet
Proyecto Integrado de 2º DAW

## ¿En qué consiste?  
Explicación de en qué consiste

## Creación o importación del proyecto
Para crear/importar el proyecto seguí estos pasos:  
+ Abrí una terminal NodeJS y ejecuté:
```
ng new nombre-app
```  
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

Y ya tendríamos todo lo necesario para que el proyecto se pueda importar sin necesidad de descargar la carpeta node_modules (gran tamaño, ignorada gracias a .gitignore)  

Se agregó Flex Layout (Responsive):
```
npm i -s @angular/flex-layout @angular/cdk
```  

Y por último Ignite UI (Carrusel):
```
ng add igniteui-angular
```
Elegir presionando Enter las opciones predeterminadas.  


Luego copiar la carpeta src/ en la carpeta del proyecto (Campingnet) y desde un terminal ejecutar:
```
ng serve
```
Con este comando conseguiremos que se compile todo el proyecto, seguidamente se desplegará, por defecto en la IP de la máquina en el puerto 4200. Por ejemplo localhost:4200

Para seleccionar fecha:
```
npm i @angular/material-moment-adapter ESTE NO (CREO)
```
O
```
npm i moment --save
```

## Despliegue de la web app
Se ejecuta el siguiente comando en la consola de comandos de NodeJS en la carpeta del proyecto:
```
ng serve
```  
Navegar a la URL `http://localhost:4200/` y aparecerá la web app recargada automáticamente.
## Herramientas usadas
This project was generated with:  
- [Angular CLI](https://github.com/angular/angular-cli) version 9.1.0.  
- [Angular Material](https://material.angular.io/) version 9.2.0  
- [Angular FlexLayout](https://github.com/angular/flex-layout) version 9.0.0  
- [Ignite UI Angular](https://github.com/angular/flex-layout) version 9.0.7  

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).