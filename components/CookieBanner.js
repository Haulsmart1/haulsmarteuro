import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!document.cookie.includes("cookiesAccepted")) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    document.cookie = "cookiesAccepted=true;path=/";
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      width: "100%",
      background: "#000",
      color: "#fff",
      padding: "1rem",
      textAlign: "center",
      zIndex: 9999
    }}>
      🍪 This site uses cookies for a better experience.
      <button
        onClick={acceptCookies}
        style={{
          marginLeft: "1rem",
          padding: "0.5rem 1rem",
          background: "#28a745",
          border: "none",
          color: "white",
          borderRadius: "4px"
        }}
      >
        Accept
      </button>
    </div>
  );
}


