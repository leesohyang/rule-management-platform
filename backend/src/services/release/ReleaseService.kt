package com.sample.services.release

import com.sample.data.release.Release
import com.sample.data.release.ReleaseEntity
import com.sample.data.release.ReleaseTable
import com.sample.utils.formatter
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime

/**
 * Service class for Release transaction
 * @version 1.0.0
 */
class ReleaseService {

    /**
     * Transaciton to select 10 rows sorted by updatedAt from database
     * Used Kotlin Exposed DAO
     */
    fun selectPart(): Iterable<Release> = transaction{
        val tmp = ReleaseEntity.all().map(ReleaseEntity::toRelease).sortedByDescending { it.updatedAt }
        if (tmp.size > 10) {
            ReleaseEntity.find { ReleaseTable.id eq tmp.last().id }.firstOrNull()?.delete()
        }
        tmp.filterIndexed{index, item -> index < 10}

    }

    /**
     * Transaciton to select release by id from database
     * Used Kotlin Exposed DAO
     * @param id    Int, release id
     */
    fun select(id: Int): Release = transaction {
        ReleaseEntity.find { ReleaseTable.id eq id}.firstOrNull()?.toRelease() ?: throw Exception("Not in Field.")
    }

    /**
     * Transaciton to update release
     * Used Kotlin Exposed DAO
     * @param release   Release data class
     */
    fun update(release: Release) = transaction {
        val now: String = LocalDateTime.now().format(formatter).toString()
        ReleaseEntity.find { ReleaseTable.id eq release.id}.firstOrNull()?.apply {
            this.value = release.value
            this.desc = release.desc
            this.updatedAt = now
        }
    }

    /**
     * Transaciton to insert release to database
     * Used Kotlin Exposed DAO
     * @param release   Release data class
     */
    fun insert(release: Release) = transaction {
        val now: String = LocalDateTime.now().format(formatter).toString()
        ReleaseEntity.new {
            this.desc = release.desc
            this.updatedAt = now
            this.value = release.value
        }
    }
}