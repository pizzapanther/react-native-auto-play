//
//  TabTemplate.swift
//  Pods
//

import CarPlay
import UIKit

class TabTemplate: AutoPlayTemplate, CPTabBarTemplateDelegate {
    let template: CPTabBarTemplate
    var config: TabTemplateConfig
    private let childTemplates: [AutoPlayTemplate]

    override var autoDismissMs: Double? {
        return config.autoDismissMs
    }

    override func getTemplate() -> CPTemplate {
        return template
    }

    init(config: TabTemplateConfig, templateStore: TemplateStore) throws {
        self.config = config

        let traitCollection = SceneStore.getRootTraitCollection() ?? UITraitCollection.current
        childTemplates = try config.tabs.map { tab in
            try templateStore.getTemplate(templateId: tab.templateId)
        }
        let carPlayTemplates = zip(config.tabs, childTemplates).map { tab, childTemplate in
            let carPlayTemplate = childTemplate.getTemplate()
            carPlayTemplate.tabTitle = tab.title
            carPlayTemplate.tabImage = Self.parseImage(
                tab.image,
                traitCollection: traitCollection
            )
            return carPlayTemplate
        }

        template = CPTabBarTemplate(templates: carPlayTemplates)
        initTemplate(template: template, id: config.id)

        super.init()
        template.delegate = self
    }

    @MainActor
    override func _invalidate() {
        childTemplates.forEach { childTemplate in
            childTemplate.invalidate()
        }
    }

    @MainActor
    override func traitCollectionDidChange() {
        childTemplates.forEach { childTemplate in
            childTemplate.traitCollectionDidChange()
        }
    }

    func tabBarTemplate(_ tabBarTemplate: CPTabBarTemplate, didSelect selectedTemplate: CPTemplate) {
        config.onTabSelected?(selectedTemplate.id)
    }

    override func onWillAppear(animated: Bool) {
        config.onWillAppear?(animated)
    }

    override func onDidAppear(animated: Bool) {
        config.onDidAppear?(animated)
    }

    override func onWillDisappear(animated: Bool) {
        config.onWillDisappear?(animated)
    }

    override func onDidDisappear(animated: Bool) {
        config.onDidDisappear?(animated)
    }

    override func onPopped() {
        config.onPopped?()
    }

    private static func parseImage(
        _ image: NitroImage,
        traitCollection: UITraitCollection
    ) -> UIImage? {
        if let glyph = image.glyphImage {
            return SymbolFont.imageFromNitroImage(
                image: glyph,
                noImageAsset: true,
                traitCollection: traitCollection
            )
        }
        if let asset = image.assetImage {
            return Parser.parseAssetImage(assetImage: asset, traitCollection: traitCollection)
        }
        if let remote = image.remoteImage {
            return Parser.parseRemoteImage(remoteImage: remote, traitCollection: traitCollection)
        }
        return nil
    }
}
