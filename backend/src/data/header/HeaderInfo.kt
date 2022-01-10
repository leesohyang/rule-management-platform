package com.sample.data.header

import kotlinx.serialization.Serializable
import kotlin.collections.ArrayList

@Serializable
data class HeaderInfo(
    val ver: String = "",
    val type: String = "",
    val header: ArrayList<String> = arrayListOf(),
)
