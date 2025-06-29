package org.example.airticketservice.services

import jakarta.transaction.Transactional
import org.example.airticketservice.converters.BookingConverter
import org.example.airticketservice.models.dto.BookingDto
import org.example.airticketservice.models.requests.BookingRequest
import org.example.airticketservice.repositories.BookingRepository
import org.example.airticketservice.repositories.ClientRepository
import org.example.airticketservice.utils.SeatsGenerator
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class BookingService(
    val bookingRepository: BookingRepository,
    val clientRepository: ClientRepository,
    val bookingConverter: BookingConverter
) {

    @Transactional
    fun getBookingsByEmail(email: String): List<BookingDto> {
        val client = clientRepository.findByEmail(email) ?: return emptyList()

        return bookingRepository
            .findAllByClientIdAndDepartureTimeAfter(client.id!!, LocalDateTime.now())
            .map { bookingConverter.toDto(it) }
    }

    @Transactional
    fun getAvailableSeatsByFlightId(flightId: Long): List<String> {
        val bookedSeats = bookingRepository
            .findAllSeatNumberByFlightIdAndDepartureTimeAfter(flightId, LocalDateTime.now())

        return SeatsGenerator.defaultSeats.filterNot { it in bookedSeats }
    }

    @Transactional
    fun bookSeat(bookingRequest: BookingRequest, email: String) {
        val client = clientRepository.findByEmail(email)

        bookingRepository.save(bookingConverter.toEntity(bookingRequest, client!!.id!!))
    }

    fun deleteBook(id: Long) {
        bookingRepository.deleteById(id)
    }
}