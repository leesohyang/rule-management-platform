package com.sample.services.header

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.sample.data.header.HeaderEntity
import com.sample.data.header.HeaderInfo
import com.sample.utils.formatter
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.File
import java.time.LocalDateTime

/**
 * Service class for Table Header transaction
 * @version 1.0.0
 */
class HeaderService {

    /**
     * String to Object mapper
     */
    private val mapper = jacksonObjectMapper()

    /**
     * Transaction for initializing database.
     * Read HeaderForm.json and then insert header into database
     * Used Kotlin Exposed DAO
     */
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

    /**
     * Transaction to change the header to the previously used header
     * Used Kotlin Exposed SQL Transaction Manager
     * @param version   Header version what you want.
     * @return          HeaderInfo data class
     */
    fun restoreHeader(version: String) = transaction {
        var result = HeaderInfo()
        TransactionManager.current().exec("select * from \"header\" h where info ->> \'ver\' = \'$version\'"){
            rs ->
            while(rs.next()){
                val content = rs.getString("info")
                val mapper = jacksonObjectMapper()
                result = mapper.readValue(content)
            }
        }
        result
    }

    /**
     * Transaction to deactivate previous header
     * Used Kotlin Exposed SQL Transaction Manager
     */
    fun deActive () = transaction {
        TransactionManager.current().exec(
            "update \"header\" " +
                    "set info = jsonb_set(info, \'{type}\', \'\"dead\"\', false) where info ->> \'type\'=\'live\'" )
    }

    /**
     * Transaction to activate new header
     * Used Kotlin Exposed SQL Transaction Manager
     * @param version   New header version
     */
    fun active (version: String) = transaction {
        val now: String = LocalDateTime.now().format(formatter).toString()
        TransactionManager.current().exec(
            "update \"header\" " +
                    "set info = jsonb_set(info, \'{type}\', \'\"live\"\', false), updatedat=\'$now\' where info ->> \'ver\'=\'$version\'" )
    }

    /**
     * Transaction to select activated header from database
     * Used Kotlin Exposed SQL Transaction Manager
     * @return      HeaderInfo data class
     */
    fun selectLiveHeader() = transaction {
        var result = HeaderInfo()
        TransactionManager.current().exec("select * from \"header\" h  where h.info ->> 'type'='live'"){
            rs ->
            while(rs.next()){
                val content = rs.getString("info")
                val mapper = jacksonObjectMapper()
                result = mapper.readValue(content)
            }
        }
        result
    }

    /**
     * Transaction to insert Header to database
     * Used Kotlin Exposed SQL Transaction Manager
     * @param req   HeaderInfo data class
     */
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