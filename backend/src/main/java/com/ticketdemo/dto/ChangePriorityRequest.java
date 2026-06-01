package com.ticketdemo.dto;

import jakarta.validation.constraints.NotNull;

public record ChangePriorityRequest(
    @NotNull String priority
) {}