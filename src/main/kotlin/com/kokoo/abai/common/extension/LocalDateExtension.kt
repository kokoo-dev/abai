package com.kokoo.abai.common.extension

import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

fun LocalDate.toSearchStartDateTime(): LocalDateTime =
    LocalDateTime.of(this, LocalTime.of(0, 0, 0))
        .minusHours(9)

fun LocalDate.toSearchEndDateTime(): LocalDateTime =
    LocalDateTime.of(this, LocalTime.of(23, 59, 59))
        .minusHours(9)