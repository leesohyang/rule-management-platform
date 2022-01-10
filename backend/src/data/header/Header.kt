package com.sample.data.header

import com.sample.data.jsonb
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.Column

data class Header(
    val id: Int,
    val info: HeaderInfo
)

object HeaderTable : IntIdTable() {
    val info = jsonb("info", HeaderInfo.serializer())
    val updatedAt: Column<String> = varchar("updatedat", 255)
}

class HeaderEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<HeaderEntity>(HeaderTable)

    var info by HeaderTable.info
//    var updatedAt by HeaderTable.updatedAt

    override fun toString(): String = "Header($info)"
    fun toHistory(): Header = Header(id.value, info)
}


//얘네 하기 전에.. grid table 모듈화부터 시키자.. 어차피 컬럼 불러오는거 하드코딩으로 박을것도 아니니까..