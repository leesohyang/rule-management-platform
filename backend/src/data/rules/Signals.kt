package com.sample.data.rules

import kotlinx.serialization.Serializable

@Serializable
data class Signals(val signal: String, val path: String)
