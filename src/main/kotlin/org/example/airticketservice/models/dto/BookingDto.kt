package org.example.airticketservice.models.dto

data class BookingDto(
    val id: Long? = null,
    val clientId: Long,
    val flightId: Long,
    val seatNumber: String,
    val flight: FlightDto
)
