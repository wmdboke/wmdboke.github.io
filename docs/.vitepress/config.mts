import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/',
  title: "ccwebb",
  description: "Just write it down.",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'blog', link: '/blog' },
      { text: 'essay44', link: '/essay44' }
    ],

    search: {
      provider: 'local'
    },

    sidebar: {
    '/blog/': [
        {
          text: 'blog',
          collapsed: false,
          items: [
            {
              text: 'linux',
              collapsed: false,
              items: [
                { text: 'C++', link: '/blog/linux/2019-2-19-Cpp' },
                { text: 'Go', link: '/blog/linux/2019-4-10-Go' },
                { text: 'Linux Shell 命令', link: '/blog/linux/2019-4-10-linuxShell' },
                { text: 'Linux 数据库安装', link: '/blog/linux/2019-4-10-linux数据库' },
                { text: 'Linux 服务', link: '/blog/linux/2019-4-10-linux服务' },
                { text: 'Linux 系统基础', link: '/blog/linux/2019-4-10-linux系统基础' },
                { text: 'Linux 网络', link: '/blog/linux/2019-4-10-linux网络' },
                { text: 'Linux 防火墙', link: '/blog/linux/2019-4-10-linux防火墙' },
                { text: '工具配置', link: '/blog/linux/2019-4-10-工具配置' },
                { text: 'Docker', link: '/blog/linux/2019-4-11-Docker' },
                { text: 'Python', link: '/blog/linux/2019-4-7-Python' },
                { text: '面试题', link: '/blog/linux/2019-9-18-问题' },
                { text: 'Kubernetes', link: '/blog/linux/kubernetes' }
              ]
            },
              {
              text: 'vue',
              collapsed: false,
              items: [
                { text: 'Vuex', link: '/blog/vue/2019-4-10-vuex' }
              ]
            }
          ]
        }
      ],
    '/essay44/': [
        {
          text: 'essay44',
          collapsed: false,
          items: [
            { text: 'test', link: '/essay44/test' }
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wmdboke/wmdboke.github.io' }
    ]
  }
})
