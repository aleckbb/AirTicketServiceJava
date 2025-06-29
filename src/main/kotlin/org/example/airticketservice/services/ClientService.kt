package org.example.airticketservice.services

import jakarta.transaction.Transactional
import org.example.airticketservice.entities.ClientEntity
import org.example.airticketservice.exceptions.WrongUserCredentialsException
import org.example.airticketservice.models.requests.ClientLoginRequest
import org.example.airticketservice.models.requests.ClientRegisterRequest
import org.example.airticketservice.repositories.ClientRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class ClientService(
    private val clientRepository: ClientRepository,
    private val passwordEncoder: PasswordEncoder
) {

    @Transactional
    fun login(request: ClientLoginRequest) {
        val client = clientRepository.findByEmail(request.email)
            ?: throw WrongUserCredentialsException("Client with email='${request.email}' not found")

        if (!passwordEncoder.matches(request.password, client.password)) {
            throw WrongUserCredentialsException("Incorrect password")
        }
    }

    @Transactional
    fun register(request: ClientRegisterRequest) {
        if (clientRepository.findByEmail(request.email) != null) {
            throw WrongUserCredentialsException("Client with email='${request.email}' already exists")
        }

        val newClient = ClientEntity(
            name = request.name,
            email = request.email,
            password = passwordEncoder.encode(request.password)
        )
        clientRepository.save(newClient)
    }

    @Transactional
    fun getClientIdByEmail(email: String): Long? = clientRepository.findByEmail(email)?.id
}