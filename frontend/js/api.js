/*
 * Archivo: api.js
 * Descripción: Módulo encargado de realizar las peticiones HTTP al backend para gestionar los tickets.
 */

const API_BASE_URL = 'http://localhost:8080/api/tickets';

export async function fetchTickets() {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error('Error al recuperar los tickets');
    return await response.json();
}

export async function createTicket(ticketData) {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
    });
    if (!response.ok) throw new Error('Error al crear el ticket');
    return await response.json();
}

export async function closeTicketApi(id) {
    const response = await fetch(`${API_BASE_URL}/${id}/close`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Error al cerrar el ticket');
    return await response.json();
}

// Cambiar la prioridad de un ticket en el backend Quarkus
export async function changeTicketPriorityApi(id, newPriority) {
    const response = await fetch(`${API_BASE_URL}/${id}/priority`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: newPriority.toUpperCase() })
    });
    if (!response.ok) throw new Error('Error al cambiar la prioridad del ticket');
    return await response.json();
}