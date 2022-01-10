package com.sample.services

import com.sample.data.release.ReleaseForm
import com.sample.data.release.ReleaseFormEntity
import com.sample.data.release.ReleaseFormTable
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction

class ReleaseFormService {

    fun selectByType(type: String) = transaction {
        ReleaseFormEntity.find { ReleaseFormTable.type eq type}.firstOrNull()?.toReleaseForm() ?: throw Exception("Not in Field.")
    }


    fun selectAll(): Iterable<ReleaseForm> = transaction {
        ReleaseFormEntity.all().map(ReleaseFormEntity::toReleaseForm)
    }
    //TODO:: only for json field search query => livedetectrule만 sql로 하자..
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