import { useState, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { toast } from "sonner";

const languages = [
  { code: "fr", name: "Français", flag: "🇫🇷", nativeName: "Français" },
  { code: "en", name: "English", flag: "🇬🇧", nativeName: "English" },
  { code: "pl", name: "Polski", flag: "🇵🇱", nativeName: "Polish" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷", nativeName: "Turkish" },
  { code: "ar", name: "العربية", flag: "🇸🇦", nativeName: "Arabic", rtl: true },
];

const LanguageSelector = () => {
  const [currentLang, setCurrentLang] = useState("fr");
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    // Check for saved language preference
    const savedLang = localStorage.getItem("preferredLanguage");
    if (savedLang) {
      setCurrentLang(savedLang);
      applyLanguageSettings(savedLang);
    }
  }, []);

  const applyLanguageSettings = (langCode) => {
    const selectedLang = languages.find(l => l.code === langCode);
    
    // Handle RTL for Arabic
    if (selectedLang?.rtl) {
      document.documentElement.setAttribute("dir", "rtl");
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      document.documentElement.classList.remove("rtl");
    }

    // Set lang attribute for browser translation hints
    document.documentElement.setAttribute("lang", langCode);
  };

  const translateWithGoogleTranslate = (targetLang) => {
    // Open Google Translate in a new window/popup for full page translation
    const currentUrl = window.location.href;
    const translateUrl = `https://translate.google.com/translate?sl=fr&tl=${targetLang}&u=${encodeURIComponent(currentUrl)}`;
    
    // Open in new tab
    window.open(translateUrl, '_blank');
  };

  const changeLanguage = async (langCode) => {
    if (langCode === currentLang) return;
    
    setCurrentLang(langCode);
    localStorage.setItem("preferredLanguage", langCode);
    applyLanguageSettings(langCode);

    if (langCode === "fr") {
      // Return to original French version
      toast.success("Langue changée en Français");
      return;
    }

    setTranslating(true);
    
    // Show translation option
    const selectedLang = languages.find(l => l.code === langCode);
    toast.info(`Traduction en ${selectedLang.name}...`, {
      action: {
        label: "Traduire",
        onClick: () => translateWithGoogleTranslate(langCode)
      },
      duration: 5000,
    });

    setTranslating(false);
    
    // Automatically trigger translation
    translateWithGoogleTranslate(langCode);
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
          disabled={translating}
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
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-xs text-text-muted border-b border-border mb-1">
          Traduire la page
        </div>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className="flex items-center justify-between cursor-pointer"
            data-testid={`lang-${lang.code}`}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </span>
            {currentLang === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
        <div className="px-2 py-1.5 text-[10px] text-text-light border-t border-border mt-1">
          Propulsé par Google Translate
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
