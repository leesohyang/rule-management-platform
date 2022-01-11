package com.sample.data.header

import com.sample.utils.jsonb
import kotlinx.serialization.Serializable
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.Column

/**
 *  Table Header를 위한 data class
 *  @version 1.0.0
 *
 */

data class Header(
    val id: Int,
    val info: HeaderInfo,
    val updatedat: String?
)

/**
 *  Table Header를 위한 data class
 *  Jsonb 형식 삽입을 위한 Serializable tag
 *
 */
@Serializable
data class HeaderInfo(
    val ver: String = "",
    val type: String = "",
    val header: ArrayList<String> = arrayListOf(),
)

/**
 *  Table Header를 위한 PG IntIdTable
 *
 */
object HeaderTable : IntIdTable() {
    val info = jsonb("info", HeaderInfo.serializer())
    val updatedAt: Column<String> = varchar("updatedat", 255)
}

/**
 *  Table Header를 위한 Kotlin Exposed EntityClass
 *
 */
class HeaderEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<HeaderEntity>(HeaderTable)

    var info by HeaderTable.info
    var updatedAt by HeaderTable.updatedAt

    /**
     *  Override function that convert Entity to String
     *  @param
     *  @return String
     */
    override fun toString(): String = "Header($info, $updatedAt)"

    /**
     *  Entity to String
     *  @param
     *  @return Header
     */
    fun toHistory(): Header = Header(id.value, info, updatedAt)
}