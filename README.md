# Banco Digital

Este proyecto consiste en un formulario de registro robusto y altamente validado desarrollado con Angular. La aplicación utiliza un enfoque de "paso a paso" para mejorar la experiencia del usuario (UX) al segmentar la recolección de datos en 5 etapas lógicas.

La aplicación simula el proceso de alta de un nuevo cliente en un banco digital. Está construida bajo el paradigma de Formularios Reactivos, lo que permite un control total sobre el estado de cada campo, validaciones complejas en tiempo real y flujos asíncronos para la verificación de datos.


## Funcionalidades

- Flujo Guiado

- Validaciones Robustas:

    Nombre: Solo letras y espaciosccon longitud mínima.

    Email: Formato válido y Validación Asíncrona que simula una consulta a base de datos para verificar disponibilidad (delay de 2s).

    Seguridad: Contraseñas con requisitos de complejidad (mayúsculas, minúsculas y números) y Validador Personalizado de coincidencia.

    Restricción de Edad: Validador personalizado para asegurar que el usuario sea mayor de 18 años.

- Interfaz Adaptativa (Responsive)

- Simulación de API: Manejo de estados de carga (enviando) y mensajes de éxito tras la validación final.


## Tecnologias utilizadas

- Angular
- Angular Reactive Forms
- RxJS
- CSS3


## Preparación del entorno

- Antes de empezar, asegúrate de tener instalado Node.js (versión 18 o superior).
- Angular CLI instalada de forma global (npm install -g @angular/cli).

1. Clonar e instalar dependencias

git clone https://github.com/tu-usuario/nombre-del-proyecto.git
cd nombre-del-proyecto
npm install

2. Ejecutar servidor del desarrollo
ng serve
(o ejecutar: npx ng serve)

3. Acceder a la app
Abre tu navegador en http://localhost:4200/.


## Notas

- Persistencia: La aplicación no cuenta con un backend real. La validación de "Email ya registrado" está limitada a los correos test@banco.com y admin@banco.com dentro del código.

- Seguridad: Las contraseñas se gestionan únicamente en el lado del cliente para fines demostrativos.

- Multimedia: El logo del banco se carga desde una ruta local (imagenes/ic_bank.png), asegúrate de que el archivo exista en la carpeta assets o actualiza la ruta.

  <img width="888" height="627" alt="image" src="https://github.com/user-attachments/assets/2bdb942d-190a-4b78-86c1-bd379da3bb17" />
  <img width="963" height="693" alt="image" src="https://github.com/user-attachments/assets/df3c8b55-569b-483d-9251-974c6a3a9eee" />
  <img width="927" height="667" alt="image" src="https://github.com/user-attachments/assets/e62ce95d-218a-4d6d-bc46-8b74e6ce82a0" />
  <img width="943" height="652" alt="image" src="https://github.com/user-attachments/assets/5ceb15e8-b10b-435c-8323-0bd95ea637bf" />
  <img width="931" height="696" alt="image" src="https://github.com/user-attachments/assets/9c6f5d30-9153-41bf-a019-4b2041980ad0" />

