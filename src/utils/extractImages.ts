export const extractImagesFromHtml = (html: string): string[] => {
  if (typeof window === "undefined") return []; // en SSR : sécuriser

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const imgTags = Array.from(doc.querySelectorAll("img"));
  return imgTags
    .map((img) => img.getAttribute("src"))
    .filter((src): src is string => Boolean(src));
};
