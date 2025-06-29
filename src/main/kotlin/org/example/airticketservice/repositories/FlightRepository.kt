package org.example.airticketservice.repositories

import org.example.airticketservice.entities.FlightEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import java.time.LocalDateTime

interface FlightRepository: JpaRepository<FlightEntity, Long> {

    @Query("""
        SELECT f
        FROM FlightEntity f
        WHERE f.departureTime >= :departureTime        
    """)
    fun findAllByDepartureTimeAfter(departureTime: LocalDateTime): List<FlightEntity>
}