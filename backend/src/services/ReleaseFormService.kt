package com.sample.services

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.sample.data.release.ReleaseForm
import com.sample.data.release.ReleaseFormEntity
import com.sample.data.release.ReleaseFormTable
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.File


class ReleaseFormService {

    private val mapper = jacksonObjectMapper()

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

    fun selectByType(type: String) = transaction {
        ReleaseFormEntity.find { ReleaseFormTable.type eq type}.firstOrNull()?.toReleaseForm() ?: throw Exception("Not in Field.")
    }


    fun selectAll(): Iterable<ReleaseForm> = transaction {
        ReleaseFormEntity.all().map(ReleaseFormEntity::toReleaseForm)
    }

    fun select(type: String) = transaction {
        TransactionManager.current().exec("select * from releaseform r where value ->> 'makeSubNode' = 'true'") { rs ->
            while(rs.next()) {
                println(rs.getString("type"))
            }
//            }
            rs
            rs.close()
        }
    }

}