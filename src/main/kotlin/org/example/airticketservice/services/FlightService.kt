package org.example.airticketservice.services

import jakarta.transaction.Transactional
import org.example.airticketservice.converters.FlightConverter
import org.example.airticketservice.repositories.FlightRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class FlightService(
    val flightRepository : FlightRepository,
    val flightConverter: FlightConverter
) {

    @Transactional
    fun getAllFlights() = flightRepository.findAllByDepartureTimeAfter(LocalDateTime.now()).map { flightConverter.toDto(it) }
}