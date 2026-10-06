/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

module.exports = {
  content: [
    './_includes/**/*.html',
    './_layouts/**/*.html',
    './assets/js/**/*.js',
    './*.html',
    './*.md'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Colors resolve to CSS variables defined in assets/css/style.css,
      // so dark mode is a variable swap on <html class="dark">.
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        sunken: token('sunken'),
        ink: token('ink'),
        body: token('body'),
        muted: token('muted'),
        line: token('line'),
        accent: token('accent'),
        'accent-ink': token('accent-ink'),
        'accent-soft': token('accent-soft'),
        vendor: token('vendor'),
        good: token('good'),
        warn: token('warn'),
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
}
