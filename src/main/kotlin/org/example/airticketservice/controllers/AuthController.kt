package org.example.airticketservice.controllers

import org.example.airticketservice.models.requests.ClientLoginRequest
import org.example.airticketservice.models.requests.ClientRegisterRequest
import org.example.airticketservice.security.JwtUtil
import org.example.airticketservice.services.ClientService
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val clientService: ClientService,
    private val authenticationManager: AuthenticationManager,
    private val userDetailsService: UserDetailsService,
    private val jwtUtil: JwtUtil
) {

    @PostMapping("/register")
    fun register(@RequestBody request: ClientRegisterRequest): ResponseEntity<Void> {
        clientService.register(request)
        return ResponseEntity.ok().build()
    }

    @PostMapping("/login")
    fun login(@RequestBody request: ClientLoginRequest): ResponseEntity<Map<String, String>> {
        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(request.email, request.password)
        )
        val token = jwtUtil.generateToken(request.email)
        return ResponseEntity.ok(mapOf("token" to token))
    }
}
