package com.sample.data.release

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
data class Signals(val signal: String, val path: String)