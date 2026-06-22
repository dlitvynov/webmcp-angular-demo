import { Component, inject } from '@angular/core';
import { TicketDashboardComponent } from './components/ticket-dashboard/ticket-dashboard.component';
import { WebMcpService } from './services/webmcp.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [TicketDashboardComponent],
    template: `<app-ticket-dashboard></app-ticket-dashboard>`
})
export class AppComponent {
    private webMcpService = inject(WebMcpService);

    constructor() {
        this.webMcpService.initializeWebMCP();
    }
}
