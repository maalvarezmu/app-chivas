# APP de viajes en chivas

Esta es la implementación de un proyecto realizado para la materia de ingeniería de requisitos de la Universidad Nacional de Colombia. El proyecto consiste en una aplicación web que permite a la administración y compra de tiquetes de viajes en chivas.

La aplicación cuenta con dos perfiles, un administrador y un usuario. El administrador puede gestionar los viajes y las chivas, mientras que el usuario puede comprar y cancelar tiquetes para los viajes disponibles y editar su perfil.

## Vista previa

<img src="./src/public/images/preview.png">

## Funcionalidades

__Administrar viajes:__ Como administrador puedes crear, editar y eliminar viajes. Cada viaje tiene un origen, destino, fecha de salida, hora de salida, duración y precio por tiquete.

__Administrar chivas:__ Como administrador puedes crear, editar y eliminar chivas. Cada chiva tiene una matrícula, capacidad de pasajeros, un conductor y un estado (disponible o no disponible).

__Consultar viajes disponibles:__ Como usuario puedes ver los viajes disponibles en la aplicación. Puedes ver todos los detalles de cada viaje y comprar tiquetes para un viaje específico.

__Cancelación y Devolución:__ Como usuario puedes cancelar tiquetes comprados y recibir un reembolso del valor de los tiquetes.

__Administrar perfil:__ Como usuario puedes editar tu perfil, cambiar tu nombre, correo electrónico y contraseña.

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado en tu máquina local:

* [npm](https://www.npmjs.com/) - Gestor de paquetes de Node.js
* [MySQL](https://www.mysql.com/) - Sistema de gestión de bases de datos

## Comenzando 

1. Clona este repositorio en tu máquina local o descargar la carpeta comprimida del proyecto:

   ```bash
   git clone https://github.com/drifterDev/app-chivas.git
   ```

2. Crea el archivo `.env` en la raíz del proyecto y agrega las siguientes variables de entorno:

    ```bash
    DB_HOST=el_host_de_tu_servidor_mysql
    DB_USER=tu_usuario
    DB_PASSWORD=tu_contraseña
    DB_PORT=el_puerto_de_tu_servidor_mysql
    DB_DATABASE=tu_base_de_datos
    ```

3. Ejecuta y crea la base de datos en tu servidor MySQL, todos los comandos esenciales para la creación de la base de datos se encuentran en el archivo `database/db.sql`.

### Instalación 

1. Descargar las dependencias necesarias del proyecto:

   ```bash
   npm install
   ```

2. Correr el comando para construir los estilos de Tailwind CSS:

   ```bash
   npm run build
   ```

3. Levantar un servidor local para previsualizar el proyecto:

   ```bash
   npm run dev:server
   ```

4. Accede a la aplicación en tu navegador web en la dirección `http://localhost:3000`.

## Construido con 

* [Node.js](https://nodejs.org/) - Entorno de ejecución para JavaScript
* [EJS](https://ejs.co/) - Motor de plantillas para JavaScript
* [Tailwind CSS](https://tailwindcss.com/) - Framework de diseño CSS
* [MySQL](https://www.mysql.com/) - Sistema de gestión de bases de datos

## Más vistas previas

<img src="./src/public/images/preview2.png">
<hr>
<img src="./src/public/images/preview4.png">

## Contribuyendo 

Aprecio cualquier sugerencia para mejorar el contenido de este proyecto. Si deseas contribuir, por favor crea un "issue" en el repositorio o contáctame directamente. Valoraré tus aportes para mejorar este repositorio.

## Licencia 

Los códigos incluidos en este proyecto están bajo la Licencia MIT. Para obtener más información, consulta el archivo [LICENSE](LICENSE) en la raíz del repositorio.

## Créditos a Pexels

Las imágenes utilizadas en este proyecto han sido obtenidas de Pexels.com, un sitio web que ofrece fotos de alta calidad de dominio público sin restricciones de licencia. Aunque no es necesario dar atribución en muchos casos, quiero reconocer y agradecer a la comunidad de Pexels por proporcionar recursos visuales gratuitos.

Para obtener más información sobre la licencia de las imágenes específicas utilizadas en este proyecto, consulta las políticas de licencia en el sitio web de Pexels: [Pexels License](https://www.pexels.com/license/).
