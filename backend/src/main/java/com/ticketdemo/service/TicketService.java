/*
 * Archivo: TicketService.java
 * Descripción: Servicio encargado de gestionar la lógica de negocio relacionada con los tickets.
 */

package com.ticketdemo.service;

import com.ticketdemo.dto.ChangePriorityRequest;
import com.ticketdemo.dto.CreateTicketRequest;
import com.ticketdemo.entity.Ticket;
import com.ticketdemo.enums.TicketPriority;
import com.ticketdemo.enums.TicketStatus;
import com.ticketdemo.repository.TicketRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class TicketService {

    @Inject
    TicketRepository repository;

    @Transactional
    public Ticket create(CreateTicketRequest req) {
        Ticket ticket = new Ticket();
        ticket.title = req.title();
        ticket.description = req.description();
        ticket.priority = TicketPriority.valueOf(req.priority().toUpperCase());
        repository.persist(ticket);
        return ticket;
    }

    public List<Ticket> listAll() {
        return repository.listAll();
    }

    public Ticket findById(Long id) {
        return repository.findByIdOptional(id)
            .orElseThrow(() -> new NotFoundException("Ticket no encontrado: " + id));
    }

    @Transactional
    public Ticket close(Long id) {
        Ticket ticket = findById(id);
        ticket.status = TicketStatus.CLOSED;
        ticket.updatedAt = LocalDateTime.now();
        return ticket;
    }

    @Transactional
    public Ticket changePriority(Long id, ChangePriorityRequest req) {
        Ticket ticket = findById(id);
        ticket.priority = TicketPriority.valueOf(req.priority().toUpperCase());
        ticket.updatedAt = LocalDateTime.now();
        return ticket;
    }
}