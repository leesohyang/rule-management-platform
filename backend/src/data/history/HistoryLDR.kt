package com.sample.data.history

import org.jetbrains.exposed.dao.id.IntIdTable
import com.sample.data.jsonb
import com.sample.services.LiveDetectRules
import kotlinx.serialization.Serializable


@Serializable
data class HistoryLDR(
    val id: Int,
    val desc: String,
    val user: String,
    val released: String, //TODO:: string -> boolean
    val value: List<LiveDetectRules>,
    val updatedat: String?,
)

@Serializable
data class HistoryLDR2(
    val desc: String,
    val user: String,
    val released: String, //TODO:: string -> boolean
)

object HistoryLDRTable : IntIdTable() {
    val desc = varchar("desc", 255)
    val user = varchar("user", 255)
    val released = varchar("released", 255)
    val value = jsonb("value", LiveDetectRules.serializer())
    val updatedat = varchar("updatedat", 255)
}
//object HistoryLDRTable : IntIdTable() {
//    val desc = varchar("desc", 255)
//    val user = varchar("user", 255)
//    val updatedAt = varchar("updatedat", 255)
//    val released = varchar("released", 255)
//
//}
//

//class HistoryLDREntity(id: EntityID<Int>) : IntEntity(id) {
//    companion object : IntEntityClass<HistoryLDREntity>(HistoryLDRTable)
//
//    var desc by HistoryLDRTable.desc
//    var user by HistoryLDRTable.user
//    var updatedAt by HistoryLDRTable.updatedAt
//    var released by HistoryLDRTable.released
//    var value by HistoryLDRTable.value
//
//    override fun toString(): String = "History($desc, $user, $updatedAt, $released, $value)"
//    fun toHistoryLDR(): History = History(id.value, desc, user, updatedAt, released, value, )
//}
