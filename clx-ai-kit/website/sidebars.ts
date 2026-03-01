import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Giới thiệu',
    },
    {
      type: 'category',
      label: 'Bắt đầu',
      items: ['setup'],
    },
    {
      type: 'category',
      label: 'Hướng dẫn sử dụng',
      items: ['cli-usage', 'examples'],
    },
    {
      type: 'category',
      label: 'Nội bộ dự án',
      items: ['internals', 'rules-skills', 'docusaurus-guide'],
    },
    {
      type: 'category',
      label: 'Triển khai & Phát hành',
      items: ['publishing', 'gitlab-setup'],
    },
  ],
};

export default sidebars;
