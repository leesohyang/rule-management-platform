package com.sample.services.history

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.sample.data.history.HistoryLDR
import com.sample.services.LiveDetectRules
import com.sample.utils.formatter
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime


class HistoryLDRService {

    val mapper = jacksonObjectMapper()

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
                val v = mapper.readValue<List<LiveDetectRules>>(value.toString())
                val updatedat = rs.getString("updatedat")
                result.add(HistoryLDR(id,desc, user, released, v, updatedat))
            }
        }
        result
//        TransactionManager.current().close()
    }

    fun select(id: String) = transaction {
        //TODO::null check
        TransactionManager.current().exec("select * from historyldr where id=$id limit 1") { rs ->
            rs.next()
            val hid = rs.getInt("id")
            val desc = rs.getString("desc")
            val user = rs.getString("user")
            val released = rs.getString("released")
            val value = rs.getArray("value")
            println(value)
            val v = mapper.readValue<List<LiveDetectRules>>(value.toString())
            val updatedat = rs.getString("updatedat")

            return@exec HistoryLDR(hid, desc, user, released, v, updatedat)
        }
    }

    fun updateRelease(history: HistoryLDR) = transaction {
        val now: String = LocalDateTime.now().format(formatter).toString()
        val conn = TransactionManager.current().connection
        val query =
            "UPDATE historyldr\n" +
                    "SET desc = '${history.desc}', user = '${history.user}', released = 'true', updatedat = '${now}'\n" +
                    "WHERE id='${history.id}';"

        val statement = conn.prepareStatement(query, false)
        statement.executeUpdate()
    }

    fun insert(history: HistoryLDR) = transaction {
        val now: String = LocalDateTime.now().format(formatter).toString()
        val conn = TransactionManager.current().connection
        val query = "INSERT INTO historyldr\n" +
                "(\"desc\", \"user\", \"released\", \"value\", \"updatedat\")\n" +
                "VALUES('${history.desc}', '${history.user}','${history.released}', '${mapper.writeValueAsString(history.value)}', '${now}');\n"
        val statement = conn.prepareStatement(query, false)
        statement.executeUpdate()
    }

    fun delete(ids: List<String>) = transaction {
        val list = ids.toString().replace('[','(').replace(']',')')
        val conn = TransactionManager.current().connection
        val query = "DELETE FROM historyldr\n" +
                "WHERE id in $list;"
        println(query)
        val statement = conn.prepareStatement(query, false)
        statement.executeUpdate()
    }
}