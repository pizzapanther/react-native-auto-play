//
//  HybridTabTemplate.swift
//  Pods
//

import NitroModules

class HybridTabTemplate: HybridTabTemplateSpec {
    func createTabTemplate(config: TabTemplateConfig) throws {
        try RootModule.withTemplateStore { templateStore in
            let template = try TabTemplate(config: config, templateStore: templateStore)
            templateStore.addTemplate(template: template, templateId: config.id)
        }
    }
}
