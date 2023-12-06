import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import tailwind from 'tailwindcss';

const chunks = {
    react: [
        'react',
        'react-dom',
        'react-is',
        'react-router-dom',
        'react-router',
        'react-error-boundary',
        'use-sync-external-store',
        'classnames',
        'scheduler',
        '@remix-run',
        'swr',
    ],
    rc: [
        '@ant',
        'rc-',
        '@rc-',
    ],
    antd: [
        'antd',
    ],
};

const MODULE_BASE = resolve(__dirname, '../../node_modules');
const BASE = resolve(__dirname, 'src');

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        'process.env.RELEASE_TARGET': JSON.stringify(process.env.RELEASE_TARGET || 'prerelease'),
    },
    plugins: [
        react(),
    ],
    resolve: {
        alias: {
            'path': 'path-browserify',
            '@': BASE,
        },
    },
    build: {
        outDir: '../../.dist',
        emptyOutDir: true,
        manifest: false,
        copyPublicDir: true,
        reportCompressedSize: true,
        rollupOptions: {
            output: {
                manualChunks: (id: string) => {
                    if (id.startsWith(__dirname) || id.includes('i18n.config')) {
                        return undefined;
                    }

                    for (const [name, modules] of Object.entries(chunks)) {
                        if (modules.some((m) => id.includes(`${MODULE_BASE}/${m}`))) {
                            return name;
                        }
                    }

                    return 'vendor';
                },
            },
        },
    },
    server: {
        host: true,
        strictPort: true,
    },
    css: {
        modules: {
            localsConvention: 'camelCaseOnly',
        },
        postcss: {
            plugins: [
                tailwind(),
            ],
        },
    },
});
