package org.example.airticketservice.entities

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name = "flight")
open class FlightEntity(

    @Column(nullable = false, length = 100)
    open val flightNumber: String,

    @Column(nullable = false, length = 100)
    open val origin: String,

    @Column(nullable = false, length = 100)
    open val destination: String,

    @Column(name = "departure_time", nullable = false)
    open val departureTime: LocalDateTime,

    @Column(name = "arrival_time", nullable = false)
    open val arrivalTime: LocalDateTime,

    @Column(name = "airplane_model", nullable = false, length = 100)
    open val airplaneModel: String,

    @Column(nullable = false)
    open val price: BigDecimal
) {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    open var id: Long? = null

    @OneToMany(
        mappedBy = "flight",
        cascade = [CascadeType.ALL],
        orphanRemoval = true
    )
    open var bookings: MutableList<BookingEntity> = mutableListOf()
}
