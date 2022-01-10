package com.sample.services

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.sample.data.history.HistoryLDR2
import com.sample.data.history.HistoryLDRTable
import com.sample.data.jsonb
import com.sample.utils.formatter
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.min
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.wrapAsExpression
import java.time.LocalDateTime

@Serializable
data class LiveDetectRules(
    val id: Int,
    val active: String,
    val ruletype: String,
    val keyfield: String,
    val confirms: String,
    val conditions: List<Conditions>,
    val ver: String,
    val updatedat: String?
){
    fun sepString(sep: String): String {
        return "$id$sep$active$sep$ruletype$sep$keyfield$sep$confirms$sep$conditions$sep$ver\n"
    }
}

object LiveDetectRuleTable : IntIdTable() {
    val active = varchar("active", 255)
    val ruletype = varchar("ruletype", 255)
    val keyfield = varchar("keyfield", 255)
    val corfirms = varchar("confirms", 255)
    val conditions = jsonb("conditions", Conditions.serializer())
    val ver = varchar("ver", 255)
    val updatedat = varchar("updatedat", 255)
}

@Serializable
data class Conditions @JsonCreator constructor(
    @JsonProperty("field") val field: String,
    @JsonProperty("value") val value: String,
) {
    override fun toString(): String {
        return "{" +
                "\"field\": \"$field\"," +
                "\"value\": \"$value\"" +
                "}"
    }
}

class RuleService {

    private val mapper = jacksonObjectMapper()

    fun selectString(sep: String) = transaction {

        val result = arrayListOf<LiveDetectRules>()
        TransactionManager.current().exec("select * from livedetectrule") { rs ->
            while (rs.next()) {

                val id = rs.getInt("id")
                val active = rs.getString("active")
                val ruleType = rs.getString("ruletype")
                val keyField = rs.getString("keyfield")
                val confirms = rs.getString("confirms")
                val cons = rs.getArray("conditions")
                val ver = rs.getString("ver")

                val updatedat = rs.getString("updatedat")

                val last = mapper.readValue<List<Conditions>>(cons.toString())
                result.add(LiveDetectRules(id, active, ruleType, keyField, confirms, last, ver, updatedat))
            }
        }
        result.joinToString(separator = "") { it.sepString(sep) }
    }

    fun selectNextID() = transaction {
        var result: Int = 0
        TransactionManager.current().exec("select id from livedetectrule n order by id desc limit 1;") { rs ->
            rs.next()
            result = rs.getInt("id")
        }

        result
    }

    fun restore(req: Array<LiveDetectRules>, hisldr: HistoryLDR2) = transaction {
        val now: String = LocalDateTime.now().format(formatter).toString()
        val conn = TransactionManager.current().connection
        val mapper = jacksonObjectMapper()

        val values = mutableListOf<String>()
        req.forEach {
            values.add(
                "('${it.active}','${it.ruletype}','${it.keyfield}','${it.confirms}', '${
                    mapper.writeValueAsString(
                        it.conditions
                    )
                }', '${it.ver}', '$now')"
            )
        }
        val valueStr = values.toString()
        val sub = valueStr.substring(1, valueStr.length - 1)
        val query = "TRUNCATE TABLE livedetectrule;" +
                "INSERT INTO livedetectrule (\"active\", \"ruletype\", \"keyfield\", \"confirms\", \"conditions\", \"ver\", \"updatedat\")\n" +
                "VALUES\n $sub;\n" +
                "INSERT INTO historyldr\n" +
                "(\"desc\", \"user\", \"released\", \"value\", \"updatedat\")\n" +
                "VALUES('${hisldr.desc}', '${hisldr.user}', '${hisldr.released}', (SELECT json_agg(livedetectrule) FROM livedetectrule), '$now')\n"
        println(query)

