package com.ticketdemo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateTicketRequest(
    @NotBlank String title,
    String description,
    @NotNull String priority
) {}