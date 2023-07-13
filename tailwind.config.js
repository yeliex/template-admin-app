const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
const config = {
    content: {
        relative: true,
        files: [
            'src/**/*.tsx',
        ],
    },
    theme: {
        fontFamily: {},
        extend: {},
    },
    plugins: [],
};

module.exports = config;

