package com.sample.data.release

import kotlinx.serialization.Serializable

@Serializable
data class Signals(val signal: String, val path: String)
