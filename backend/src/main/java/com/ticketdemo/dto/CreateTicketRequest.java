/*
 * Archivo: CreateTicketRequest.java
 * Descripción: DTO que define la estructura y validaciones de los datos necesarios para crear un ticket.
 * Autor: Denys
 */

package com.ticketdemo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateTicketRequest(
    @NotBlank String title,
    String description,
    @NotNull String priority
) {}