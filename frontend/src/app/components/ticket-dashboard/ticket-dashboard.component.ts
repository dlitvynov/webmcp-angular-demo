import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';
import { CreateTicketRequest } from '../../models/ticket.model';

@Component({
    selector: 'app-ticket-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './ticket-dashboard.component.html',
    styleUrls: ['./ticket-dashboard.component.css']
})
export class TicketDashboardComponent implements OnInit {
    public ticketService = inject(TicketService);

    // Modelo del formulario local
    formModel: CreateTicketRequest = {
        title: '',
        description: '',
        priority: 'MEDIUM'
    };

    ngOnInit(): void {
        this.ticketService.loadTickets();
    }

    async onSubmit(): Promise<void> {
        try {
            await this.ticketService.createTicket({ ...this.formModel });
            // Resetear formulario manual
            this.formModel = { title: '', description: '', priority: 'MEDIUM' };
        } catch (error) {
            alert('Error al guardar el ticket de forma manual');
        }
    }

    async handleClose(id: number): Promise<void> {
        try {
            await this.ticketService.closeTicket(id);
        } catch (error) {
            alert('No se pudo cerrar el ticket');
        }
    }

    refreshTickets(): void {
        this.ticketService.loadTickets();
    }
}
