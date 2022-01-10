package com.sample.data.release

import kotlinx.serialization.Serializable
import kotlin.collections.ArrayList

@Serializable
data class ReleaseData(
   val release: ArrayList<Map<String, String>>,
)
