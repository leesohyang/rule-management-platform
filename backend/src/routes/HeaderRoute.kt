package com.sample.routes

import com.sample.data.header.HeaderInfo
import com.sample.services.HeaderService
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import org.kodein.di.instance
import org.kodein.di.ktor.di


fun Route.header() {

    val headerService by di().instance<HeaderService>()

    route("/header") {

        get("/selectHeaderVersion") {
            val ver = call.parameters["ver"].toString() // ?: throw NotFoundException()
            val header = headerService.restoreHeader(ver)
            call.respond(header)
        }
        // SELCT ALL
        get("/selectheader") {
            val header = headerService.selectLiveHeader()
            call.respond(header)
        }
        get("/deActive"){
            headerService.deActive()
            call.respond(HttpStatusCode.OK)
        }
        post("/insert") {
            val req = call.receive<HeaderInfo>()
            println(req)
//            headerService.deActive() // header type => deActive 시키기
            headerService.insert(req)
            call.respond(HttpStatusCode.OK)
        }
        post("/active") {
            val req = call.receive<String>()
            print(req)
            headerService.active(req)
            call.respond(HttpStatusCode.OK)
        }


    }
}

