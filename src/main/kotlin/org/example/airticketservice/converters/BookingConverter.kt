package org.example.airticketservice.converters

import org.example.airticketservice.entities.BookingEntity
import org.example.airticketservice.models.dto.BookingDto
import org.example.airticketservice.models.requests.BookingRequest
import org.example.airticketservice.repositories.BookingRepository
import org.example.airticketservice.repositories.ClientRepository
import org.example.airticketservice.repositories.FlightRepository
import org.springframework.stereotype.Component

@Component
class BookingConverter(
    private val clientRepository: ClientRepository,
    private val flightRepository: FlightRepository,
    private val flightConverter: FlightConverter
) {

    fun toDto(bookingEntity: BookingEntity): BookingDto {

        return BookingDto(
            bookingEntity.id,
            bookingEntity.client!!.id!!,
            bookingEntity.flight!!.id!!,
            bookingEntity.seatNumber,
            flightConverter.toDto(bookingEntity.flight!!),
        )
    }

    fun toEntity(bookingRequest: BookingRequest, clientId: Long): BookingEntity {
        return BookingEntity(
            bookingRequest.seatNumber
        ).apply {
            client = clientRepository.getReferenceById(clientId)
            flight = flightRepository.getReferenceById(bookingRequest.flightId)
        }
    }
}