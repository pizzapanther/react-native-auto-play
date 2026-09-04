package com.margelo.nitro.swe.iternio.reactnativeautoplay

import com.margelo.nitro.core.Promise
import com.margelo.nitro.swe.iternio.reactnativeautoplay.template.AndroidAutoTemplate
import com.margelo.nitro.swe.iternio.reactnativeautoplay.template.TabTemplate

class HybridTabTemplate : HybridTabTemplateSpec() {
    override fun createTabTemplate(config: TabTemplateConfig) {
        val context = AndroidAutoSession.getRootContext()
            ?: throw IllegalArgumentException("createTabTemplate failed, carContext not found")

        AndroidAutoTemplate.setTemplate(config.id, TabTemplate(context, config))
    }

    override fun selectTab(templateId: String, index: Double): Promise<Unit> = Promise.async {
        AndroidAutoTemplate.getTemplate<TabTemplate>(templateId).selectTab(index.toInt())
    }

    override fun updateTab(
        templateId: String, index: Double, newTemplateId: String
    ): Promise<Unit> = Promise.async {
        AndroidAutoTemplate.getTemplate<TabTemplate>(templateId)
            .updateTab(index.toInt(), newTemplateId)
    }
}
