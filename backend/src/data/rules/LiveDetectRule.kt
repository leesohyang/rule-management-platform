package com.sample.data.rules

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty
import com.sample.utils.jsonb
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.dao.id.IntIdTable

@Serializable
data class LiveDetectRule(
    val id: Int,
    val active: String,
    val ruletype: String,
    val keyfield: String,
    val confirms: String,
    val conditions: List<Conditions>,
    val ver: String,
    val updatedat: String?
){
    fun sepString(sep: String): String {
        return "$id$sep$active$sep$ruletype$sep$keyfield$sep$confirms$sep$conditions$sep$ver\n"
    }
}

object LiveDetectRuleTable : IntIdTable() {
    val active = varchar("active", 255)
    val ruletype = varchar("ruletype", 255)
    val keyfield = varchar("keyfield", 255)
    val corfirms = varchar("confirms", 255)
    val conditions = jsonb("conditions", Conditions.serializer())
    val ver = varchar("ver", 255)
    val updatedat = varchar("updatedat", 255)
}

@Serializable
data class Conditions @JsonCreator constructor(
    @JsonProperty("field") val field: String,
    @JsonProperty("value") val value: String,
) {
    override fun toString(): String {
        return "{" +
                "\"field\": \"$field\"," +
                "\"value\": \"$value\"" +
                "}"
    }
}
