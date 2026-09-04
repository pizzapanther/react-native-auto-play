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

    func selectTab(templateId: String, index: Double) throws -> Promise<Void> {
        return Promise.async {
            try await MainActor.run {
                try RootModule.withAutoPlayTemplate(templateId: templateId) {
                    (template: TabTemplate) in
                    template.selectTab(index: Int(index))
                }
            }
        }
    }
}
