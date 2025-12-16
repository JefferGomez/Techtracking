# TechTracking

TechTracking es un sistema web desarrollado en **Java Spring Boot** diseñado para optimizar y modernizar la gestión de visitas técnicas en empresas de soporte, mantenimiento y servicios tecnológicos. Su objetivo principal es permitir que los técnicos registren sus visitas **en tiempo real**, eliminando procesos manuales y mejorando la trazabilidad.

---

## 🚀 Características principales

### 🔐 Autenticación y seguridad

* Inicio de sesión con **Spring Security**.
* Recuperación de contraseña mediante **token JWT** enviado por correo.
* Bloqueo automático tras **3 intentos fallidos**.
* Desbloqueo automático al restablecer contraseña.
* Codificación de contraseñas.

### 🧩 Gestión de Roles y Usuarios

Roles disponibles:

* **SUPERADMIN**
* **ADMIN**
* **TÉCNICO**
* **ALMACENISTA**

Funciones destacadas:

* CRUD completo para usuarios.
* Redirección automática según el rol.

### 🛠️ Módulo de Visitas Técnicas (En desarrollo)

Permite que los técnicos registren:

* Datos del cliente.
* Observaciones.
* Repuestos utilizados.
* Archivos asociados.

### 📡 Notificaciones por correo

* Envío de correos a través de **SMTP (Gmail)**.
* Enlaces seguros para recuperación de contraseña.

---

## 🧱 Arquitectura del Proyecto

El sistema está construido siguiendo el patrón **MVC** y una arquitectura por capas:

* **Controladores** (Controllers)
* **Servicios** (Services)
* **Repositorios** (Repositories)
* **Entidades JPA** (Entities)
* **Vistas HTML/CSS/JS**

Tecnologías principales:

* **Java 17+**
* **Spring Boot**
* **Spring Security**
* **Spring Data JPA (Hibernate)**
* **MySQL**
* **HTML/CSS/JS**

---

## 📁 Estructura real del proyecto

A continuación se muestra la estructura **completa** del proyecto, con una breve explicación al lado de cada archivo o carpeta.

