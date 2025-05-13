import { WordPressAnnonce, AcfData, NormalizedProperty } from "@/types";
import { DEFAULT_IMAGE } from "./config";

export const stripHtml = (html: string): string => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export const normalizePropertyData = (
  annonce: WordPressAnnonce,
  acfData: AcfData | null
): NormalizedProperty => {
  const getField = (fields: string[]): string => {
    if (acfData?.acf) {
      for (const f of fields) {
        const v = acfData.acf[f];
        if (v) return v.toString();
      }
    }
    return "";
  };

  const feats = acfData?.acf?.features || {};
  const hasBalcony = feats.balcon === "oui";
  const hasTerrasse = feats.terrasse === "oui";
  const hasElevator = feats.ascenseur === "oui";
  const hasPool = feats.piscine === "oui";
  const garageCount = feats.garage || "0";
  const constructionYear = feats.annee_construction || "";
  const isFurnished = feats.meuble === "oui";
  const isNewConstruction ​:contentReference[oaicite:0]{index=0}​
