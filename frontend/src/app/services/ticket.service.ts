import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Ticket, CreateTicketRequest } from '../models/ticket.model';

@Injectable({
    providedIn: 'root'
})
export class TicketService {
    private apiUrl = 'http://localhost:8080/api/tickets';

    // Estados Reactivos (Signals)
    tickets = signal<Ticket[]>([]);
    temporaryMessage = signal<string | null>(null);

    constructor(private http: HttpClient) {}

    // Cargar todos los tickets y actualizar el estado
    async loadTickets(): Promise<void> {
        try {
            const data = await firstValueFrom(this.http.get<Ticket[]>(this.apiUrl));
            this.tickets.set(data);
        } catch (error) {
            console.error(error);
            this.showNotice('❌ Error de conexión con el Backend en Quarkus');
        }
    }

    // Crear un nuevo ticket
    async createTicket(request: CreateTicketRequest): Promise<Ticket> {
        const nuevo = await firstValueFrom(this.http.post<Ticket>(this.apiUrl, request));
        await this.loadTickets();
        return nuevo;
    }

    // Cerrar un ticket existente
    async closeTicket(id: number): Promise<Ticket> {
        const actualizado = await firstValueFrom(this.http.put<Ticket>(`${this.apiUrl}/${id}/close`, {}));
        await this.loadTickets();
        return actualizado;
    }

    // Cambiar prioridad
    async changePriority(id: number, priority: string): Promise<Ticket> {
        const request = { priority: priority.toUpperCase() };
        const actualizado = await firstValueFrom(this.http.put<Ticket>(`${this.apiUrl}/${id}/priority`, request));
        await this.loadTickets();
        return actualizado;
    }

    // Feedback visual temporal (Sustituye la manipulación de UI de ui.js)
    showNotice(message: string): void {
        this.temporaryMessage.set(message);
        setTimeout(() => {
            // Solo limpiamos si el mensaje sigue siendo el mismo
            if (this.temporaryMessage() === message) {
                this.temporaryMessage.set(null);
            }
        }, 4000);
    }
}