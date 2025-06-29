package org.example.airticketservice.controllers

import org.example.airticketservice.models.dto.BookingDto
import org.example.airticketservice.models.requests.BookingRequest
import org.example.airticketservice.services.BookingService
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/bookings")
class BookingController(
    private val bookingService: BookingService
) {

    @GetMapping
    fun getBookingsByEmail(@AuthenticationPrincipal user: UserDetails): List<BookingDto> =
        bookingService.getBookingsByEmail(user.username)

    @GetMapping("/available-seats/{flightId}")
    fun getAvailableSeatsByFlightId(@PathVariable flightId: Long): List<String> =
        bookingService.getAvailableSeatsByFlightId(flightId)

    @PostMapping
    fun bookSeat(@RequestBody bookingRequest: BookingRequest, @AuthenticationPrincipal user: UserDetails) {
        bookingService.bookSeat(bookingRequest, user.username)
    }

    @DeleteMapping("/{id}")
    fun deleteBooking(@PathVariable id: Long) {
        bookingService.deleteBook(id)
    }
}
