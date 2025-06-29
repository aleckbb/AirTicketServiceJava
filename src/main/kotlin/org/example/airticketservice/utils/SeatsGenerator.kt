package org.example.airticketservice.utils

object SeatsGenerator {

    val defaultSeats = generateSeats(6, 20)

    fun generateSeats(seatsInRowNumber: Int, rowsNumber: Int): List<String> {
        return (1 .. rowsNumber).flatMap { rowNum ->
            (0 until seatsInRowNumber).map { seatIndex ->
                val seatChar = 'A' + seatIndex
                "$rowNum$seatChar"
            }
        }
    }
}