package com.sample.services.rules

import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.sample.data.history.HistoryLDR2
import com.sample.data.history.HistoryLDRTable
import com.sample.data.rules.Conditions
import com.sample.data.rules.LiveDetectRule
import com.sample.utils.formatter
import org.jetbrains.exposed.sql.deleteWhere
import org.jetbrains.exposed.sql.min
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.wrapAsExpression
import java.time.LocalDateTime

/**
 * Service class for LiveDetectRule transaction
 * @version 1.0.0
 */
class LiveDetectRuleService {

    /**
     * String to Object mapper
     */
    private val mapper = jacksonObjectMapper()

    /**
     * Transaciton to select rows and join to string from database
     * Used Kotlin Exposed SQL Transaction Manager
     * @param sep   Separator string
     */
    fun selectString(sep: String) = transaction {
        val result = arrayListOf<LiveDetectRule>()
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
                result.add(LiveDetectRule(id, active, ruleType, keyField, confirms, last, ver, updatedat))
            }
        }
        result.joinToString(separator = "") { it.sepString(sep) }
    }

    /**
     * Transaction to get last id
     */
    fun selectNextID() = transaction {
        var result: Int = 0
        TransactionManager.current().exec("select id from livedetectrule n order by id desc limit 1;") { rs ->
            rs.next()
            result = rs.getInt("id")
        }

        result
    }

    /**
     * Transaction to change LiveDetectRule table contents to other
     * Used Kotlin Exposed SQL Transaction Manager
     * @param req       array of LiveDetectRule data class
     * @param hisldr    LiveDetectRule history data class
     */
    fun restore(req: Array<LiveDetectRule>, hisldr: HistoryLDR2) = transaction {
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

        val statement = conn.prepareStatement(query, false)
        statement.executeUpdate()
    }

    /**
     * Transaction to insert or update LiveDetectRule to database
     * Required postgresql ver >= 9.3
     * Used Kotlin Exposed SQL Transaction Manager
     * Used Kotlin Exposed DSL
     * @param list      array of LiveDetectRule data class
     * @param hisldr    LiveDetectRule history data class
     */
    fun upsertbulk2(list: Array<LiveDetectRule>, hisldr: HistoryLDR2) = transaction {
        val now: String = LocalDateTime.now().format(formatter).toString()
        val conn = TransactionManager.current().connection

        val values = mutableListOf<String>()
        list.forEach {
            values.add("(${it.id},'${it.active}','${it.ruletype}', '${it.keyfield}', '${it.confirms}', CAST('${it.conditions.map { condition -> condition.toString() }}' AS JSONB), '${it.ver}', '${now}')")
        }
        val version = list[0].ver
        val valueStr = values.toString()
        val sub = valueStr.substring(1, valueStr.length - 1)

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
                    // update version
                    "update livedetectrule set ver=${version};\n" +
                    // insert history
                    "INSERT INTO historyldr\n" +
                    "(\"desc\", \"user\", \"released\", \"value\", \"updatedat\")\n" +
                    "VALUES('${hisldr.desc}', '${hisldr.user}', '${hisldr.released}', (SELECT json_agg(livedetectrule) FROM livedetectrule), '$now')\n"
        val statement = conn.prepareStatement(query, false)
        statement.executeUpdate()

        val hisCount: Long = HistoryLDRTable.selectAll().count()
        val subquery = HistoryLDRTable.slice(HistoryLDRTable.updatedat.min()).selectAll().limit(1)
        if (hisCount > 10) HistoryLDRTable.deleteWhere { HistoryLDRTable.updatedat eq wrapAsExpression(subquery) }

    }

    /**
     * Transaction to insert or update LiveDetectRule to database
     * Required postgresql ver >= 9.3
     * Used Kotlin Exposed SQL Transaction Manager
     * @param list      array of LiveDetectRule data class
     */
    fun upsertbulk(list: Array<LiveDetectRule>) = transaction {
        val now: String = LocalDateTime.now().format(formatter).toString()
        val conn = TransactionManager.current().connection
        val values = mutableListOf<String>()

        list.forEach {
            values.add("(${it.id},'${it.active}','${it.ruletype}', '${it.keyfield}', '${it.confirms}', CAST('${it.conditions.map { condition -> condition.toString() }}' AS JSONB), '${it.ver}', '${now}')")
        }
        val valueStr = values.toString()
        val sub = valueStr.substring(1, valueStr.length - 1)
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
                    // insert history
                    "INSERT INTO historyldr\n" +
                    "(\"desc\", \"user\", \"released\", \"value\", \"updatedat\")\n" +
                    "VALUES('test', 'admin', 'false', (SELECT json_agg(livedetectrule) FROM livedetectrule), '$now')\n"

        val statement = conn.prepareStatement(query, false)
        statement.executeUpdate()

    }

    /**
     * Transaction to delete LiveDetectRule from database
     * Used Kotlin Exposed SQL Transaction Manager
     * @param id    LiveDetectRule id
     */
    fun delete(id: String) = transaction {
        val conn = TransactionManager.current().connection
        val query = "DELETE FROM livedetectrule WHERE id = '${id}';"
        val statement = conn.prepareStatement(query, false)
        statement.executeUpdate()
    }

    /**
     * Transaction to insert LiveDetectRule to database
     * Used Kotlin Exposed SQL Transaction Manager
     * @param req   LiveDetectRule data class
     */
    fun insert(req: LiveDetectRule) = transaction {
        val mapper = jacksonObjectMapper()
        val conn = TransactionManager.current().connection
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

    /**
     * Transaction to get count of specific LiveDetectRule rows from database with filter
     * Used Kotlin Exposed SQL Transaction Manager
     * @param filters   filter rule string
     * @return          row count
     */
    fun getCountFilters(filters: String) = transaction {
        var result: Int = 0
        TransactionManager.current().exec("select count(1) from livedetectrule where $filters") { rs ->
            rs.next()
            result = rs.getInt("count")
        }
        result
    }

    /**
     * Transaction to get row count of LiveDetectRule from database
     * Used Kotlin Exposed SQL Transaction Manager
     * @return      row count
     */
    fun getCountRows() = transaction {
        var result: Int = 0 //다른방법은 없나
        TransactionManager.current().exec("select count(1) from livedetectrule") { rs ->
            rs.next()
            result = rs.getInt("count")
        }
        result
    }

    /**
     * Transaction to select LiveDetectRule from database with offset and limit
     * Used Kotlin Exposed SQL Transaction Manager
     * @param offset    offset num to string
     * @param limit     limit num to string
     * @return          arrayList of LiveDetectRule
     */
    fun select(offset: String, limit: String) = transaction {
        val result = arrayListOf<LiveDetectRule>()
        val now: String = LocalDateTime.now().format(formatter).toString()
        TransactionManager.current().exec("select * from livedetectrule limit $limit offset $offset") { rs ->
            while (rs.next()) {

                val id = rs.getInt("id")
                val active = rs.getString("active")
                val ruleType = rs.getString("ruleType")
                val keyField = rs.getString("keyField")
                val confirms = rs.getString("confirms")
                val cons = rs.getArray("conditions")
                val ver = rs.getString("ver")
                val mapper = jacksonObjectMapper()

                val last = mapper.readValue<List<Conditions>>(cons.toString())
                result += LiveDetectRule(id, active, ruleType, keyField, confirms, last, ver, now)
            }
        }
        result
    }

    /**
     * Transaction to select specific LiveDetectRule from database with offset, limit and filters
     * Used Kotlin Exposed SQL Transaction Manager
     * @param offset    offset num to string
     * @param limit     limit num to string
     * @param filters   filter rule string
     * @return          arrayList of LiveDetectRule
     */
    fun selectFilters(offset: String, limit: String, filters: String) = transaction {

        val result = arrayListOf<LiveDetectRule>()
        val now: String = LocalDateTime.now().format(formatter).toString()
        TransactionManager.current()
            .exec("select * from livedetectrule where $filters limit $limit offset $offset") { rs ->
                while (rs.next()) {
                    val id = rs.getInt("id")
                    val active = rs.getString("active")
                    val ruleType = rs.getString("ruleType")
                    val keyField = rs.getString("keyField")
                    val confirms = rs.getString("confirms")
                    val cons = rs.getArray("conditions")
                    val ver = rs.getString("ver")
                    val mapper = jacksonObjectMapper()

                    val last = mapper.readValue<List<Conditions>>(cons.toString())
                    result += LiveDetectRule(id, active, ruleType, keyField, confirms, last, ver, now)
                }
            }
        result
    }

    /**
     * Transaction to delete all of LiveDetectRules from database
     * Used Kotlin Exposed SQL Transaction Manager
     */
    fun deleteAll() = transaction {
        val conn = TransactionManager.current().connection
        val query = "delete from livedetectrule"
        val statement = conn.prepareStatement(query, false)
        statement.executeUpdate()
    }

}