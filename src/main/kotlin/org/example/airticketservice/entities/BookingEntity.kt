package org.example.airticketservice.entities

import jakarta.persistence.*

@Entity
@Table(name = "booking")
open class BookingEntity(

    @Column(name = "seat_number", nullable = false, length = 10)
    open val seatNumber: String
) {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    open var id: Long? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    open var client: ClientEntity? = null

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flight_id")
    open var flight: FlightEntity? = null
}
