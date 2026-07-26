async function identifyPhoto(imageBase64) {

    try {

        const status = document.getElementById("aiStatus");

        if (status) status.textContent = "AI判定中...";

        const base64 = imageBase64.split(",")[1];

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.MODEL}:generateContent?key=${CONFIG.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            {
                                text:
`この画像に写っている生き物の名前だけを日本語で1つ答えてください。
説明はいりません。
名前だけ返してください。`
                            },
                            {
                                inline_data: {
                                    mime_type: "image/jpeg",
                                    data: base64
                                }
                            }
                        ]
                    }]
                })
            }
        );

        const json = await response.json();

        const result =
            json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (status) status.textContent = result;

        const card = getCardByName(result);

        if (card) {

            registerCard(card.no);

        } else {

            showToast(result + " は図鑑にありません");

        }

    } catch (e) {

        console.error(e);

        showToast("AI判定に失敗しました");

    }

}