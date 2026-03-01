import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'AIDK',
  tagline: 'AI Dev Kit — scaffold AI-assisted development structures for Cursor & Antigravity IDEs',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://caeruxlab.gitlab.io',
  baseUrl: '/clx-ai-kit/',

  organizationName: 'caeruxlab',
  projectName: 'clx-ai-kit',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'vi',
    locales: ['vi', 'en', 'ja'],
    localeConfigs: {
      vi: { label: 'Tiếng Việt' },
      en: { label: 'English' },
      ja: { label: '日本語' },
    },
  },

  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['vi', 'en', 'ja'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://git.caerux.com/caeruxlab/clx-ai-kit/-/edit/main/website/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'AIDK',
      logo: {
        alt: 'AIDK Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Tài liệu',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://git.caerux.com/caeruxlab/clx-ai-kit',
          label: 'GitLab',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Tài liệu',
          items: [
            { label: 'Cài đặt', to: '/docs/setup' },
            { label: 'Sử dụng CLI', to: '/docs/cli-usage' },
            { label: 'Nội bộ dự án', to: '/docs/internals' },
          ],
        },
        {
          title: 'Thêm',
          items: [
            { label: 'Xuất bản', to: '/docs/publishing' },
            { label: 'Cấu hình GitLab', to: '/docs/gitlab-setup' },
            {
              label: 'GitLab',
              href: 'https://git.caerux.com/caeruxlab/clx-ai-kit',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} CaeruxLab. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
