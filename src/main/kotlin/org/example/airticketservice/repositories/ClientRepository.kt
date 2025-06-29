package org.example.airticketservice.repositories

import org.example.airticketservice.entities.ClientEntity
import org.springframework.data.jpa.repository.JpaRepository

interface ClientRepository: JpaRepository<ClientEntity, Long> {

    fun findByEmail(email: String): ClientEntity?
}