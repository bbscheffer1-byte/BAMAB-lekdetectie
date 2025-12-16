import { GoogleGenAI } from "@google/genai";
import { ImageItem, ReportData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert file to base64
const fileToPart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateLeakReport = async (
  projectData: ReportData,
  images: ImageItem[],
  generalNotes: string
): Promise<string> => {
  
  const model = "gemini-2.5-flash"; // Efficient and good with images

  // Prepare image parts
  const imageParts = await Promise.all(images.map(img => fileToPart(img.file)));

  // Construct a detailed prompt
  const promptText = `
    Je bent een expert in lekdetectie en bouwpathologie met jarenlange ervaring.
    Jouw taak is het schrijven van een uiterst professioneel, formeel en visueel gestructureerd lekdetectierapport voor een Nederlandse verzekeringsmaatschappij.

    GEGEVENS:
    Klant: ${projectData.clientName}
    Adres: ${projectData.address}, ${projectData.city}
    Telefoon: ${projectData.phone}
    Email: ${projectData.email}
    Datum inspectie: ${projectData.date}
    Referentie: ${projectData.referenceNumber}

    ALGEMENE OPMERKINGEN VAN DE SPECIALIST:
    "${generalNotes}"

    SPECIFIEKE OPMERKINGEN PER FOTO:
    ${images.map((img, i) => `Foto ${i + 1}: ${img.description}`).join('\n')}

    INSTRUCTIES VOOR DE OPMAAK (STRICT OPVOLGEN):
    1. **Projectgegevens**: Presenteer deze sectie ALTIJD als een Markdown tabel met twee kolommen (Omschrijving | BAMAB Lekdetectie Projectgegevens).
    2. **Kopjes**: Gebruik H2 (##) voor hoofdstukken en H3 (###) voor subsecties.
    3. **Lijsten**: Gebruik bulletpoints (-) voor opsommingen van gebreken of waarnemingen.
    4. **Dikgedrukt**: Gebruik **vetgedrukte tekst** voor belangrijke termen (zoals 'Oorzaak', 'Gevolg', 'Locatie') om de leesbaarheid te vergroten.
    5. **Witruimte**: Zorg voor voldoende witregels tussen paragrafen.

    INHOUD VAN HET RAPPORT:
    1. **Projectgegevens** (In tabelvorm).
    2. **Inleiding**: Kort en zakelijk doel van het onderzoek.
    3. **Visuele Inspectie & Bevindingen**: 
       - Behandel de bevindingen punt voor punt.
       - Gebruik subkopjes per ruimte of locatie indien relevant.
       - Verwijs duidelijk naar "Afbeelding X".
    4. **Metingen & Analyse**: Beschrijf waarschijnlijke oorzaken op basis van de beelden en vakkennis.
    5. **Conclusie**: De definitieve oorzaak van de lekkage (dikgedrukt).
    6. **Advies & Herstel**: 
       - Gebruik een puntsgewijze lijst voor de herstelstappen.
       - Vermeld expliciet: "Wij kunnen voor deze herstelwerkzaamheden een vrijblijvende offerte opmaken."
    7. **Disclaimer**: Voeg exact deze tekst toe: *"Dit rapport is opgesteld op basis van niet-destructief onderzoek. De oorzaak van de lekkage is met zeer hoge waarschijnlijkheid vastgesteld op basis van de visuele waarnemingen en metingen. Echter, bij eventueel destructief onderzoek kunnen altijd nog aanvullende of andere oorzaken aan het licht komen die tijdens een niet-destructieve inspectie niet waarneembaar waren."*

    Genereer alleen de Markdown output.
  `;

  const contents = [
    { text: promptText },
    ...imageParts.map(part => ({ inlineData: part.inlineData }))
  ];

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: contents }],
    });

    return response.text || "Er is een fout opgetreden bij het genereren van het rapport.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Kon het rapport niet genereren. Controleer je internetverbinding en probeer het opnieuw.");
  }
};