package com.sample

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.sample.data.header.HeaderTable
import com.sample.data.history.HistoryLDRTable
import com.sample.data.release.ReleaseForm
import com.sample.data.release.ReleaseFormEntity
import com.sample.data.release.ReleaseFormTable
import com.sample.data.release.ReleaseTable
import com.sample.services.LiveDetectRuleTable
import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.ktor.application.Application
import io.ktor.util.KtorExperimentalAPI
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.LoggerFactory
import java.io.File

const val HIKARI_CONFIG_KEY = "ktor.hikariconfig"

@KtorExperimentalAPI
fun Application.initDB() {

    val configPath = environment.config.property(HIKARI_CONFIG_KEY).getString()
    val dbConfig = HikariConfig(configPath)
    val dataSource = HikariDataSource(dbConfig)
    Database.connect(dataSource)
    createTables()
    LoggerFactory.getLogger(Application::class.simpleName).info("Initialized Database")
}

private fun createTables() = transaction {
    SchemaUtils.create(
        HistoryLDRTable,
        ReleaseTable,
        ReleaseFormTable,
        HeaderTable,
        LiveDetectRuleTable
    )
}