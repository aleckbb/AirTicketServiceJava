package org.example.airticketservice.models.requests

data class ClientLoginRequest(
    val email: String,
    val password: String
)
