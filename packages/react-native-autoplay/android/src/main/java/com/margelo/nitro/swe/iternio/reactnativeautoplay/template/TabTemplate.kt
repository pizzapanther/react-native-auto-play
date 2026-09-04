package com.margelo.nitro.swe.iternio.reactnativeautoplay.template

import androidx.car.app.CarContext
import androidx.car.app.annotations.RequiresCarApi
import androidx.car.app.model.Action
import androidx.car.app.model.Tab
import androidx.car.app.model.TabContents
import androidx.car.app.model.TabTemplate as CarTabTemplate
import androidx.car.app.model.Template
import com.margelo.nitro.swe.iternio.reactnativeautoplay.NitroAction
import com.margelo.nitro.swe.iternio.reactnativeautoplay.TabTemplateConfig

@RequiresCarApi(6)
class TabTemplate(context: CarContext, config: TabTemplateConfig) :
    AndroidAutoTemplate<TabTemplateConfig>(context, config) {

    override val isRenderTemplate = false
    override val templateId: String
        get() = config.id
    override val autoDismissMs = config.autoDismissMs

    private var activeTemplateId = config.tabs.first().templateId

    override fun parse(): Template {
        val activeTemplate = AndroidAutoTemplate.getTemplate(activeTemplateId)
            ?: throw IllegalArgumentException("Tab content template not found: $activeTemplateId")

        val callback = object : CarTabTemplate.TabCallback {
            override fun onTabSelected(selectedTemplateId: String) {
                activeTemplateId = selectedTemplateId
                config.onTabSelected?.invoke(selectedTemplateId)
                applyConfigUpdate()
            }
        }

        return CarTabTemplate.Builder(callback).apply {
            setHeaderAction(Action.APP_ICON)
            config.tabs.forEach { tab ->
                addTab(Tab.Builder().apply {
                    setTitle(tab.title)
                    setIcon(Parser.parseImage(context, tab.image))
                    setContentId(tab.templateId)
                }.build())
            }
            setActiveTabContentId(activeTemplateId)
            setTabContents(TabContents.Builder(activeTemplate.parse()).build())
        }.build()
    }

    override fun setTemplateHeaderActions(headerActions: Array<NitroAction>?) {
        throw UnsupportedOperationException("TabTemplate does not support header actions")
    }

    override fun onWillAppear() {
        config.onWillAppear?.invoke(null)
    }

    override fun onWillDisappear() {
        config.onWillDisappear?.invoke(null)
    }

    override fun onDidAppear() {
        config.onDidAppear?.invoke(null)
    }

    override fun onDidDisappear() {
        config.onDidDisappear?.invoke(null)
    }

    override fun onPopped() {
        config.onPopped?.invoke()
        templates.remove(templateId)
    }
}
