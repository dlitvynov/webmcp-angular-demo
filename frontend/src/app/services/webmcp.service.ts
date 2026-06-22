import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TicketService } from './ticket.service';

@Injectable({
  providedIn: 'root'
})
export class WebMcpService {

  constructor(
    private ticketService: TicketService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Inicializa el contexto WebMCP y registra las herramientas agénticas disponibles.
   *
   * Este método debe invocarse una única vez durante el arranque de la aplicación.
   * Incluye dos comprobaciones previas al registro:
   * - Que el código se ejecuta en el navegador (guard de plataforma para entornos SSR).
   * - Que el navegador tiene WebMCP habilitado y expone document.modelContext.
   */
  initializeWebMCP(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const context = (document as any).modelContext;

    if (!context || typeof context.registerTool !== 'function') {
      console.warn('WebMCP no está disponible en este navegador. Verifica la configuración en chrome://flags.');
      return;
    }

    console.log('WebMCP inicializado. Registrando herramientas agénticas...');

    this.registerCrearTicket(context);
    this.registerListarTickets(context);
    this.registerCerrarTicket(context);
    this.registerCambiarPrioridad(context);
  }

  /**
   * Herramienta: crear_ticket
   * Permite al agente crear una nueva incidencia de soporte técnico.
   * Delega la lógica de persistencia en TicketService.
   */
  private registerCrearTicket(context: any): void {
    context.registerTool({
      name: 'crear_ticket',
      description: 'Crea un nuevo ticket de soporte técnico en el sistema cuando el usuario reporta un problema.',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Título breve y claro del problema.'
          },
          description: {
            type: 'string',
            description: 'Descripción detallada del problema.'
          },
          priority: {
            type: 'string',
            enum: ['LOW', 'MEDIUM', 'HIGH'],
            description: 'Nivel de prioridad de la incidencia.'
          }
        },
        required: ['title', 'priority']
      },
      execute: async (args: any) => {
        this.ticketService.showNotice(`Agente actuando: creando ticket "${args.title}"...`);
        try {
          const nuevo = await this.ticketService.createTicket({
            title: args.title,
            description: args.description || '',
            priority: args.priority
          });
          return { success: true, message: `Ticket #${nuevo.id} creado correctamente.` };
        } catch {
          return { success: false, error: 'No se pudo crear el ticket.' };
        }
      }
    });
  }

  /**
   * Herramienta: listar_tickets
   * Permite al agente recuperar el listado completo de incidencias registradas en el sistema.
   */
  private registerListarTickets(context: any): void {
    context.registerTool({
      name: 'listar_tickets',
      description: 'Recupera todos los tickets de soporte técnico registrados en el sistema.',
      parameters: {
        type: 'object',
        properties: {}
      },
      execute: async () => {
        this.ticketService.showNotice('Agente actuando: recuperando listado de tickets...');
        try {
          await this.ticketService.loadTickets();
          return {
            success: true,
            count: this.ticketService.tickets().length,
            tickets: this.ticketService.tickets()
          };
        } catch {
          return { success: false, error: 'Error al recuperar los tickets del servidor.' };
        }
      }
    });
  }

  /**
   * Herramienta: cerrar_ticket
   * Permite al agente marcar una incidencia como resuelta a partir de su identificador.
   */
  private registerCerrarTicket(context: any): void {
    context.registerTool({
      name: 'cerrar_ticket',
      description: 'Cierra una incidencia utilizando su número identificador (ID).',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'Identificador numérico del ticket.'
          }
        },
        required: ['id']
      },
      execute: async (args: any) => {
        this.ticketService.showNotice(`Agente actuando: cerrando ticket #${args.id}...`);
        try {
          await this.ticketService.closeTicket(args.id);
          return { success: true, message: `Ticket #${args.id} cerrado correctamente.` };
        } catch {
          return { success: false, error: `No se pudo cerrar el ticket #${args.id}.` };
        }
      }
    });
  }

  /**
   * Herramienta: cambiar_prioridad_ticket
   * Permite al agente modificar el nivel de prioridad de una incidencia existente.
   */
  private registerCambiarPrioridad(context: any): void {
    context.registerTool({
      name: 'cambiar_prioridad_ticket',
      description: 'Modifica el nivel de prioridad de un ticket existente.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'Identificador numérico del ticket.'
          },
          priority: {
            type: 'string',
            enum: ['LOW', 'MEDIUM', 'HIGH'],
            description: 'Nuevo nivel de prioridad.'
          }
        },
        required: ['id', 'priority']
      },
      execute: async (args: any) => {
        this.ticketService.showNotice(`Agente actuando: actualizando prioridad del ticket #${args.id} a ${args.priority}...`);
        try {
          await this.ticketService.changePriority(args.id, args.priority);
          return { success: true, message: `Prioridad del ticket #${args.id} actualizada correctamente.` };
        } catch {
          return { success: false, error: 'No se pudo actualizar la prioridad.' };
        }
      }
    });
  }
}
