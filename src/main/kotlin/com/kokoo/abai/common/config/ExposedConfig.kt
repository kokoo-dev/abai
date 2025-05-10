package com.kokoo.abai.common.config

import com.kokoo.abai.core.domain.Member
import jakarta.annotation.PostConstruct
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration

@Configuration
class ExposedConfig(
    @Value("\${spring.datasource.url}")
    val url: String,

    @Value("\${spring.datasource.username}")
    val username: String,

    @Value("\${spring.datasource.password}")
    val password: String,

    @Value("\${spring.datasource.driver-class-name}")
    val driver: String,
) {

    @PostConstruct
    fun init() {
        Database.connect(url, driver, username, password)

        transaction {
            SchemaUtils.create(Member)
        }
    }
}