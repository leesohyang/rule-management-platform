package com.sample.data.release

import com.sample.utils.jsonb
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.Column

data class Release(
    val id: Int,
    val value: ReleaseData,
    val desc: String,
    val updatedAt: String?,
)

@Serializable
data class ReleaseData(
    val release: ArrayList<Map<String, String>>,
)

object ReleaseTable : IntIdTable() {
    val value = jsonb("value", ReleaseData.serializer() )
    val desc: Column<String> = varchar("desc", 255)
    val updatedAt: Column<String> = varchar("updated_at", 255)
}

class ReleaseEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<ReleaseEntity>(ReleaseTable)

    var value by ReleaseTable.value
    var desc by ReleaseTable.desc
    var updatedAt by ReleaseTable.updatedAt

    override fun toString(): String =  "Release($value, $desc, $updatedAt)"

    fun toRelease(): Release = Release(id.value , value, desc, updatedAt)
}
