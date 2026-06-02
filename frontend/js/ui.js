const container = document.getElementById('tickets-container');

// Renderiza la lista completa de tickets reales procedentes del backend
export function renderTicketsList(tickets, onCloseHandler) {
    if (tickets.length === 0) {
        container.innerHTML = '<p class="loading-text">No hay tickets registrados en el sistema.</p>';
        return;
    }
    
    container.innerHTML = '';
    tickets.forEach(ticket => {
        const card = document.createElement('div');
        card.className = `ticket-card ${ticket.priority} ${ticket.status}`;
        
        card.innerHTML = `
            <h3>#${ticket.id} - ${ticket.title}</h3>
            <p>${ticket.description || 'Sin descripción.'}</p>
            <div class="ticket-meta">
                <span class="tag tag-status ${ticket.status}">${ticket.status}</span>
                <span class="tag">Prioridad: ${ticket.priority}</span>
            </div>
        `;
        
        // Si está abierto, le pintamos el botón manual de cierre
        if (ticket.status === 'OPEN') {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'btn-close-ticket';
            closeBtn.innerText = 'Cerrar';
            closeBtn.addEventListener('click', () => onCloseHandler(ticket.id));
            card.appendChild(closeBtn);
        }
        
        container.appendChild(card);
    });
}

// Método visual "Fake" de realimentación inmediata (Optimistic UI)
export function showTemporaryMessage(message) {
    const notice = document.createElement('div');
    notice.style.cssText = 'background: #fef08a; padding: 0.75rem; border-radius: 4px; margin-bottom: 1rem; font-size: 0.9rem; text-align: center;';
    notice.innerText = message;
    container.prepend(notice);
    setTimeout(() => notice.remove(), 4000);
}