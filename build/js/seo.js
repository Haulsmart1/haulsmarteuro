// js/seo.js
function setSEO(title, description, keywords, image) {
    document.title = title;

    let metaTags = [
        { name: "description", content: description },
        { name: "keywords", content: keywords },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: image },
        { property: "og:type", content: "website" },
        { name: "robots", content: "index, follow" }
    ];

    metaTags.forEach(tag => {
        let element = document.createElement("meta");
        if (tag.name) {
            element.name = tag.name;
        } else {
            element.setAttribute("property", tag.property);
        }
        element.content = tag.content;
        document.head.appendChild(element);
    });
}
