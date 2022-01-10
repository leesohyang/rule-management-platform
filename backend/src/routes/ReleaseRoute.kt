package com.sample.routes

import com.sample.data.release.Release
import com.sample.services.ReleaseService
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import org.kodein.di.instance
import org.kodein.di.ktor.di

fun Route.releases() {

    val releaseService by di().instance<ReleaseService>()

    route("/release") {

        // SELCT ALL
//        get("/selectall") {
//            val allReleases = releaseService.selectAll()
//            call.respond(allReleases)
//        }

        get("/selectall") {
            val allReleases = releaseService.selectPart()
            call.respond(allReleases)
        }
        // SELECT
        get("/select/{id}") {
            val id = call.parameters["id"].toString() // ?: throw NotFoundException()
            println("asset id: $id")
            val release = releaseService.select(id.toInt())
            call.respond(release)
//            if (asset == null) call.respond(HttpStatusCode.NotFound)
        }

//        get("/selectbyquery") {
//            val params = call.parameters
//            val response = assetService.selectByQuery(params)
//            call.respond(response)
//
//        }

        // UPDATE
        post("/update") {
            val releaseRequest = call.receive<Release>()
            releaseService.update(releaseRequest)
            call.respond(HttpStatusCode.OK)
        }

        // INSERT
        post("/insert") {
            val releaseRequest = call.receive<Release>()
            println(releaseRequest)
            releaseService.insert(releaseRequest)
            call.respond(HttpStatusCode.Accepted)
        }

        // DELETE
        delete("/delete") {
            val temp = call.receive<Any>()
            println("temp: $temp")
            val ids = call.receive<List<String>>().map {id->id.toInt()}
            releaseService.delete(ids)
            call.respond(HttpStatusCode.OK)
        }
    }
}
