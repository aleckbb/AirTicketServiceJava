package org.example.airticketservice.services

import org.example.airticketservice.repositories.ClientRepository
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomUserDetailsService(
    private val clientRepository: ClientRepository
) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        val client = clientRepository.findByEmail(username)
            ?: throw UsernameNotFoundException("User not found: $username")

        return User.withUsername(client.email)
            .password(client.password)
            .roles("USER")
            .build()
    }
}