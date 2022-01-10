package com.sample.services

import com.sample.data.release.Release
import com.sample.data.release.ReleaseEntity
import com.sample.data.release.ReleaseTable
import com.sample.utils.formatter
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime


class ReleaseService {
    fun selectAll(): Iterable<Release> = transaction {
        ReleaseEntity.all().map(ReleaseEntity::toRelease)
    }

    //TODO:: limit 쿼리로 바꿀것
    fun selectPart(): Iterable<Release> = transaction{


        val tmp = ReleaseEntity.all().map(ReleaseEntity::toRelease).sortedByDescending { it.updatedAt }

        if(tmp.size > 10) {
            println("hi"+tmp.last())
            ReleaseEntity.find { ReleaseTable.id eq tmp.last().id }.firstOrNull()?.delete()
        }
        tmp.filterIndexed{index, item -> index < 10}

    }

    fun select(id: Int): Release = transaction {
        ReleaseEntity.find { ReleaseTable.id eq id}.firstOrNull()?.toRelease() ?: throw Exception("Not in Field.")
    }

    fun update(release: Release) = transaction {
        val now: String = LocalDateTime.now().format(formatter).toString()
        ReleaseEntity.find { ReleaseTable.id eq release.id}.firstOrNull()?.apply {
            this.value = release.value
            this.desc = release.desc
            this.updatedAt = now
        }
    }

    fun insert(release: Release) = transaction {
        val now: String = LocalDateTime.now().format(formatter).toString()
        val temp = ReleaseEntity.new {
            this.desc = release.desc
            this.updatedAt = now
            this.value = release.value
        }
    }
//
//    fun delete(ids: Iterable<Int>) = transaction {
//        ids.forEach { id ->
//            FieldEntity.find { ReleaseTable.id eq id }.firstOrNull()?.delete()
////            NodeEntity[id].delete()
//        }
//    }
}