        val statement = conn.prepareStatement(query, false)
        statement.executeUpdate()
    }

    fun upsertbulk2(list: Array<LiveDetectRules>, hisldr: HistoryLDR2) = transaction {
        val now: String = LocalDateTime.now().format(formatter).toString()
        val conn = TransactionManager.current().connection

        val values = mutableListOf<String>()
        list.forEach {
            values.add("(${it.id},'${it.active}','${it.ruletype}', '${it.keyfield}', '${it.confirms}', CAST('${it.conditions.map { condition -> condition.toString() }}' AS JSONB), '${it.ver}', '${now}')")
        }
        val version = list[0].ver
        val valueStr = values.toString()
        val sub = valueStr.substring(1, valueStr.length - 1)

//        postgresql ver >= 9.3
        val query =
            "WITH\nn(\"id\", \"active\", \"ruletype\", \"keyfield\", \"confirms\", \"conditions\", \"ver\", \"updatedat\") AS (\n" +
                    "VALUES\n $sub \n),\n" +
                    "upsert AS (\n" +
                    "UPDATE livedetectrule o\n" +
                    "SET active = n.active, ruletype = n.ruletype , keyfield = n.keyfield, confirms = n.confirms, conditions = n.conditions, ver = n.ver, updatedat = n.updatedat\n" +
                    "FROM n WHERE o.id = CAST(n.id AS INTEGER) RETURNING o.id \n)\n" +
                    "INSERT INTO livedetectrule(\"id\", \"active\", \"ruletype\", \"keyfield\", \"confirms\", \"conditions\", \"ver\", \"updatedat\")\n" +
                    "SELECT n.id, n.active, n.ruletype, n.keyfield, n.confirms, n.conditions, n.ver, n.updatedat FROM n\n" +
                    "WHERE n.id NOT IN ( SELECT id FROM upsert );\n" +
//                update version
                    "update livedetectrule set ver=${version};\n" +
//                insert history
                    "INSERT INTO historyldr\n" +
                    "(\"desc\", \"user\", \"released\", \"value\", \"updatedat\")\n" +
                    "VALUES('${hisldr.desc}', '${hisldr.user}', '${hisldr.released}', (SELECT json_agg(livedetectrule) FROM livedetectrule), '$now')\n"
//        println(query)
        val statement = conn.prepareStatement(query, false)
        statement.executeUpdate()

        val hisCount: Long = HistoryLDRTable.selectAll().count()
        val subquery = HistoryLDRTable.slice(HistoryLDRTable.updatedat.min()).selectAll().limit(1)
        if (hisCount > 10) HistoryLDRTable.deleteWhere { HistoryLDRTable.updatedat eq wrapAsExpression(subquery) }

    }


    fun upsertbulk(list: Array<LiveDetectRules>) = transaction {
        val now: String = LocalDateTime.now().format(formatter).toString()
        val conn = TransactionManager.current().connection
        val values = mutableListOf<String>()

        list.forEach {
            values.add("(${it.id},'${it.active}','${it.ruletype}', '${it.keyfield}', '${it.confirms}', CAST('${it.conditions.map { condition -> condition.toString() }}' AS JSONB), '${it.ver}', '${now}')")
        }
        val valueStr = values.toString()
        val sub = valueStr.substring(1, valueStr.length - 1)
//        postgresql ver >= 9.3
        val query =
            "WITH\nn(\"id\", \"active\", \"ruletype\", \"keyfield\", \"confirms\", \"conditions\", \"ver\", \"updatedat\") AS (\n" +
                    "VALUES\n $sub \n),\n" +
                    "upsert AS (\n" +
                    "UPDATE livedetectrule o\n" +
                    "SET active = n.active, ruletype = n.ruletype , keyfield = n.keyfield, confirms = n.confirms, conditions = n.conditions, ver = n.ver, updatedat = n.updatedat\n" +
                    "FROM n WHERE o.id = CAST(n.id AS INTEGER) RETURNING o.id \n)\n" +
                    "INSERT INTO livedetectrule(\"id\", \"active\", \"ruletype\", \"keyfield\", \"confirms\", \"conditions\", \"ver\", \"updatedat\")\n" +
                    "SELECT n.id, n.active, n.ruletype, n.keyfield, n.confirms, n.conditions, n.ver, n.updatedat FROM n\n" +
                    "WHERE n.id NOT IN ( SELECT id FROM upsert );\n" +
//                insert history
                    "INSERT INTO historyldr\n" +
                    "(\"desc\", \"user\", \"released\", \"value\", \"updatedat\")\n" +
                    "VALUES('test', 'admin', 'false', (SELECT json_agg(livedetectrule) FROM livedetectrule), '$now')\n"

        val statement = conn.prepareStatement(query, false)
        statement.executeUpdate()

    }

    fun delete(id: String) = transaction {
        val conn = TransactionManager.current().connection
        val query = "DELETE FROM livedetectrule WHERE id = '${id}';"
        val statement = conn.prepareStatement(query, false)
        statement.executeUpdate()
    }

    //TODO:: insert(rule:LiveDetectRules) -> ${}
    fun insert(req: LiveDetectRules) = transaction {
        val mapper = jacksonObjectMapper()
        val conn = TransactionManager.current().connection
        println(req.conditions)
        val query = "INSERT INTO livedetectrule\n" +
                "(\"active\", \"ruletype\", \"keyfield\", \"confirms\", \"conditions\", \"ver\")\n" +
                "VALUES('${req.active}', '${req.ruletype}', '${req.keyfield}', '${req.confirms}', '${
                    mapper.writeValueAsString(
                        req.conditions
                    )
                }', '${req.ver}')\n"
        val statement = conn.prepareStatement(query, false)
        statement.executeUpdate()
    }


    fun getCountFilters(filters: String) = transaction {
        var result: Int = 0
        TransactionManager.current().exec("select count(1) from livedetectrule where $filters") { rs ->
            rs.next()
            result = rs.getInt("count")
        }
        result
    }

    fun getCountRows() = transaction {
        var result: Int = 0 //다른방법은 없나
        TransactionManager.current().exec("select count(1) from livedetectrule") { rs ->
            rs.next()
            result = rs.getInt("count")
        }
        result
    }

    fun select(offset: String, limit: String) = transaction {
        val result = arrayListOf<LiveDetectRules>()
        val now: String = LocalDateTime.now().format(formatter).toString()
        TransactionManager.current().exec("select * from livedetectrule limit $limit offset $offset") { rs ->
            while (rs.next()) {

                var id = rs.getInt("id")
                var active = rs.getString("active")
                var ruleType = rs.getString("ruleType")
                var keyField = rs.getString("keyField")
                var confirms = rs.getString("confirms")
                var cons = rs.getArray("conditions")
                var ver = rs.getString("ver")
                val mapper = jacksonObjectMapper()

                var last = mapper.readValue<List<Conditions>>(cons.toString())
                result += LiveDetectRules(id, active, ruleType, keyField, confirms, last, ver, now)
            }
        }
        result
    }

    fun selectFilters(offset: String, limit: String, filters: String) = transaction {

        val result = arrayListOf<LiveDetectRules>()
        val now: String = LocalDateTime.now().format(formatter).toString()
        TransactionManager.current()
            .exec("select * from livedetectrule where $filters limit $limit offset $offset") { rs ->

                while (rs.next()) {

                    var id = rs.getInt("id")
                    var active = rs.getString("active")
                    var ruleType = rs.getString("ruleType")
                    var keyField = rs.getString("keyField")
                    var confirms = rs.getString("confirms")
                    var cons = rs.getArray("conditions")
                    var ver = rs.getString("ver")
                    val mapper = jacksonObjectMapper()

                    var last = mapper.readValue<List<Conditions>>(cons.toString())
                    result += LiveDetectRules(id, active, ruleType, keyField, confirms, last, ver, now)
                }
            }
        result
    }

    fun deleteAll() = transaction {
        val conn = TransactionManager.current().connection
        val query = "delete from livedetectrule"
        val statement = conn.prepareStatement(query, false)
        statement.executeUpdate()
    }

}