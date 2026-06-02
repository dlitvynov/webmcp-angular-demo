/*
 * Archivo: TicketResource.java
 * Descripción: Recurso REST que expone los endpoints para gestionar tickets mediante la API.
 */

package com.ticketdemo.resource;

import com.ticketdemo.dto.ChangePriorityRequest;
import com.ticketdemo.dto.CreateTicketRequest;
import com.ticketdemo.entity.Ticket;
import com.ticketdemo.service.TicketService;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/tickets")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TicketResource {

    @Inject
    TicketService service;

    @POST
    public Response create(@Valid CreateTicketRequest req) {
        Ticket ticket = service.create(req);
        return Response.status(Response.Status.CREATED).entity(ticket).build();
    }

    @GET
    public List<Ticket> listAll() {
        return service.listAll();
    }

    @GET
    @Path("/{id}")
    public Ticket getById(@PathParam("id") Long id) {
        return service.findById(id);
    }

    @PUT
    @Path("/{id}/close")
    public Ticket close(@PathParam("id") Long id) {
        return service.close(id);
    }

    @PUT
    @Path("/{id}/priority")
    public Ticket changePriority(@PathParam("id") Long id, @Valid ChangePriorityRequest req) {
        return service.changePriority(id, req);
    }
}