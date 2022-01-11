package com.sample.data.history

import org.jetbrains.exposed.dao.id.IntIdTable
import com.sample.data.rules.LiveDetectRule
import com.sample.utils.jsonb
import kotlinx.serialization.Serializable


@Serializable
data class HistoryLDR(
    val id: Int,
    val desc: String,
    val user: String,
    val released: String, //TODO:: string -> boolean
    val value: List<LiveDetectRule>,
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
    val value = jsonb("value", LiveDetectRule.serializer())
    val updatedat = varchar("updatedat", 255)
}
