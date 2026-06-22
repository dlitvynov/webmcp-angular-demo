export interface Ticket {
    id: number;
    title: string;
    description?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'OPEN' | 'CLOSED';
    updatedAt?: string;
}

export interface CreateTicketRequest {
    title: string;
    description?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
}