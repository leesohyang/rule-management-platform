package com.sample.services.history

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.sample.data.*
import com.sample.data.field.FieldEntity
import com.sample.data.history.HistoryLDR
//import com.sample.data.history.HistoryLDREntity
import com.sample.data.history.HistoryLDRTable
import com.sample.services.LiveDetectRules
import com.sample.utils.formatter
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime


class HistoryLDRService {


//    fun selectAll(): Iterable<History> = transaction {
//        HistoryLDREntity.all().map(HistoryLDREntity::toHistoryLDR)
//    }

    //TODO:: limit 쿼리로 바꿀것
//    fun selectPart(): Iterable<History> = transaction{
//        val tmp = HistoryLDREntity.all().map(HistoryLDREntity::toHistoryLDR).sortedByDescending { it.updatedAt }
//
//        if(tmp.size > 10) {
//            println("hi"+tmp.last())
//            HistoryLDREntity.find { HistoryLDRTable.id eq tmp.last().id }.firstOrNull()?.delete()
//        }
//        tmp.filterIndexed{index, item -> index < 10}
//
//    }
    fun selectPart() = transaction {
        val mapper = jacksonObjectMapper()
        val result = arrayListOf<HistoryLDR>()
        TransactionManager.current().exec("select * from historyldr") { rs ->
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
//    fun select(id: Int): History = transaction {
//        HistoryLDREntity.find { HistoryLDRTable.id eq id}.firstOrNull()?.toHistoryLDR() ?: throw Exception("Not in Field.")
//    }
//
//    fun update(history: History) = transaction {
//        val now: String = LocalDateTime.now().format(formatter).toString()
//        HistoryLDREntity.find { HistoryLDRTable.id eq history.id}.firstOrNull()?.apply {
//            this.desc = history.desc
//            this.user = history.user
//            this.updatedAt = now
//            this.released = "true"
//        }
//    }
//
//    fun insert(history: History) = transaction {
//        val now: String = LocalDateTime.now().format(formatter).toString()
//        val temp = HistoryLDREntity.new {
//            this.desc = history.desc
//            this.user = history.user
//            this.updatedAt = now
//            this.released = history.released
//            this.value = history.value
//        }
//    }
//
//    fun delete(ids: Iterable<Int>) = transaction {
//        ids.forEach { id ->
//            HistoryLDREntity.find { HistoryLDRTable.id eq id }.firstOrNull()?.delete()
////            NodeEntity[id].delete()
//        }
//    }
}