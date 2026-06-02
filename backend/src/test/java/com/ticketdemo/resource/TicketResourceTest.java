package com.ticketdemo.resource;

import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;

@QuarkusTest
public class TicketResourceTest {

    @Test
    public void testCreateAndListTickets() {
        // 1. Intentamos crear un ticket válido
        String requestBody = """
            {
                "title": "Error en VPN corporativa",
                "description": "No conecta desde redes externas",
                "priority": "HIGH"
            }
            """;

        given()
          .contentType(ContentType.JSON)
          .body(requestBody)
        .when()
          .post("/api/tickets")
        .then()
          .statusCode(201)
          .body("id", notNullValue())
          .body("title", is("Error en VPN corporativa"))
          .body("status", is("OPEN"))
          .body("priority", is("HIGH"));

        // 2. Verificamos que el listado contenga al menos el ticket creado
        given()
          .when()
          .get("/api/tickets")
        .then()
          .statusCode(200)
          .body("$.size()", is(1));
    }
}