import { addMessages, init, getLocaleFromNavigator } from "svelte-i18n";

// Voeg berichten direct toe in plaats van asynchroon te laden
import en from './locales/en.ts';
import nl from './locales/nl.ts';

// Voeg berichten direct toe
addMessages('en', en);
addMessages('nl', nl);

// Definieer een standaard locale
const defaultLocale = 'en';

// Initialize i18n
init({
  fallbackLocale: defaultLocale,
  initialLocale: defaultLocale, // Altijd beginnen met een bekende locale
});

// Probeer na initialisatie de browser locale in te stellen
setTimeout(() => {
  try {
    const navigatorLocale = getLocaleFromNavigator() || defaultLocale;
    if (['en', 'nl'].includes(navigatorLocale)) {
      // Set to navigator locale if it's supported
      import('svelte-i18n').then(i18n => {
        i18n.locale.set(navigatorLocale);
      });
    }
  } catch (error) {
    console.error("Error setting browser locale:", error);
  }
}, 0);