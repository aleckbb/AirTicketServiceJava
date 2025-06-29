package org.example.airticketservice.controllers

import org.example.airticketservice.models.dto.FlightDto
import org.example.airticketservice.services.FlightService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/flights")
class FlightController(
    private val flightService: FlightService
) {
    @GetMapping
    fun getAllFlights(): List<FlightDto> =
        flightService.getAllFlights()
}
