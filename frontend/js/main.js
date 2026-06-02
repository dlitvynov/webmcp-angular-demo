/*
 * Archivo: main.js
 * Descripción: Punto de entrada de la aplicación. Gestiona los eventos de la interfaz, la carga de tickets y la integración con WebMCP.
 */

import { fetchTickets, closeTicketApi } from './api.js';
import { renderTicketsList, showTemporaryMessage } from './ui.js';
import { initializeWebMCP } from './webmcp.js'; // 1. Importamos el puente

const form = document.getElementById('ticket-form');
const btnRefresh = document.getElementById('btn-refresh');

// Cargar y pintar los tickets del servidor
async function loadTickets() {
    try {
        const tickets = await fetchTickets();
        renderTicketsList(tickets, handleCloseTicket);
    } catch (error) {
        console.error(error);
        showTemporaryMessage('❌ Error de conexión con el Backend en Quarkus');
    }
}

// Handler para el botón manual de cierre
async function handleCloseTicket(id) {
    try {
        await closeTicketApi(id);
        loadTickets(); 
    } catch (error) {
        alert('No se pudo cerrar el ticket');
    }
}

// Capturar el envío manual del formulario (Usuario Humano)
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const ticketData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        priority: document.getElementById('priority').value
    };
    try {
        await createTicket(ticketData);
        form.reset();
        loadTickets(); 
    } catch (error) {
        alert('Error al guardar el ticket de forma manual');
    }
});

btnRefresh.addEventListener('click', loadTickets);

// 2. Escuchar el evento personalizado cuando la IA realiza modificaciones
document.addEventListener('ticket-updated', loadTickets);

// Inicializar la carga humana y la pasarela WebMCP al arrancar
document.addEventListener('DOMContentLoaded', () => {
    loadTickets();
    initializeWebMCP(); // 3. Encendemos los superpoderes de IA
});