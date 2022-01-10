package com.sample.routes.history

import com.sample.services.history.HistoryLDRService
import io.ktor.application.*
import io.ktor.response.*
import io.ktor.routing.*
import org.kodein.di.instance
import org.kodein.di.ktor.di

fun Route.historysLive() {

    val historyLiveService by di().instance<HistoryLDRService>()

    route("/history/livedetectrule") {

        get("/selectall") {
            val allHistorys = historyLiveService.selectAll("0", "10")
            call.respond(allHistorys)
        }
////        // UPDATE
//        post("/updateRelease") {
//            val historyRequest = call.receive<HistoryLDR>()
//            historyLiveService.updateRelease(historyRequest, "true")
//            call.respond(HttpStatusCode.OK)
//        }
    }
}

