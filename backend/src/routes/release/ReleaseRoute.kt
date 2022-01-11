package com.sample.routes.release

import com.sample.data.release.Release
import com.sample.services.release.ReleaseService
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
    }
}
