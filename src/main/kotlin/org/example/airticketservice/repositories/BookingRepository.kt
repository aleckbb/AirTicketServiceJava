package org.example.airticketservice.repositories

import org.example.airticketservice.entities.BookingEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.LocalDateTime

interface BookingRepository: JpaRepository<BookingEntity, Long> {

    @Query("""
        SELECT b
        FROM BookingEntity b
        WHERE b.client.id = :id
            AND b.flight.departureTime >= :departureTime
        ORDER BY b.id
    """)
    fun findAllByClientIdAndDepartureTimeAfter(id: Long, departureTime: LocalDateTime): List<BookingEntity>

    @Query("""
        SELECT b.seatNumber
        FROM BookingEntity b
        WHERE b.flight.id = :id
            AND b.flight.departureTime >= :departureTime
    """)
    fun findAllSeatNumberByFlightIdAndDepartureTimeAfter(id: Long, departureTime: LocalDateTime): List<String>
}