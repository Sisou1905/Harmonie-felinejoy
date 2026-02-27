import { useEffect } from "react";

// Google AdSense Component
// Replace ca-pub-XXXXXXXXXX with your AdSense publisher ID

const ADSENSE_CLIENT = "ca-pub-XXXXXXXXXX"; // Placeholder - à remplacer avec votre ID

const AdSense = ({ 
  slot, 
  format = "auto", 
  responsive = true,
  style = {},
  className = ""
}) => {
  useEffect(() => {
    try {
      // Push ad to AdSense
      if (window.adsbygoogle && process.env.NODE_ENV === "production") {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.log("AdSense error:", error);
    }
  }, []);

  // In development, show placeholder
  if (process.env.NODE_ENV !== "production" || ADSENSE_CLIENT === "ca-pub-XXXXXXXXXX") {
    return (
      <div 
        className={`bg-gradient-to-r from-gray-100 to-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-center p-4 ${className}`}
        style={{ minHeight: "90px", ...style }}
        data-testid={`adsense-placeholder-${slot}`}
      >
        <div className="text-gray-400">
          <p className="text-sm font-medium">📢 Espace publicitaire</p>
          <p className="text-xs mt-1">AdSense Slot: {slot}</p>
        </div>
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: "block", ...style }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    />
  );
};

// Predefined ad formats
export const AdBanner = ({ className = "" }) => (
  <AdSense 
    slot="1234567890" 
    format="horizontal"
    className={`w-full ${className}`}
    style={{ minHeight: "90px" }}
  />
);

export const AdSquare = ({ className = "" }) => (
  <AdSense 
    slot="0987654321" 
    format="rectangle"
    className={className}
    style={{ minHeight: "250px", maxWidth: "300px" }}
  />
);

export const AdInArticle = ({ className = "" }) => (
  <AdSense 
    slot="1122334455" 
    format="fluid"
    className={`my-6 ${className}`}
    style={{ minHeight: "100px" }}
  />
);

export const AdResponsive = ({ className = "" }) => (
  <AdSense 
    slot="5544332211" 
    format="auto"
    responsive={true}
    className={className}
  />
);

export default AdSense;
