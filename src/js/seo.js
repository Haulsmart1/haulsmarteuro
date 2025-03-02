// seo.js
import React, { useEffect } from 'react';

function SEO({ title, description, keywords, lang }) {
  useEffect(() => {
    // Update meta tags for SEO purposes dynamically
    document.title = title || 'HaulSmart - Freight Exchange'; // Set the document title dynamically
    document.querySelector("meta[name='description']").setAttribute("content", description || "HaulSmart offers a streamlined logistics and freight exchange system.");
    document.querySelector("meta[name='keywords']").setAttribute("content", keywords || "freight exchange, logistics, haulage, transport");
    document.querySelector("meta[property='og:title']").setAttribute("content", title || 'HaulSmart - Freight Exchange');
    document.querySelector("meta[property='og:description']").setAttribute("content", description || "HaulSmart offers a streamlined logistics and freight exchange system.");
    document.querySelector("meta[property='og:image']").setAttribute("content", "https://haulsmart.com/images/index-bg.jpg");
    document.querySelector("html").setAttribute("lang", lang || "en"); // Set the language of the page dynamically
  }, [title, description, keywords, lang]);

  return null; // This component doesn’t render anything on the page
}

export default SEO;
