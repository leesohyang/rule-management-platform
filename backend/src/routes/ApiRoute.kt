package com.sample.routes

import com.sample.routes.header.header
import com.sample.routes.history.historysLive
import com.sample.routes.rules.livedetectrule
import com.sample.routes.release.releaseForm
import com.sample.routes.release.releases
import io.ktor.routing.*

/**
 * Ktor routing
 */
fun Routing.apiRoute() {
    route("/api/v1") {
        historysLive()
        releases()
        releaseForm()
        livedetectrule()
        header()
    }
}