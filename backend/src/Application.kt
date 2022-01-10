package com.sample

import com.sample.routes.apiRoute
import com.sample.services.bindServices
import io.ktor.application.Application
import io.ktor.application.install
import io.ktor.application.call
import io.ktor.features.*
import io.ktor.response.respond
import io.ktor.routing.routing
import io.ktor.gson.gson
import io.ktor.http.HttpMethod
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.util.KtorExperimentalAPI
import org.jetbrains.exposed.dao.exceptions.EntityNotFoundException
import org.kodein.di.ktor.di

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@KtorExperimentalAPI
@Suppress("unused") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {

    initDB()

    install(ContentNegotiation) { gson {}}
    install(CallLogging)
    install(StatusPages) {
        exception<EntityNotFoundException> {
            call.respond(HttpStatusCode.NotFound)
        }
    }

    install(CORS){
        method(HttpMethod.Options)
        method(HttpMethod.Delete)
        header(HttpHeaders.XForwardedProto)
        header(HttpHeaders.AccessControlAllowOrigin)

        anyHost()

        allowCredentials = true
        allowNonSimpleContentTypes = true
    }

    di {
        bindServices()
    }

    routing {
        apiRoute()
    }

}

