/*
 * Archivo: ChangePriorityRequest.java
 * Descripción: DTO que define los datos necesarios para modificar la prioridad de un ticket.
 */

package com.ticketdemo.dto;

import jakarta.validation.constraints.NotNull;

public record ChangePriorityRequest(
    @NotNull String priority
) {}