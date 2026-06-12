/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { aliases, fa } from 'vuetify/iconsets/fa'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'system',
    themes: {
      light: {
        colors: {
          // --- initial cards (rich, high contrast on white) ---
          'understand':        '#2E6DA4',  // steel blue
          'generate-code':     '#3D4FB5',  // indigo
          'code-review':       '#5E3AAD',  // blue-violet
        },
      },
      dark: {
        colors: {
          // --- initial cards (lighter for dark backgrounds) ---
          'understand':        '#7DB8E8',
          'generate-code':     '#8F9DF2',
          'code-review':       '#B08EF5',
        },
      },
    },
  },
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
    },
  },
})
