package com.sample.services

import com.sample.services.history.HistoryLDRService
import org.kodein.di.DI
import org.kodein.di.bind
import org.kodein.di.singleton

fun DI.MainBuilder.bindServices() {
    bind<HistoryLDRService>() with singleton {HistoryLDRService()}
    bind<ReleaseService>() with singleton { ReleaseService() }
    bind<ReleaseFormService>() with singleton {ReleaseFormService() }
    bind<RuleService>() with singleton {RuleService()}
    bind<HeaderService>() with singleton {HeaderService()}

}