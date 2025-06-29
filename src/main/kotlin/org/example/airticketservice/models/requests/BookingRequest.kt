package org.example.airticketservice.models.requests

data class BookingRequest(
    val flightId: Long,
    val seatNumber: String
)
