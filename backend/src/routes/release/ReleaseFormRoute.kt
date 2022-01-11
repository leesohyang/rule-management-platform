package com.sample.routes.release

import com.sample.services.release.ReleaseFormService
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.routing.*
import org.kodein.di.instance
import org.kodein.di.ktor.di

fun Route.releaseForm() {

    val releaseFormService by di().instance<ReleaseFormService>()

    route("/releaseForm") {

        // SELCT ALL
        get("/selectall") {
            val allHistorys = releaseFormService.selectAll()
            call.respond(allHistorys)
        }

//        get("/selectall") {
//            val allHistorys = historyService.selectPart()
//            call.respond(allHistorys)
//        }
        // SELECT
        get("/select") {
            val type = call.parameters["type"].toString() // ?: throw NotFoundException()
            val relForm = releaseFormService.selectByType(type)
            println(relForm)
            call.respond(relForm)
        }

        post("/init") {
            releaseFormService.init()
            call.respond(HttpStatusCode.OK, "Init ReleaseFormTable OK!")
        }

        // UPDATE
//        post("/update") {
//            val historyRequest = call.receive<History>()
//            historyService.update(historyRequest)
//            call.respond(HttpStatusCode.OK)
//        }

        // INSERT
//        post("/insert") {
//            val historyRequest = call.receive<History>()
//            println(historyRequest)
//            historyService.insert(historyRequest)
//            call.respond(HttpStatusCode.Accepted)
//        }

        // DELETE
//        delete("/delete") {
//            val temp = call.receive<Any>()
//            println("temp: $temp")
//            val ids = call.receive<List<String>>().map {id->id.toInt()}
//            historyService.delete(ids)
//            call.respond(HttpStatusCode.OK)
//        }
    }
}