const locale = (() => {
  const defaultLanguage = "en";
  const supportedLanguages = ["en", "es"];

  let language = defaultLanguage;
  let translations = {};

  // Load a language file
  async function setLanguage(lang) {
    if (!supportedLanguages.includes(lang)) {
      lang = defaultLanguage;
    }

    try {
      const response = await fetch(`locales/${lang}.json`);

      if (!response.ok) {
        throw new Error(`Failed to load ${lang}.json`);
      }

      translations = await response.json();
      language = lang;

      document.documentElement.lang = lang;

      // Update the document title and all translated elements
      translatePage();

      localStorage.setItem("language", lang);
    } catch (error) {
      console.error("Localization error:", error);
    }
  }

  // Resolve a translation key
  function translate(key, params = {}) {
    let value = translations[key];

    if (value === undefined) {
      return key; // Fallback for missing translations
    }

    // Replace placeholders, e.g. {name}
    return value.replace(/\{(\w+)\}/g, (match, name) => {
      return Object.hasOwn(params, name)
        ? String(params[name])
        : match;
    });
  }

  // Update all elements marked with data-locale
  function translatePage() {
    document.querySelectorAll("[data-locale]").forEach(element => {
      const key = element.dataset.locale;

      const params = {};

      for (const attr of element.attributes) {
        if (attr.name.startsWith("data-locale-")) {
          const name = attr.name.slice("data-locale-".length);
          params[name] = attr.value;
        }
      }

      element.textContent = t(key, params);
    });

    // Translate document title if a key is provided
    const title = document.querySelector("title[data-locale]");

    if (title) {
      document.title = translate(title.dataset.locale);
    }
  }

  // Initialize using the saved language, if available
  async function init() {
    const savedLanguage = localStorage.getItem("language");
    await setLanguage(savedLanguage || defaultLanguage);
  }

  return {
    init,
    setLanguage,
    translate,
    get language() {
      return language;
    }
  };
})();

// Initialize the localization system
locale.init();