package com.sample.data.rules

import kotlinx.serialization.Serializable

@Serializable
data class Options(val releasePath: String, val nodeSize: String, val makeSubNode:String, val separator:String)
