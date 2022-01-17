package com.sample.routes.rules

import com.sample.data.history.HistoryLDR2
import com.sample.services.rules.LiveDetectRuleService
import com.sample.utils.toZKFun
import com.sample.utils.toZKSignalFun
import io.ktor.application.*
import io.ktor.http.*
import com.sample.data.rules.Options
import com.sample.data.rules.Signals
import com.sample.data.rules.LiveDetectRule
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import org.kodein.di.instance
import org.kodein.di.ktor.di
import kotlin.collections.ArrayList

/**
 * Ktor routing
 * LiveDetectRule route
 */
fun Route.livedetectrule() {

    /**
     * Binding LiveDetectRuleService
     */
    val liveDetectRuleService by di().instance<LiveDetectRuleService>()

    /**
     * LiveDetectRule Routing
     */
    route("/rules") {

        get("/next_id") {
            val result = liveDetectRuleService.selectNextID()
            call.respond(result)
        }

        post("/insert") {
            val req = call.receive<LiveDetectRule>()
            liveDetectRuleService.insert(req)
            call.respond(HttpStatusCode.OK)
        }

        post("/upsertAndHistory"){
            val req = call.receive<Array<LiveDetectRule>>()
            liveDetectRuleService.upsertbulk(req)
            call.respond(HttpStatusCode.OK)
        }

        post("/upsertAndHistory2") {
            val req = call.receive<Array<LiveDetectRule>>()
            val released = call.parameters["released"].toString()
            val hisldr = HistoryLDR2("test", "admin", released)
            liveDetectRuleService.upsertbulk2(req, hisldr)
            call.respond(HttpStatusCode.OK)
        }

        post("/restore") {
            val req = call.receive<Array<LiveDetectRule>>()
            val released = call.parameters["released"].toString()
            val hisldr = HistoryLDR2("test", "admin", released)
            liveDetectRuleService.restore(req, hisldr)
            call.respond(HttpStatusCode.OK)
        }

        get("/getrowcount") {
            val result = liveDetectRuleService.getCountRows()
            call.respond(result)
        }

        post("/getFiltersCount"){
            val request = call.receive<Map<String, Any>>()

            val tmp = request.getValue("filters") as Map<*, *>
            val final = tmp.map{
                (it.key.toString() + " like " + "\'" + it.value + "%\'")
            }.joinToString(" and ")

            val result = liveDetectRuleService.getCountFilters(final)
            call.respond(result)
        }

        post("/selectAllFilters"){
            val request = call.receive<Map<String, Any>>()

            val tmp = request.getValue("filters") as Map<*, *>
            val final = tmp.map{
                (it.key.toString() + " like " + "\'" + it.value + "%\'")
            }.joinToString(" and ")

            val result = liveDetectRuleService.selectFilters(request.getValue("offset").toString(), request.getValue("limit").toString(), final)
            call.respond(result)
        }
        get("/selectall") {

            val offset = call.parameters["offset"].toString()
            val limit = call.parameters["limit"].toString()
            val result: ArrayList<LiveDetectRule> = liveDetectRuleService.select(offset, limit)
            call.respond(result)
        }

        get("/deleteAll") {
            liveDetectRuleService.deleteAll()
            call.respond(HttpStatusCode.OK)
        }
        post("/zookeeper") {
            val options = call.receive<Options>()
            val data = liveDetectRuleService.selectString(options.separator)
            toZKFun(data = data, options.releasePath, options.nodeSize.toInt(), options.makeSubNode.toBoolean())
            call.respond(HttpStatusCode.OK)
        }

        post("/signal") {
            val sigs = call.receive<Array<Signals>>()
            sigs.forEach {
                toZKSignalFun(it.path, it.signal)
            }
            call.respond(HttpStatusCode.OK)
        }

        delete("delete/{id}") {
            val rid = call.parameters["id"].toString()
            val result = liveDetectRuleService.delete(rid)
            call.respond(result)
        }
    }
}