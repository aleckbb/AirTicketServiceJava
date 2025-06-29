package org.example.airticketservice.entities

import jakarta.persistence.*

@Entity
@Table(name = "client")
open class ClientEntity(

    @Column(name = "name", nullable = false, length = 100)
    open val name: String,

    @Column(name = "email", nullable = false, unique = true)
    open val email: String,

    @Column(name = "password", nullable = false)
    open val password: String
) {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    open var id: Long? = null

    @OneToMany(
        mappedBy = "client",
        cascade = [CascadeType.ALL],
        orphanRemoval = true
    )
    open var bookings: MutableList<BookingEntity> = mutableListOf()
}