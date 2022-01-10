package com.sample.data.release

import com.sample.data.jsonb
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable


data class ReleaseForm(
    val id: Int,
    val type: String,
    val value: ReleaseFormData,
    val signal: ReleaseSignalData
)

object ReleaseFormTable : IntIdTable() {
    val type = varchar("type", 255)
    val value = jsonb("value", ReleaseFormData.serializer() )
    val signal = jsonb("signal", ReleaseSignalData.serializer() )
}

class ReleaseFormEntity(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<ReleaseFormEntity>(ReleaseFormTable)
    var type by ReleaseFormTable.type
    var value by ReleaseFormTable.value
    var signal by ReleaseFormTable.signal

    override fun toString(): String = "ReleaseForm($type, $value, $signal)"

    fun toReleaseForm(): ReleaseForm = ReleaseForm(id.value, type, value, signal)
}