```
TechTracking/
├── registros/                           # Carpeta donde se guardan los PDF generados por los tecnicos 
│   ├── clientes/                        # Carpeta que cuenta con los informes realizados a cada clientes
│   └── tecnicos/                        # Carpeta que cuenta con los informes realizados por cada tecnico 
│ 
│
├── src/
│   └── main/
│       ├── java/com/devs/TechTraking/
│       │   ├── config/                  # Configuraciones globales del sistema
│       │   │   ├── PasswordEncoderConfig.java   # Configura el encoder BCrypt para contraseñas
│       │   │   ├── SecurityConfig.java          # Configuración principal de Spring Security como permisos para cada ruta , rutas libres y demas 
│       │   │   ├── SuperAdminInitializer.java   # Crea el SUPERADMIN por defecto
│       │   │   └── WebSocketConfig.java         # Configura WebSocket para el chat
│       │   │
│       │   ├── controllers/                      # Controladores web y REST / Controladores web son rutas a las que se les asigna cada **HTML** y los RestController son rutas(endpoints) para cada metodo CRUD
│       │   │   ├── AgendarVisitasController         
│       │   │   ├── AuthController  
│       │   │   ├── cambiarContraseñaController 
│       │   │   ├── ChatController        
│       │   │   ├── Clicontroller
│       │   │   ├── ClienteController
│       │   │   ├── ClienteRestController
│       │   │   ├── CorreoRecuperacion
│       │   │   ├── CronogramaRestController
│       │   │   ├── DashBoardCliente
│       │   │   ├── DashBoardSuperAdmin
│       │   │   ├── DetalleVisitasController
│       │   │   ├── EqController
│       │   │   ├── EquipoController
│       │   │   ├── ErrorAutenticacionController
│       │   │   ├── FormularioController
│       │   │   ├── HistorialController
│       │   │   ├── HistorialRestController
│       │   │   ├── HistorialTController
│       │   │   ├── InformeController
│       │   │   ├── IntentosFallidos
│       │   │   ├── ListaClientes
│       │   │   ├── LoginController
│       │   │   ├── RegisterController
│       │   │   ├── registroController
│       │   │   ├── RepuestoController
│       │   │   ├── RevisionController
│       │   │   ├── TecnicoController
│       │   │   ├── UsuarioController
│       │   │   ├── Vincularcontroller
│       │   │   ├── VisitaRestController
│       │   │   ├── VisitaController
│       │   │   ├── VistaEquipoController
│       │   │
│       │   ├── DTO/                       # Objetos de transferencia de datos
│       │   │   ├── EquipoDTO.java         # Datos para equipos
│       │   │   ├── RepuestoDto.java       # Datos para repuestos
│       │   │   └── RevisionDto.java       # Datos para revisiones
│       │   │
│       │   ├── enums/                     # Enumeraciones del sistema
│       │   │   ├── EstadoVisita           # Los Diferentes estados de visita validos
│       │   │   ├── NombreRol              # los Diferentes Roles Validos
│       │   │   ├── TipoImpresora          # Los Tipos de Impresora validos
│       │   │   ├── TipoServicio           # Los Tipos de Servicio Validos
│       │   │
│       │   ├── jwt/                       # Lógica de generación y validación de tokens JWT
│       │   │   └── JwtUtil                # Configuiracion del token JWT
│       │   │
│       │   ├── mapper/                    # Conversión entre entidades y DTOs
│       │   │   ├── RepuestoMapper.java    # Conversion Entidad Repuesto
│       │   │   └── RevisionMapper.java    # Conversion Entidad Revision
│       │   │
│       │   ├── model/                     # Entidades JPA (tablas de BD) Estas son las tablas del modelo de base de datos convertidas a codigo 
│       │   │   ├── Cliente.java
│       │   │   ├── Equipo.java
│       │   │   ├── Intento_login.java
│       │   │   ├── Repuesto.java
│       │   │   ├── Revision.java
│       │   │   ├── Rol.java
│       │   │   ├── Tecnico.java
│       │   │   ├── Usuarios.java
│       │   │   ├── Visita.java
│       │   │   └── Visita_equipo.java
│       │   │
│       │   ├── repository/                # Repositorios que interactúan con la BD 
│       │   │   ├── ClienteRepository.java
│       │   │   ├── EquipoRepository.java
│       │   │   ├── IntentoLoginRepository.java
│       │   │   ├── RepuestoRepository.java
│       │   │   ├── RevisionRepository.java
│       │   │   ├── RolRepository.java
│       │   │   ├── TecnicoRepository.java
│       │   │   ├── UsuarioRepository.java
│       │   │   └── VisitaRepository.java
│       │   │
│       │   ├── security/                           # Manejadores personalizados de seguridad
│       │   │   ├── FailureHandler.java             # Manejo de fallos de login
│       │   │   ├── IntentosFallidosDelete.java     # Manejo de eliminacion de intentos fallidos al lograr un login exitoso
│       │   │   └── SuccessHandler.java             # Qué hacer cuando login es exitoso
│       │   │
│       │   ├── service/                            # Lógica de negocio
│       │   │   ├── ChatHandler.java                # Configuracion para manejar sesiones en el chat y los respectivos mensajes
│       │   │   │── ClienteService.java             # Funciones para Guardar los clientes y poder listarlos todos
│       │   │   │── CronogramaService.java          # Funciones para obtener las visitas de los proximos 30 dias de cada tecnico
│       │   │   │── EmailService.java               # Funcion para enviar los pdfs de cada equipo a su respectivo cliente una vez finalizada la visita 
│       │   │   │── EnviarCorreoService.java        # Funcion para enviar correo con la informacion a cada usuario una vez creado , enviar informacion de la visita al tecnico una vez asignada y el correo con el token
│       │   │   │── EquipoService.java              # Funciones para guardar y listar equipos y de igual manera poder hallar equipos por su cliente
│       │   │   │── InformeService.java             # Creacion del informe en PDF segun las respuestas del formulario , contiene los filtros para crear correctamente el informe que recibira el cliente
│       │   │   │── RepuestoService.java            # Funciones de tipo CRUD para los repuestos 
│       │   │   │── RevisionService.java            # Funciones para controlar las visitas , generar su consecutivo, guardar, finalizar, y guardar los pdfs en sus carpetas correspondientes y nombres correspondientes
│       │   │   │── TecnicoService.java             # Funcion para obtener tecnicos por correo 
│       │   │   │── UsuariosService.java            # Funcion para crear eliminar y editar usuarios , asi mismo contiene la funcion para obtener sus sesiones dentro del aplicativo 
│       │   │   └── VisitaService.java              # Funciones para Crear y guardar Visitas , obtenerlas con rango de fechas , actualizar las visitas, obtenerlas por id
│       │
│       │   └── TechTrakingApplication.java   # Clase principal que inicia Spring Boot
│
│       ├── resources/
│       │   ├── static/
│       │   │   ├── css/
|       │   |    ├── AgendarVisitas.css
|       │   |     ├── CambioContraseña.css
|       │   |     ├── Chat.css
|       │   |     ├── chat-fragment.css
|       │   |     ├── CorreoRecuperar.css
|       │   |     ├── dashboardclientes.css
|       │   |     ├── DetalleVisitas.css
|       │   |     ├── errorAutenticacion.css
|       │   |     ├── EstilosTecnico.css
|       │   |     ├── formulario.css
|       │   |     ├── historial.css
|       │   |     ├── intentosfallidos.css
|       │   |     ├── listaUsuarios.css
|       │   |     ├── login.css
|       │   |     ├── RegistrarUsuarios.css
|       │   |     ├── registrocliente.css
|       │   |     ├── registroclientes.css
|       │   |     ├── vincularEquipo.css
|       │   |     └── vistaequipo.css
|       │   |
|       |   ├── img/
|       │   |   ├── fondo1.png
|       │   |   ├── sm.png
|       │   |   └── smg.png
|       │   |
|       |   ├── js/
|       |   |   ├── AgendarVisitas.js
|       |   |   ├── cambiarContraseña.js
|       |   |   ├── Chat.js
|       |   |   ├── chat-fragment.js
|       |   |   ├── correoRecuperacion.js
|       |   |   ├── crearClientes.js
|       |   |   ├── dashboard-clientes.js
|       |   |   ├── DetalleVisitas.js
|       |   |   ├── errorAutenticacion.js
|       |   |   ├── formulario2.js
|       |   |   ├── historialC.js
|       |   |   ├── historialT.js
|       |   |   ├── intentosfallidos.js
|       |   |   ├── listaUsuarios.js
|       |   |   ├── login.js
|       |   |   ├── registerUsuarios.js
|       |   |   ├── registrocliente.js
|       |   |   ├── registroclientes.js
|       |   |   ├── tecnicoDashboard.js
|       |   |   ├── vincularEquipo.js
|       |   |   └── vistaequipo.js
│       │   └── templates/                   # Vistas Thymeleaf
│       │        ├── login.html
│       │        ├── registerUsuarios.html
│       │        ├── dashboardSuperAdmin.html
│       │        ├── historialT.html
│       │        ├── chat.html
│       │        ├── chat-fragment.html
│       │        ├── CorreoRecuperacion.html
│       │        ├── dashboard-clientes.html
│       │        ├── dashBoardSuperAdmin.html
│       │        ├── DashBoardTecnico.html
│       │        ├── DetalleVisitas.html
│       │        ├── errorAutenticacion.html
│       │        ├── formulario2.html
│       │        ├── historialC.html
│       │        ├── historialT.html
│       │        ├── intentosfallidos.html
│       │        ├── login.html
│       │        ├── registerUsuarios.html
│       │        ├── registroClientes.html
│       │        ├── vincularEquipo.html
│       │        ├── vistaEquipo.html
|
│
├── target/                                  # Archivos compilados (generados automáticamente)
│   └── temp-pdfs/                            # PDFs temporales generados antes de ser guardados
│
└── pom.xml                                   # Dependencias del proyecto y configuración Maven
```

