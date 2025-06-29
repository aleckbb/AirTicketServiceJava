package org.example.airticketservice.models.requests

import com.fasterxml.jackson.annotation.JsonProperty

data class ClientRegisterRequest(
    @JsonProperty("username")
    val name: String,
    val email: String,
    val password: String
)
