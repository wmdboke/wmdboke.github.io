const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');
const configPath = path.join(__dirname, '..', 'docs', '.vitepress', 'config.mts');

function getTitle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/title:\s*(.+)/);
  return match ? match[1].trim() : path.basename(filePath, '.md');
}

function generateIndex(dirPath, dirName) {
  const items = fs.readdirSync(dirPath);
  
  let md = `# ${dirName}

`;
  
  const subItems = items.filter(item => {
    return fs.statSync(path.join(dirPath, item)).isDirectory();
  });
  
  if (subItems.length > 0) {
    for (const subItem of subItems) {
      const subPath = path.join(dirPath, subItem);
      const files = fs.readdirSync(subPath)
        .filter(f => f.endsWith('.md'))
        .filter(f => f !== 'index.md')
        .sort();
      
      if (files.length === 0) continue;
      
      md += `## ${subItem}\n\n`;
      
      for (const file of files) {
        const filePath = path.join(subPath, file);
        const title = getTitle(filePath);
        md += `- [${title}](./${subItem}/${file.replace('.md', '')})\n`;
      }
      md += '\n';
    }
  } else {
    const files = items
      .filter(f => f.endsWith('.md'))
      .filter(f => f !== 'index.md')
      .sort();
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const title = getTitle(filePath);
      md += `- [${title}](./${file.replace('.md', '')})\n`;
    }
  }
  
  return md;
}

function scanDir(dirPath, basePath = '') {
  const items = fs.readdirSync(dirPath);
  
  const navItems = [];
  const sidebars = {};
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (!stat.isDirectory()) continue;
    if (item === '.vitepress' || item === 'public') continue;
    
    navItems.push(`{ text: '${item}', link: '/${item}' }`);
    
    const indexContent = generateIndex(itemPath, item);
    fs.writeFileSync(path.join(itemPath, 'index.md'), indexContent);
    console.log(`Generated ${item}/index.md`);
    
    const subItems = fs.readdirSync(itemPath);
    const hasSubDirs = subItems.some(sub => fs.statSync(path.join(itemPath, sub)).isDirectory());
    
    let sidebarItems = [];
    
    if (hasSubDirs) {
      for (const subItem of subItems) {
        const subPath = path.join(itemPath, subItem);
        if (!fs.statSync(subPath).isDirectory()) continue;
        
        const files = fs.readdirSync(subPath)
          .filter(f => f.endsWith('.md'))
          .filter(f => f !== 'index.md')
          .sort();
        
        if (files.length === 0) continue;
        
        const subItems2 = files.map(file => {
          const filePath = path.join(subPath, file);
          const title = getTitle(filePath);
          const linkName = path.basename(file, '.md');
          return `{ text: '${title}', link: '/${item}/${subItem}/${linkName}' }`;
        });
        
        sidebarItems.push(`{
              text: '${subItem}',
              collapsed: false,
              items: [
                ${subItems2.join(',\n                ')}
              ]
            }`);
      }
    } else {
      sidebarItems = subItems
        .filter(f => f.endsWith('.md'))
        .filter(f => f !== 'index.md')
        .sort()
        .map(file => {
          const filePath = path.join(itemPath, file);
          const title = getTitle(filePath);
          const linkName = path.basename(file, '.md');
          return `{ text: '${title}', link: '/${item}/${linkName}' }`;
        });
    }
    
    const category = sidebarItems.length > 0 ? `{
          text: '${item}',
          collapsed: false,
          items: [
            ${sidebarItems.join(',\n              ')}
          ]
        }` : null;
    
    if (category) {
      sidebars[`/${item}/`] = category;
    }
  }
  
  return {
    nav: navItems.join(',\n      '),
    sidebars
  };
}

function generateConfig(docsDir) {
  const { nav, sidebars } = scanDir(docsDir);
  
  let sidebarConfig = '';
  for (const [path, items] of Object.entries(sidebars)) {
    sidebarConfig += `    '${path}': [
        ${items}
      ],
`;
  }
  sidebarConfig = sidebarConfig.trimEnd();
  
  const configContent = `import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/',
  title: "ccwebb",
  description: "Just write it down.",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      ${nav}
    ],

    search: {
      provider: 'local'
    },

    sidebar: {
${sidebarConfig}
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wmdboke/wmdboke.github.io' }
    ]
  }
})
`;

  fs.writeFileSync(configPath, configContent);
  console.log('Config updated!');
}

generateConfig(docsDir);