---

## ⚙️ Funcionalidades implementadas

* Gestión completa de usuarios.
* Registro y control de intentos fallidos.
* Sistema de recuperación de contraseña vía correo.
* Roles con redirección personalizada.
* Envío de correos con Gmail.
* Diligenciar formularios para los equipos a los que se les realiza visita
* Envio de informes tan pronto la visita sea finalizada
* Control de visitas (Asignacion,Edicion,Visualizacion)
* Visualizacion de historial de informes por cada tecnico
* Visualizacion de historial de informes por cada cliente
* Notificaciones Para los usuarios creados
* Notifiaciones Para los tecnicos con sus visitas asignadas
* Comunicacion interna entre los usuarios
* Descarga del chat para asegurar su cumplimiento
* Creacion de Stock de Repuestos
* Gestion completa de clientes
* Gestion completa de equipos con sus respectivos clientes

---

## 🎯 Objetivo del sistema

Digitalizar por completo el proceso de visitas técnicas, permitiendo:

* Mayor precisión.
* Procesos más rápidos.
* Mejor trazabilidad.
* Reportes en tiempo real.

---

## 🚀 Despliegue y Ejecución

A continuación se incluye documentación técnica para ejecutar, desplegar y mantener **TechTracking**.

### 🔧 **Requisitos previos**

* **Java 17** o superior
* **Maven 3.9+**
* **MySQL 8+**
* SMTP habilitado (Gmail u otro proveedor)

---

## 🛠️ Configuración inicial

### 1️⃣ **Configurar Base de Datos**

Crear una base de datos en MySQL:

```
CREATE DATABASE sm;

```

Actualizar `application.properties`:

```
spring.application.name = TechTracking
spring.datasource.url = jdbc:mysql://localhost:3306/sm
spring.datasource.username = root
spring.datasource.password =
spring.jpa.hibernate.ddl-auto = update
spring.jpa.show-sql = true
jwt.secret=W@9r!pL7#zM2&uGqXeK1$TdNvYb3^FsJhVc6qL8s

```

### 2️⃣ **Configurar correo SMTP**

En `application.properties`:

```
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=andresrivas0524@gmail.com
spring.mail.password=hkon edng yjut imcz
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.ssl.trust=*

```

---

## ▶️ Ejecución en entorno local

Clonar el repositorio y ejecutar desde terminal y dentro de la carpeta de TechTracking que contiene el pom.xml:

```
mvn spring-boot:run

```

Luego acceder a:

```
http://localhost:8080
```

El proyecto generará automáticamente el usuario **SUPERADMIN**.

---


## 🔒 Seguridad

TechTracking incluye:

* JWT para recuperación de contraseña
* Spring Security para autenticar por roles
* Bloqueo automático tras 3 intentos fallidos
* Envío de alertas al correo

---
