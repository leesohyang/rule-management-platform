package com.sample.data.header

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.UUIDEntity
import org.jetbrains.exposed.dao.UUIDEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.dao.id.UUIDTable
import com.fasterxml.jackson.databind.ObjectMapper
import com.google.gson.Gson
import kotlinx.serialization.Serializable
import java.util.*
import kotlin.collections.ArrayList

@Serializable
data class HeaderInfo(
    val ver: String = "",
    val type: String = "",
    val header: ArrayList<String> = arrayListOf(),
)
