package com.sample.services.releaseform

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.sample.data.releaseform.ReleaseForm
import com.sample.data.releaseform.ReleaseFormEntity
import com.sample.data.releaseform.ReleaseFormTable
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.File

/**
 * Service class for ReleaseForm transaction
 * @version 1.0.0
 */
class ReleaseFormService {

    /**
     * String to Object mapper
     */
    private val mapper = jacksonObjectMapper()

    /**
     * Transaction for initializing release form database
     * Read ReleaseForm.json and then insert release form into database
     * Used Kotlin Exposed DAO
     */
    fun init() = transaction {
        val count: Long = ReleaseFormEntity.count()
        println("Count: $count")
        if (count < 1) {
            val wDir = System.getProperty("user.dir")
            val rf = mapper.readValue<ReleaseForm>(File("$wDir/backend/src/utils/ReleaseForm.json"))
            ReleaseFormEntity.new {
                this.type = rf.type
                this.value = rf.value
                this.signal = rf.signal
            }
        }
    }

    /**
     * Transaction to select release form from database by type
     * Used Kotlin Exposed DAO
     * @param type  rule type string for release form. ex> Field, LiveDetectRule, NormalizeRule
     */
    fun selectByType(type: String) = transaction {
        ReleaseFormEntity.find { ReleaseFormTable.type eq type}.firstOrNull()?.toReleaseForm() ?: throw Exception("Not in Field.")
    }

    /**
     * Transaciton to select all of release form from database
     * Used Kotlin Exposed DAO
     */
    fun selectAll(): Iterable<ReleaseForm> = transaction {
        ReleaseFormEntity.all().map(ReleaseFormEntity::toReleaseForm)
    }
}