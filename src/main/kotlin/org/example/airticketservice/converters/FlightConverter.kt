package org.example.airticketservice.converters

import org.example.airticketservice.entities.FlightEntity
import org.example.airticketservice.models.dto.FlightDto
import org.springframework.stereotype.Component

@Component
class FlightConverter {

    fun toDto(flightEntity: FlightEntity): FlightDto {
        return FlightDto(
            flightEntity.id,
            flightEntity.flightNumber,
            flightEntity.origin,
            flightEntity.destination,
            flightEntity.departureTime,
            flightEntity.arrivalTime,
            flightEntity.airplaneModel,
            flightEntity.price
        )
    }
}