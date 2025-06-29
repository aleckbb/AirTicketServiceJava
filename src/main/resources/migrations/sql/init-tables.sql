--liquibase formatted sql

--changeset aleckbb:init_tables
CREATE TABLE client (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE flight (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    flight_number VARCHAR(100) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    airplane_model VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);
CREATE TABLE booking (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    client_id BIGINT NOT NULL,
    flight_id BIGINT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,

    CONSTRAINT fk_booking_client FOREIGN KEY (client_id)
        REFERENCES client(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_booking_flight FOREIGN KEY (flight_id)
        REFERENCES flight(id)
        ON DELETE CASCADE
);
