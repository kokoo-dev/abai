package com.kokoo.abai

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import java.util.*

@SpringBootApplication
class AbaiApplication

fun main(args: Array<String>) {
    TimeZone.setDefault(TimeZone.getTimeZone("UTC"))
    runApplication<AbaiApplication>(*args)
}
