package com.margelo.nitro.swe.iternio.reactnativeautoplay

import com.margelo.nitro.swe.iternio.reactnativeautoplay.template.AndroidAutoTemplate
import com.margelo.nitro.swe.iternio.reactnativeautoplay.template.TabTemplate

class HybridTabTemplate : HybridTabTemplateSpec() {
    override fun createTabTemplate(config: TabTemplateConfig) {
        val context = AndroidAutoSession.getRootContext()
            ?: throw IllegalArgumentException("createTabTemplate failed, carContext not found")

        AndroidAutoTemplate.setTemplate(config.id, TabTemplate(context, config))
    }
}
