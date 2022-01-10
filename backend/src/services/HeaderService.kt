package com.sample.services

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.sample.data.header.HeaderEntity
import com.sample.data.header.HeaderInfo
import com.sample.utils.formatter
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.File
import java.time.LocalDateTime

class HeaderService {

    private val mapper = jacksonObjectMapper()

    fun init() = transaction {
        val count: Long = HeaderEntity.count()
        if (count < 1) {
            val now: String = LocalDateTime.now().format(formatter).toString()
            val wDir = System.getProperty("user.dir")
            val rf = mapper.readValue<HeaderInfo>(File("$wDir/backend/src/utils/HeaderForm.json"))
            HeaderEntity.new {
                this.info = rf
                this.updatedAt = now
            }
        }
    }

    fun restoreHeader(version: String) = transaction {
        var result: HeaderInfo = HeaderInfo()
        TransactionManager.current().exec("select * from \"header\" h where info ->> \'ver\' = \'$version\'"){
            rs ->
            while(rs.next()){
                var content = rs.getString("info")
                val mapper = jacksonObjectMapper()
                result = mapper.readValue<HeaderInfo>(content)
            }
        }
        result
    }

    fun deActive () = transaction {
        var result: HeaderInfo = HeaderInfo()
        TransactionManager.current().exec(
            "update \"header\" " +
                    "set info = jsonb_set(info, \'{type}\', \'\"dead\"\', false) where info ->> \'type\'=\'live\'" )
    }

    fun active (version: String) = transaction {
        var result: HeaderInfo = HeaderInfo()
        val now: String = LocalDateTime.now().format(formatter).toString()
        TransactionManager.current().exec(
            "update \"header\" " +
                    "set info = jsonb_set(info, \'{type}\', \'\"live\"\', false), updatedat=\'$now\' where info ->> \'ver\'=\'$version\'" )
    }

    fun selectLiveHeader() = transaction {
        var result: HeaderInfo = HeaderInfo()
//        TransactionManager.current().exec("select * from \"header\" h  order by h.updatedat desc limit 1"){
        TransactionManager.current().exec("select * from \"header\" h  where h.info ->> 'type'='live'"){
            rs ->
            while(rs.next()){
                var content = rs.getString("info")
                val mapper = jacksonObjectMapper()
                result = mapper.readValue<HeaderInfo>(content)
            }
        }
        result
    }
    fun insert (req: HeaderInfo) = transaction {
        val mapper = jacksonObjectMapper()
        val conn = TransactionManager.current().connection
        val now: String = LocalDateTime.now().format(formatter).toString()
        val query = "INSERT INTO header\n" +
                "(\"info\", \"updatedat\")\n" +
                "VALUES('${mapper.writeValueAsString(req)}', '${now}')\n"
        val statement = conn.prepareStatement(query, false)
        statement.executeUpdate()
    }


}