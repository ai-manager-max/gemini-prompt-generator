export default async function handler(req, res) {
    // Csak POST kéréseket fogadunk
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Csak POST metódus engedélyezett' });
    }

    try {
        const { topic } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'Hiányzik az API kulcs a Vercel beállításaiból.' });
        }

        // A te curl parancsod alapján: gemini-flash-latest és a fejléces kulcsátadás
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`;
        
        const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey 
            },
            body: JSON.stringify({
                contents: [{ 
                    parts: [{ 
                        text: `Készíts egy profi, rendkívül részletes és kreatív AI promptot erről a témáról: ${topic}` 
                    }] 
                }]
            })
        });

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Nincs válasz a Gemini-től.';

        return res.status(200).json({ prompt: text });

    } catch (error) {
        console.error("Hiba:", error);
        return res.status(500).json({ error: 'Szerver hiba: ' + error.message });
    }
}