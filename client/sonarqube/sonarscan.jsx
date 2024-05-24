const { scanner } = import('sonarqube-scanner');

scanner(
    {
        serverUrl: 'http://localhost:9000',
        token: "sqp_9174f91e9ea5cefa6251de524f769256d24a61ee",
        options: {
            'sonar.projectName': 'competencia-futbol-project',
            'sonar.projectDescription': '¡Proyecto CRUD de React con MERN Stack y MySQL! Este proyecto te permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en una base de datos MySQL utilizando una aplicación construida con el stack MERN (MongoDB, Express.js, React.js, Node.js). A continuación, encontrarás una guía para configurar y ejecutar el proyecto en tu entorno local.',
            'sonar.projectKey': 'competencia-futbol-project',
            'sonar.projectVersion': '0.0.1',
            'sonar.exclusions': '',
            'sonar.sourceEncoding': 'UTF-8',
        }
    },
    () => process.exit()
)