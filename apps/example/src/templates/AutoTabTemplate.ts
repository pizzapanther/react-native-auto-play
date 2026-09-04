import {
  TabTemplate,
  ListTemplate,
  type TabTemplateConfig,
} from '@iternio/react-native-auto-play';


// Should be used as a Root Template
const getTemplate = (): TabTemplate => {
  const tab1 = new ListTemplate({
    title: { text: 'radios 1' }
  });
  const tab2 = new ListTemplate({
    title: { text: 'radios 2' }
  });

  return new TabTemplate({
    title: 'Tabs',
    tabs: [
      { title: 'Routes', image: {type: 'glyph', name: 'grid_3x3'}, template: tab1 },
      { title: 'Settings', image: {type: 'glyph', name: 'text_ad'}, template: tab2 },
    ],
    onTabSelected: (tab, index) => {
      console.log(tab.title, index);
    },
  });
};

export const AutoTabTemplate = { getTemplate };
