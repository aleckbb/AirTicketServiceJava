package org.example.airticketservice.models.dto

import java.math.BigDecimal
import java.time.LocalDateTime

data class FlightDto(
    val id: Long? = null,
    val flightNumber:String,
    val origin: String,
    val destination: String,
    val departureTime: LocalDateTime,
    val arrivalTime: LocalDateTime,
    val airplaneModel: String,
    val price: BigDecimal
)
