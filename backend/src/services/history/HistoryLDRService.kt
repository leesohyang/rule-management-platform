package com.sample.services.history

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.sample.data.history.HistoryLDR
import com.sample.data.rules.LiveDetectRule
import com.sample.utils.formatter
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime

/**
 * Service class for LiveDetectRule History transaction
 * @version 1.0.0
 */
class HistoryLDRService {

    /**
     * String to Object mapper
     */
    private val mapper = jacksonObjectMapper()

    /**
     * Select live detect rule history from database with offset and limit
     * Used Kotlin Exposed SQL Transaction Manager
     * @param offset    Select query offset
     * @param limit     Select query limit
     * @return          Array list of HistoryLDR data class
     */
    fun selectAll(offset: String, limit: String) = transaction {
        val result = arrayListOf<HistoryLDR>()
        TransactionManager.current().exec("select * from historyldr offset $offset limit $limit") { rs ->
            while(rs.next()) {

                val id = rs.getInt("id")
                val desc = rs.getString("desc")
                val user = rs.getString("user")
                val released = rs.getString("released")
                val value = rs.getArray("value")
                println(value)
                val v = mapper.readValue<List<LiveDetectRule>>(value.toString())
                val updatedat = rs.getString("updatedat")
                result.add(HistoryLDR(id,desc, user, released, v, updatedat))
            }
        }
        result
    }

    /**
     * Insert live detect rule history to database
     * Used Kotlin Exposed SQL Transaction Manager
     * @param history   HistoryLDR data class
     */
    fun insert(history: HistoryLDR) = transaction {
        val now: String = LocalDateTime.now().format(formatter).toString()
        val conn = TransactionManager.current().connection
        val query = "INSERT INTO historyldr\n" +
                "(\"desc\", \"user\", \"released\", \"value\", \"updatedat\")\n" +
                "VALUES('${history.desc}', '${history.user}','${history.released}', '${mapper.writeValueAsString(history.value)}', '${now}');\n"
        val statement = conn.prepareStatement(query, false)
        statement.executeUpdate()
    }
}