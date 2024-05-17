
# Proyecto CompetenciaFutbol de React con MERN Stack y MySQL

¡Proyecto CRUD de React con MERN Stack y MySQL! Este proyecto te permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en una base de datos MySQL utilizando una aplicación construida con el stack MERN (MongoDB, Express.js, React.js, Node.js). A continuación, encontrarás una guía para configurar y ejecutar el proyecto en tu entorno local.

## Configuración del Entorno

### Base de Datos MySQL

Para la base de datos, utilizamos MySQL con Docker para facilitar la configuración. Sigue estos pasos:

1. Descarga la imagen de MySQL desde Docker Hub: docker pull mysql
   
2. Ejecuta un contenedor MySQL con el siguiente comando: docker run --name mymysql -e MYSQL_ROOT_PASSWORD=faztpassword -e MYSQL_DATABASE=CompetenciaFutbol -p 3306:3306 -d mysql
 
3. Accede al contenedor para ejecutar el script SQL de inicialización: docker exec -it mymysql bash

   
4. Luego, dentro del contenedor, ingresa al cliente MySQL y selecciona la base de datos: mysql -u root -p
   
5. Selecciona la base de datos creada: use CompetenciaFutbol;


6. Finalmente, ejecuta el script SQL `db.sql` que se encuentra en la carpeta `database` del proyecto.

### Servidor Node.js
Entrarr a la carpeta /server en la terminaal y ejecutar npm install para intalar las dependencias

El servidor backend está hecho con Node.js y se ejecuta con el siguiente comando: npm run dev


Este comando iniciará el servidor en modo de desarrollo.

### Cliente React
Entrarr a la carpeta /client en la terminaal y ejecutar npm install para intalar las dependencias

El cliente frontend está desarrollado en React.js. Para ejecutarlo, utiliza el siguiente comando: npm run dev


Esto iniciará el servidor de desarrollo de React.

## Uso del Proyecto

Una vez que hayas configurado la base de datos y ejecutado tanto el servidor como el cliente, puedes acceder a la aplicación desde tu navegador.

La aplicación te permitirá realizar operaciones CRUD en la base de datos MySQL a través de una interfaz de usuario intuitiva y fácil de usar.









