import { useState, useEffect, useRef } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

const languages = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦", rtl: true },
];

const LanguageSelector = () => {
  const [currentLang, setCurrentLang] = useState("fr");
  const [isLoaded, setIsLoaded] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    // Load Google Translate script only once
    if (initialized.current) return;
    initialized.current = true;

    // Add Google Translate element
    const translateDiv = document.createElement("div");
    translateDiv.id = "google_translate_element";
    translateDiv.style.display = "none";
    document.body.appendChild(translateDiv);

    // Define the callback function
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "fr",
          includedLanguages: "fr,en,pl,tr,ar",
          autoDisplay: false,
          multilanguagePage: true,
        },
        "google_translate_element"
      );
      setIsLoaded(true);
    };

    // Load the script
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // Check for saved language preference
    const savedLang = localStorage.getItem("preferredLanguage");
    if (savedLang && savedLang !== "fr") {
      setTimeout(() => {
        changeLanguage(savedLang);
      }, 1500);
    }

    return () => {
      // Cleanup
      const element = document.getElementById("google_translate_element");
      if (element) element.remove();
    };
  }, []);

  const changeLanguage = (langCode) => {
    setCurrentLang(langCode);
    localStorage.setItem("preferredLanguage", langCode);

    // Handle RTL for Arabic
    const selectedLang = languages.find(l => l.code === langCode);
    if (selectedLang?.rtl) {
      document.documentElement.setAttribute("dir", "rtl");
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      document.documentElement.classList.remove("rtl");
    }

    // Trigger Google Translate
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    } else {
      // Fallback: Try to find and click the right language in Google Translate frame
      setTimeout(() => {
        const selectRetry = document.querySelector(".goog-te-combo");
        if (selectRetry) {
          selectRetry.value = langCode;
          selectRetry.dispatchEvent(new Event("change"));
        }
      }, 1000);
    }
  };

  const getCurrentLanguage = () => {
    return languages.find(l => l.code === currentLang) || languages[0];
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-primary-light/30 text-text-muted"
          data-testid="language-selector"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">
            {getCurrentLanguage().flag} {getCurrentLanguage().name}
          </span>
          <span className="sm:hidden text-sm">
            {getCurrentLanguage().flag}
          </span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className="flex items-center justify-between cursor-pointer"
            data-testid={`lang-${lang.code}`}
          >
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </span>
            {currentLang === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
