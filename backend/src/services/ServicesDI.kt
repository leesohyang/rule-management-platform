package com.sample.services

import com.sample.services.header.HeaderService
import com.sample.services.history.HistoryLDRService
import com.sample.services.releaseform.ReleaseFormService
import com.sample.services.rules.LiveDetectRuleService
import org.kodein.di.DI
import org.kodein.di.bind
import org.kodein.di.singleton

/**
 * Kodein singleton bind service
 */
fun DI.MainBuilder.bindServices() {
    bind<HistoryLDRService>() with singleton {HistoryLDRService()}
    bind<ReleaseFormService>() with singleton { ReleaseFormService() }
    bind<LiveDetectRuleService>() with singleton { LiveDetectRuleService() }
    bind<HeaderService>() with singleton { HeaderService() }

}