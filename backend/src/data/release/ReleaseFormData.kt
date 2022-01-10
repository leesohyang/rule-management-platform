package com.sample.data.release

import kotlinx.serialization.Serializable

@Serializable
data class ReleaseFormData(
    val releasePath: String,
    val nodeSize: String,
    val makeSubNode: String,
    val separator: String
)

@Serializable
data class ReleaseSignalData(
    val path:String,
    val signal: String
)