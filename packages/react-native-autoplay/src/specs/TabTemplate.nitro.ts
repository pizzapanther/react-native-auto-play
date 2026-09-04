import type { HybridObject } from 'react-native-nitro-modules';
import type { NitroTabTemplateConfig } from '../templates/TabTemplate';
import type { NitroTemplateConfig } from './AutoPlay.nitro';

interface TabTemplateConfig extends NitroTemplateConfig, NitroTabTemplateConfig {}

export interface TabTemplate extends HybridObject<{ android: 'kotlin'; ios: 'swift' }> {
  createTabTemplate(config: TabTemplateConfig): void;
}
