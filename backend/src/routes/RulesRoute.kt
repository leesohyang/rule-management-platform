package com.sample.routes

import com.sample.data.history.HistoryLDR2
import com.sample.services.LiveDetectRules
import com.sample.services.RuleService
import com.sample.utils.toZKFun
import com.sample.utils.toZKSignalFun
import io.ktor.application.*
import io.ktor.http.*
import com.sample.data.release.Options
import com.sample.data.release.Signals
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import org.kodein.di.instance
import org.kodein.di.ktor.di
import kotlin.collections.ArrayList

fun Route.rules() {

    val ruleService by di().instance<RuleService>()

    route("/rules") {

        get("/next_id") {
            val result = ruleService.selectNextID()
            println(result)
            call.respond(result)
        }

        post("/insert") {
            val req = call.receive<LiveDetectRules>()
            println(req)
            ruleService.insert(req)
            call.respond(HttpStatusCode.OK)
        }

        //이게 배포X 저장
        post("/upsertAndHistory"){
            val req = call.receive<Array<LiveDetectRules>>()
            ruleService.upsertbulk(req)
            call.respond(HttpStatusCode.OK)
        }
        //배포 o/x 저
        post("/upsertAndHistory2") {
            val req = call.receive<Array<LiveDetectRules>>()
            val released = call.parameters["released"].toString()
            val hisldr = HistoryLDR2("test", "admin", released)
            ruleService.upsertbulk2(req, hisldr)
            call.respond(HttpStatusCode.OK)
        }

        post("/restore") {
            val req = call.receive<Array<LiveDetectRules>>()
            val released = call.parameters["released"].toString()
            val hisldr = HistoryLDR2("test", "admin", released)
            ruleService.restore(req, hisldr)
            call.respond(HttpStatusCode.OK)
        }

        get("/getrowcount") {
            val result = ruleService.getCountRows()
            call.respond(result)
        }

        post("/getFiltersCount"){
            val request = call.receive<Map<String, Any>>()

            val tmp = request.getValue("filters") as Map<String, String>
            val final = tmp.map{
                (it.key + " like " + "\'" + it.value + "%\'")
            }.joinToString(" and ")

            val result = ruleService.getCountFilters(final)
            call.respond(result)
        }

        post("/selectAllFilters"){
            val request = call.receive<Map<String, Any>>()

            val tmp = request.getValue("filters") as Map<String, String>
            val final = tmp.map{
                (it.key + " like " + "\'" + it.value + "%\'")
            }.joinToString(" and ")

            val result = ruleService.selectFilters(request.getValue("offset").toString(), request.getValue("limit").toString(), final)
            call.respond(result)
        }
        get("/selectall") {

            val offset = call.parameters["offset"].toString()
            val limit = call.parameters["limit"].toString()
            val result: ArrayList<LiveDetectRules> = ruleService.select(offset, limit)
            call.respond(result)
        }

        get("/deleteAll") {
            ruleService.deleteAll()
            call.respond(HttpStatusCode.OK)
        }
        post("/zookeeper") {
            val options = call.receive<Options>()
            val data = ruleService.selectString(options.separator)
            println("options: $options")
            println("data: $data")
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
}
}
