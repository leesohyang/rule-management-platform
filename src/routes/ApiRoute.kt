package com.sample.routes

import com.sample.routes.history.historysLive
import io.ktor.routing.Routing
import io.ktor.routing.route

fun Routing.apiRoute() {
    route("/api/v1") {
        historysLive()
        releases()
        releaseForm()
        rules()
        header()
    }
}