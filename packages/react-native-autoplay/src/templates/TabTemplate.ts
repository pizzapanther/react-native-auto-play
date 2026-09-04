import { NitroModules } from 'react-native-nitro-modules';
import type { TabTemplate as NitroTabTemplate } from '../specs/TabTemplate.nitro';
import type { AutoImage } from '../types/Image';
import type { NitroImage } from '../utils/NitroImage';
import { NitroImageUtil } from '../utils/NitroImage';
import { type NitroTemplateConfig, Template, type TemplateConfig } from './Template';

const HybridTabTemplate = NitroModules.createHybridObject<NitroTabTemplate>('TabTemplate');

export interface Tab<T extends Template<unknown, unknown> = Template<unknown, unknown>> {
  /** A short label displayed in the tab bar. */
  title: string;
  /** The tab icon. Android requires a tinted icon; iOS applies its tab-bar styling. */
  image: AutoImage;
  /** A template which has already been constructed and registered. */
  template: T;
}

export interface NitroTab {
  title: string;
  image: NitroImage;
  templateId: string;
}

export interface NitroTabTemplateConfig extends TemplateConfig {
  tabs: Array<NitroTab>;
  onTabSelected?: (templateId: string) => void;
}

export type TabTemplateConfig = Omit<NitroTabTemplateConfig, 'tabs' | 'onTabSelected'> & {
  /** Two to four tabs. The first tab is selected initially. */
  tabs: [Tab, Tab, ...Array<Tab>];
  onTabSelected?: (tab: Tab, index: number) => void;
};

/**
 * Displays a persistent tab bar containing other templates.
 *
 * Android requires Car API 6 or newer. A TabTemplate is a navigation container and does not
 * support header actions; configure headers on its child templates instead.
 */
export class TabTemplate extends Template<TabTemplateConfig, never> {
  private readonly tabCount: number;
  private readonly tabs: Array<Tab>;
  private _activeIndex = 0;

  /** The zero-based index of the currently active tab. */
  public get activeIndex() {
    return this._activeIndex;
  }

  constructor(config: TabTemplateConfig) {
    super(config);

    if (config.tabs.length < 2 || config.tabs.length > 4) {
      throw new Error('TabTemplate supports between 2 and 4 tabs.');
    }

    if (new Set(config.tabs.map((tab) => tab.template.id)).size !== config.tabs.length) {
      throw new Error('Each TabTemplate tab must reference a different template.');
    }

    this.tabCount = config.tabs.length;
    this.tabs = [...config.tabs];

    const { tabs, onTabSelected, ...rest } = config;
    const nitroTabs = tabs.map(({ title, image, template }) => ({
      title,
      image: NitroImageUtil.convert(image),
      templateId: template.id,
    }));

    const nitroConfig: NitroTabTemplateConfig & NitroTemplateConfig = {
      ...rest,
      id: this.id,
      tabs: nitroTabs,
      onTabSelected: (templateId) => {
        const index = this.tabs.findIndex((candidate) => candidate.template.id === templateId);
        const selectedTab = this.tabs[index];
        if (selectedTab != null) {
          this._activeIndex = index;
          if (onTabSelected != null) {
            onTabSelected(selectedTab, index);
          }
        }
      },
    };

    HybridTabTemplate.createTabTemplate(nitroConfig);
  }

  /** Selects a tab by its zero-based index. */
  public async selectTab(index: number) {
    if (!Number.isInteger(index) || index < 0 || index >= this.tabCount) {
      throw new RangeError(`Tab index ${index} is out of bounds for ${this.tabCount} tabs.`);
    }

    if (index === this._activeIndex) {
      return;
    }

    await HybridTabTemplate.selectTab(this.id, index);
    this._activeIndex = index;
  }

  /** Replaces a tab's content template while preserving its title and image. */
  public async updateTab(index: number, template: Template<unknown, unknown>) {
    if (!Number.isInteger(index) || index < 0 || index >= this.tabCount) {
      throw new RangeError(`Tab index ${index} is out of bounds for ${this.tabCount} tabs.`);
    }

    if (this.tabs[index]?.template.id === template.id) {
      return;
    }

    if (
      this.tabs.some(
        (candidate, tabIndex) => tabIndex !== index && candidate.template.id === template.id
      )
    ) {
      throw new Error('Each TabTemplate tab must reference a different template.');
    }

    await HybridTabTemplate.updateTab(this.id, index, template.id);

    const tab = this.tabs[index];
    if (tab != null) {
      this.tabs[index] = { ...tab, template };
    }
  }
}
