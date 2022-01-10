package com.sample.routes.history

import com.sample.data.history.HistoryLDR
import com.sample.services.history.HistoryLDRService
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import org.kodein.di.instance
import org.kodein.di.ktor.di

fun Route.historysLive() {

    val historyLiveService by di().instance<HistoryLDRService>()

    route("/history/livedetectrule") {

        get("/selectall") {
            val allHistorys = historyLiveService.selectPart()
            call.respond(allHistorys)
        }
//        // UPDATE
        post("/updateRelease") {
            val historyRequest = call.receive<HistoryLDR>()
            historyLiveService.updateRelease(historyRequest)
            call.respond(HttpStatusCode.OK)
        }
    }
}

