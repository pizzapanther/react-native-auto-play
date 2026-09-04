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

    func updateTab(
        templateId: String,
        index: Double,
        newTemplateId: String
    ) throws -> Promise<Void> {
        return Promise.async {
            try await MainActor.run {
                try RootModule.withTemplateStore { templateStore in
                    let newTemplate = try templateStore.getTemplate(
                        templateId: newTemplateId
                    )
                    try RootModule.withAutoPlayTemplate(templateId: templateId) {
                        (template: TabTemplate) in
                        template.updateTab(index: Int(index), template: newTemplate)
                    }
                }
            }
        }
    }
}
