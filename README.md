# webmcp-angular-demo

Ejemplo de implementación de **WebMCP** — un enfoque basado en navegador que expone herramientas agénticas a través de `document.modelContext` para que modelos de IA puedan interactuar con la aplicación web directamente desde el navegador.

La app es un panel de gestión de tickets de soporte respaldado por una API REST. El agente puede crear, listar, cerrar y repriorizar tickets a través de 4 herramientas WebMCP registradas.

## Stack

- **Backend:** Quarkus 3.x + Hibernate ORM + RESTEasy Reactive
- **Base de datos:** PostgreSQL 16 (Docker)
- **Frontend:** Angular 18+ Zoneless (Signals)

---

## Puesta en marcha

### 1. Base de datos

```bash
docker compose up -d
```

PostgreSQL estará disponible en `localhost:5432` (usuario: `ticketuser`, contraseña: `ticketpass`).

### 2. Backend

Añade la configuración CORS a `src/main/resources/application.properties`:

```properties
quarkus.http.cors=true
quarkus.http.cors.origins=http://localhost:4200
quarkus.http.cors.methods=GET,POST,PUT,DELETE,OPTIONS
quarkus.http.cors.headers=Content-Type,Authorization
```

Arranca el servidor:

```bash
./mvnw quarkus:dev
```

API disponible en `http://localhost:8080/api/tickets`.

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

App disponible en `http://localhost:4200`.

---

## Herramientas WebMCP

Al cargar el frontend, se registran 4 herramientas en `document.modelContext`:

| Herramienta | Descripción |
|---|---|
| `crear_ticket` | Crea un ticket (`title`, `description`, `priority`) |
| `listar_tickets` | Lista todos los tickets |
| `cerrar_ticket` | Cierra un ticket por `id` |
| `cambiar_prioridad_ticket` | Cambia la prioridad por `id` |

Para verificar el registro, abre la consola del navegador — deberías ver:

🚀 Inicializando WebMCP en Angular: Registrando herramientas agénticas...

> WebMCP requiere un navegador compatible. Activa los flags necesarios en `chrome://flags`.