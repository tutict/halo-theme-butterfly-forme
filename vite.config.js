import path from 'path';
import { defineConfig } from 'vite';
import autoprefixer from 'autoprefixer';
import viteCompression from 'vite-plugin-compress';

const resolve = (name) => path.resolve(__dirname, name);

export default defineConfig({
  build: {
    outDir: 'dist', // 设置输出目录
    rollupOptions: {
      input: {
        // 入口文件配置,对应 Gulp 的 getEntryData 函数
        ...Object.fromEntries(
          fs.readdirSync('./src/js/page').map((file) => [
            file.replace(/.js$/, ''),
            resolve(`./src/js/page/${file}`),
          ])
        ),
      },
      output: {
        assetFileNames: (assetInfo) => {
          // 处理 JS 和 CSS 文件名称和输出路径
          let extType = path.extname(assetInfo.name).split('.')[1];
          if (/css|js/.test(extType)) {
            extType = `assets/${extType}`;
          }
          return `${extType}/[name].[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name].[hash].js',
        entryFileNames: 'assets/js/[name].[hash].js',
      },
    },
    cssCodeSplit: true, // 启用 CSS 代码拆分
  },
  plugins: [
    // CSS 处理插件
    {
      name: 'css',
      async handleHotUpdate(ctx) {
        if (ctx.file.endsWith('.css')) {
          const prefixer = autoprefixer({
            overrideBrowserslist: [
              '> 5%',
              'last 2 versions',
              'last 3 Safari versions',
              'Firefox >= 20',
            ],
            cascade: true,
          });
          const { code, map } = await prefixer.process(ctx.read(), {
            from: ctx.file,
            to: ctx.file.replace(/\.css$/, '.css.js'),
            map: { inline: false, annotation: true },
          });
          ctx.server.ws.send({
            type: 'full-reload',
            path: '*',
          });
          ctx.write(code, map);
        }
      },
    },
    // 压缩插件
    viteCompression({
      ext: '.zip', // 生成的压缩包后缀
      deleteOriginFile: false, // 是否删除源文件
    }),
  ],
});