/*
 * Archivo: webmcp.js
 * Descripción: Módulo encargado de integrar la aplicación con WebMCP, registrando herramientas que permiten a agentes de IA crear, consultar y cerrar tickets.
 */

import { createTicket, fetchTickets, closeTicketApi, changeTicketPriorityApi } from './api.js';
import { renderTicketsList, showTemporaryMessage } from './ui.js';

// Función para registrar las capacidades de nuestra web en el navegador
export function initializeWebMCP() {
    // 1. Verificamos si el navegador del usuario soporta el estándar WebMCP actual
    if (!document.modelContext || typeof document.modelContext.registerTool !== 'function') {
        console.warn('⚠️ WebMCP no está soportado o activado en este navegador. Revisa chrome://flags');
        return;
    }

    console.log('🚀 Inicializando WebMCP: Registrando herramientas agénticas...');

    // 🔥 HERRAMIENTA 1: Crear un Ticket
    document.modelContext.registerTool({
        name: 'crear_ticket',
        description: 'Crea un nuevo ticket de soporte técnico en el sistema cuando el usuario reporta un problema, fallo o incidencia.',
        // Definimos los parámetros estructurados que la IA debe extraer del lenguaje natural
        parameters: {
            type: 'object',
            properties: {
                title: { 
                    type: 'string', 
                    description: 'Título breve y claro del problema (ej: "Fallo de conexión en VPN").' 
                },
                description: { 
                    type: 'string', 
                    description: 'Descripción detallada de los síntomas o el error reportado.' 
                },
                priority: { 
                    type: 'string', 
                    enum: ['LOW', 'MEDIUM', 'HIGH'], 
                    description: 'Nivel de prioridad basado en la gravedad del problema.' 
                }
            },
            required: ['title', 'priority']
        },
        // Lo que ocurre cuando el Agente de IA invoca esta herramienta
        execute: async (args) => {
            showTemporaryMessage(`🤖 IA actuando: Creando ticket "${args.title}"...`);
            try {
                const nuevoTicket = await createTicket({
                    title: args.title,
                    description: args.description || '',
                    priority: args.priority
                });
                
                // Refrescamos la interfaz llamando al listado del backend
                const ticketsActualizados = await fetchTickets();
                renderTicketsList(ticketsActualizados, async (id) => {
                    await closeTicketApi(id);
                    const r = await fetchTickets();
                    renderTicketsList(r, this);
                }); // Pasamos una función dummy para mantener el handler del botón manual
                
                // Forzamos una recarga limpia recargando el flujo principal
                document.dispatchEvent(new CustomEvent('ticket-updated'));

                return { success: true, message: `Ticket #${nuevoTicket.id} creado con éxito por la IA.` };
            } catch (error) {
                return { success: false, error: 'No se pudo crear el ticket en el backend.' };
            }
        }
    });

    // 🕵️‍♂️ HERRAMIENTA 2: Listar / Mostrar Tickets
    document.modelContext.registerTool({
        name: 'listar_tickets',
        description: 'Muestra u obtiene todos los tickets de soporte técnico que están registrados actualmente en el sistema.',
        parameters: { type: 'object', properties: {} },
        execute: async () => {
            showTemporaryMessage('🤖 IA actuando: Recuperando listado de tickets...');
            try {
                const tickets = await fetchTickets();
                document.dispatchEvent(new CustomEvent('ticket-updated'));
                return { success: true, count: tickets.length, tickets: tickets };
            } catch (error) {
                return { success: false, error: 'Error al leer los tickets del servidor.' };
            }
        }
    });

    // 🔒 HERRAMIENTA 3: Cerrar un Ticket
    document.modelContext.registerTool({
        name: 'cerrar_ticket',
        description: 'Cierra una incidencia o ticket de soporte técnico utilizando su número identificador (ID).',
        parameters: {
            type: 'object',
            properties: {
                id: { 
                    type: 'number', 
                    description: 'El número de ID numérico único del ticket que se desea cerrar.' 
                }
            },
            required: ['id']
        },
        execute: async (args) => {
            showTemporaryMessage(`🤖 IA actuando: Cerrando ticket #${args.id}...`);
            try {
                await closeTicketApi(args.id);
                document.dispatchEvent(new CustomEvent('ticket-updated'));
                return { success: true, message: `Ticket #${args.id} cerrado correctamente.` };
            } catch (error) {
                return { success: false, error: `No se pudo cerrar el ticket #${args.id}. Verifica si el ID existe.` };
            }
        }
    });

    // ⚡ HERRAMIENTA 4: Cambiar la prioridad de un ticket
    document.modelContext.registerTool({
        name: 'cambiar_prioridad_ticket',
        description: 'Modifica o actualiza el nivel de prioridad de un ticket existente utilizando su ID numérico.',
        parameters: {
            type: 'object',
            properties: {
                id: { 
                    type: 'number', 
                    description: 'El ID numérico único del ticket que se desea modificar.' 
                },
                priority: { 
                    type: 'string', 
                    enum: ['LOW', 'MEDIUM', 'HIGH'], 
                    description: 'El nuevo nivel de urgencia o prioridad que se le asignará al ticket.' 
                }
            },
            required: ['id', 'priority']
        },
        execute: async (args) => {
            showTemporaryMessage(`🤖 IA actuando: Cambiando prioridad del ticket #${args.id} a ${args.priority}...`);
            try {
                await changeTicketPriorityApi(args.id, args.priority);
                
                // Disparamos el evento para que main.js vuelva a cargar la lista y ui.js repinte las tarjetas
                document.dispatchEvent(new CustomEvent('ticket-updated'));
                
                return { success: true, message: `Prioridad del ticket #${args.id} actualizada a ${args.priority} con éxito.` };
            } catch (error) {
                return { success: false, error: `No se pudo cambiar la prioridad del ticket #${args.id}.` };
            }
        }
    });
}