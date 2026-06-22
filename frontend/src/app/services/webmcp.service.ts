import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Para detectar si estamos en el navegador
import { TicketService } from './ticket.service';

@Injectable({
  providedIn: 'root'
})
export class WebMcpService {
  constructor(
    private ticketService: TicketService,
    @Inject(PLATFORM_ID) private platformId: Object // Inyectamos el detector de plataforma
  ) {}

  initializeWebMCP(): void {
    // 🛑 Si Angular está ejecutando esto en el Servidor (SSR), salimos inmediatamente
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // A partir de aquí el código solo se ejecuta en el navegador del usuario final
    const context = (document as any).modelContext;

    if (!context || typeof context.registerTool !== 'function') {
      console.warn('⚠️ WebMCP no está soportado o activado en este navegador. Revisa chrome://flags');
      return;
    }

    console.log('🚀 Inicializando WebMCP en Angular: Registrando herramientas agénticas...');

    // 🔥 HERRAMIENTA 1: Crear un Ticket
    context.registerTool({
      name: 'crear_ticket',
      description: 'Crea un nuevo ticket de soporte técnico en el sistema cuando el usuario reporta un problema.',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Título breve y claro del problema.' },
          description: { type: 'string', description: 'Descripción detallada.' },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'], description: 'Prioridad.' }
        },
        required: ['title', 'priority']
      },
      execute: async (args: any) => {
        this.ticketService.showNotice(`🤖 IA actuando: Creando ticket "${args.title}"...`);
        try {
          const nuevo = await this.ticketService.createTicket({
            title: args.title,
            description: args.description || '',
            priority: args.priority
          });
          return { success: true, message: `Ticket #${nuevo.id} creado con éxito por la IA.` };
        } catch (error) {
          return { success: false, error: 'No se pudo crear el ticket.' };
        }
      }
    });

    // 🕵️‍♂️ HERRAMIENTA 2: Listar Tickets
    context.registerTool({
      name: 'listar_tickets',
      description: 'Muestra u obtiene todos los tickets de soporte técnico registrados.',
      parameters: { type: 'object', properties: {} },
      execute: async () => {
        this.ticketService.showNotice('🤖 IA actuando: Recuperando listado de tickets...');
        try {
          await this.ticketService.loadTickets();
          return { success: true, count: this.ticketService.tickets().length, tickets: this.ticketService.tickets() };
        } catch (error) {
          return { success: false, error: 'Error al leer los tickets del servidor.' };
        }
      }
    });

    // 🔒 HERRAMIENTA 3: Cerrar un Ticket
    context.registerTool({
      name: 'cerrar_ticket',
      description: 'Cierra una incidencia utilizando su número identificador (ID).',
      parameters: {
        type: 'object',
        properties: { id: { type: 'number', description: 'ID numérico del ticket.' } },
        required: ['id']
      },
      execute: async (args: any) => {
        this.ticketService.showNotice(`🤖 IA actuando: Cerrando ticket #${args.id}...`);
        try {
          await this.ticketService.closeTicket(args.id);
          return { success: true, message: `Ticket #${args.id} cerrado correctamente.` };
        } catch (error) {
          return { success: false, error: `No se pudo cerrar el ticket #${args.id}.` };
        }
      }
    });

    // ⚡ HERRAMIENTA 4: Cambiar Prioridad
    context.registerTool({
      name: 'cambiar_prioridad_ticket',
      description: 'Modifica el nivel de prioridad de un ticket existente.',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'number', description: 'ID numérico del ticket.' },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'], description: 'Nueva prioridad.' }
        },
        required: ['id', 'priority']
      },
      execute: async (args: any) => {
        this.ticketService.showNotice(`🤖 IA actuando: Cambiando prioridad del ticket #${args.id} a ${args.priority}...`);
        try {
          await this.ticketService.changePriority(args.id, args.priority);
          return { success: true, message: `Prioridad del ticket #${args.id} actualizada con éxito.` };
        } catch (error) {
          return { success: false, error: `No se pudo cambiar la prioridad.` };
        }
      }
    });
  }
}
