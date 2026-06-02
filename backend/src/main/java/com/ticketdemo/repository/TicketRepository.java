/*
 * Archivo: TicketRepository.java
 * Descripción: Repositorio encargado de gestionar el acceso y las operaciones sobre la entidad Ticket en la base de datos.
 */

package com.ticketdemo.repository;

import com.ticketdemo.entity.Ticket;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class TicketRepository implements PanacheRepository<Ticket> {
}