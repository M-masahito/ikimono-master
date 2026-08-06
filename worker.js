// =======================================
// いきものマスター AI Worker Ver4
// =======================================

const CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
};

const CANDIDATE_COUNT = 3;
const MAX_CATALOG_COUNT = 700;

export default {

    async fetch(request, env) {
        const url = new URL(request.url);

        if (request.method === "OPTIONS") {

            return new Response(null, {
                status: 204,
                headers: CORS
            });

        }

        if (!env.GEMINI_API_KEY) {

            return sendJson({
                success: false,
                error: "GEMINI_API_KEYがありません"
            }, 500);

        }
        if (url.pathname !== "/api/judge") {
    return env.ASSETS.fetch(request);
}

       
        if (request.method !== "POST") {

            return sendJson({
                success: false,
                error: "POSTで送信してください"
            }, 405);

        }

        try {

            const body =
                await request.json();

            const imageData =
                String(
                    body?.imageData ?? ""
                );

            const catalogNames =
                normalizeCatalogNames(
                    body?.catalogNames
                );

            if (!imageData) {

                return sendJson({
                    success: false,
                    error: "写真データがありません"
                }, 400);

            }

            if (
                catalogNames.length <
                CANDIDATE_COUNT
            ) {

                return sendJson({
                    success: false,
                    error: "図鑑データが不足しています"
                }, 400);

            }

            const image =
                parseImageData(imageData);

            if (!image) {

                return sendJson({
                    success: false,
                    error:
                        "写真データの形式が正しくありません"
                }, 400);

            }

            const modelResult =
                await getAvailableModel(
                    env.GEMINI_API_KEY
                );

            if (
                !modelResult.success ||
                !modelResult.model
            ) {

                return sendJson({
                    success: false,
                    error:
                        "利用可能なGeminiモデルがありません",
                    details:
                        modelResult.details
                }, 502);

            }

            const prompt = `
写真に写っている生き物、植物、きのこなどを判定してください。

次の図鑑一覧から、写真に近い候補を3種類選んでください。

【図鑑一覧】
${catalogNames.join("、")}

必ず次のJSON形式だけで返してください。

{
  "candidates": [
    {
      "name": "図鑑一覧にある名前",
      "confidence": 80
    },
    {
      "name": "図鑑一覧にある名前",
      "confidence": 15
    },
    {
      "name": "図鑑一覧にある名前",
      "confidence": 5
    }
  ]
}

ルール：
・図鑑一覧にある名前だけを使う
・候補は必ず3件
・同じ名前を重複させない
・confidenceは0から100の整数
・説明文やコードブロックは付けない
`.trim();

            const geminiUrl =
                "https://generativelanguage.googleapis.com/" +
                "v1beta/models/" +
                encodeURIComponent(
                    modelResult.model
                ) +
                ":generateContent";

            const geminiResponse =
                await fetch(
                    geminiUrl,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "x-goog-api-key":
                                env.GEMINI_API_KEY
                        },

                        body: JSON.stringify({

                            contents: [
                                {
                                    parts: [
                                        {
                                            inline_data: {
                                                mime_type:
                                                    image.mimeType,

                                                data:
                                                    image.base64
                                            }
                                        },
                                        {
                                            text:
                                                prompt
                                        }
                                    ]
                                }
                            ],

                            generationConfig: {
                                temperature: 0.1,
                                maxOutputTokens: 600,
                                responseMimeType:
                                    "application/json"
                            }

                        })
                    }
                );

            const responseText =
                await geminiResponse.text();

            let geminiData;

            try {

                geminiData =
                    JSON.parse(responseText);

            } catch {

                geminiData = {
                    raw: responseText
                };

            }

            if (!geminiResponse.ok) {

                return sendJson({
                    success: false,
                    error:
                        "Gemini APIでエラーが発生しました",
                    status:
                        geminiResponse.status,
                    model:
                        modelResult.model,
                    details:
                        geminiData
                }, geminiResponse.status);

            }

            const resultText =
                geminiData
                    ?.candidates
                    ?.[0]
                    ?.content
                    ?.parts
                    ?.[0]
                    ?.text;

            if (!resultText) {

                return sendJson({
                    success: false,
                    error:
                        "AIから判定結果が返りませんでした",
                    details:
                        geminiData
                }, 502);

            }

            let aiResult;

            try {

                aiResult =
                    JSON.parse(
                        cleanJson(resultText)
                    );

            } catch {

                return sendJson({
                    success: false,
                    error:
                        "AIの回答を読み取れませんでした",
                    raw:
                        resultText
                }, 502);

            }

            const candidates =
                matchCandidates(
                    aiResult?.candidates,
                    catalogNames
                );

            if (
                candidates.length <
                CANDIDATE_COUNT
            ) {

                return sendJson({
                    success: false,
                    error:
                        "図鑑と一致する候補が不足しています",
                    aiCandidates:
                        aiResult?.candidates,
                    matchedCandidates:
                        candidates
                }, 502);

            }

            return sendJson({
                success: true,
                model:
                    modelResult.model,
                candidates:
                    candidates.slice(
                        0,
                        CANDIDATE_COUNT
                    )
            }, 200);

        } catch (error) {

            return sendJson({
                success: false,
                error:
                    "Workerでエラーが発生しました",
                details:
                    String(error)
            }, 500);

        }

    }

};


// =======================================
// APIキーで使用可能なモデルを確認
// =======================================

async function getAvailableModel(apiKey) {

    try {

        const response =
            await fetch(
                "https://generativelanguage.googleapis.com/v1beta/models",
                {
                    headers: {
                        "x-goog-api-key":
                            apiKey
                    }
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            return {
                success: false,
                models: [],
                details: data
            };

        }

        const models =
            Array.isArray(data?.models)
                ? data.models
                    .filter(model =>
                        Array.isArray(
                            model
                                ?.supportedGenerationMethods
                        ) &&
                        model
                            .supportedGenerationMethods
                            .includes(
                                "generateContent"
                            )
                    )
                    .map(model =>
                        String(model.name)
                            .replace(
                                /^models\//,
                                ""
                            )
                    )
                : [];

        const model =
            models.find(name => {

                const lower =
                    name.toLowerCase();

                return (
                    lower.includes("flash") &&
                    !lower.includes("audio") &&
                    !lower.includes("image") &&
                    !lower.includes("tts")
                );

            }) ??
            models.find(name =>
                name
                    .toLowerCase()
                    .includes("gemini")
            ) ??
            null;

        return {
            success:
                Boolean(model),
            model,
            models,
            details: null
        };

    } catch (error) {

        return {
            success: false,
            models: [],
            details:
                String(error)
        };

    }

}


// =======================================
// 写真データを分解
// =======================================

function parseImageData(imageData) {

    const match =
        String(imageData).match(
            /^data:(image\/[a-zA-Z0-9.+-]+);base64,([\s\S]+)$/
        );

    if (!match) {
        return null;
    }

    return {
        mimeType:
            match[1],

        base64:
            match[2]
                .replace(/\s/g, "")
    };

}


// =======================================
// 図鑑名を整理
// =======================================

function normalizeCatalogNames(value) {

    if (!Array.isArray(value)) {
        return [];
    }

    return [
        ...new Set(
            value
                .map(name =>
                    String(name ?? "")
                        .trim()
                )
                .filter(Boolean)
                .slice(
                    0,
                    MAX_CATALOG_COUNT
                )
        )
    ];

}


// =======================================
// AI候補を図鑑名と照合
// =======================================

function matchCandidates(
    aiCandidates,
    catalogNames
) {

    if (!Array.isArray(aiCandidates)) {
        return [];
    }

    const catalogMap =
        new Map();

    for (const name of catalogNames) {

        catalogMap.set(
            normalizeName(name),
            name
        );

    }

    const used =
        new Set();

    const results = [];

    for (const candidate of aiCandidates) {

        const normalized =
            normalizeName(
                candidate?.name
            );

        const officialName =
            catalogMap.get(normalized);

        if (
            !officialName ||
            used.has(officialName)
        ) {
            continue;
        }

        used.add(officialName);

        results.push({
            name:
                officialName,

            confidence:
                Math.min(
                    100,
                    Math.max(
                        0,
                        Math.round(
                            Number(
                                candidate?.confidence
                            ) || 0
                        )
                    )
                )
        });

    }

    return results.sort(
        (a, b) =>
            b.confidence -
            a.confidence
    );

}


function normalizeName(value) {

    return String(value ?? "")
        .trim()
        .replace(/\s+/g, "")
        .replace(
            /[。、，,.！!？?「」『』"'（）()]/g,
            ""
        )
        .toLowerCase();

}


function cleanJson(value) {

    return String(value ?? "")
        .trim()
        .replace(/^```json/i, "")
        .replace(/^```/i, "")
        .replace(/```$/i, "")
        .trim();

}


// =======================================
// JSONを返す
// =======================================

function sendJson(data, status = 200) {

    return new Response(
        JSON.stringify(data),
        {
            status,

            headers: {
                ...CORS,

                "Content-Type":
                    "application/json; charset=UTF-8",

                "Cache-Control":
                    "no-store"
            }
        }
    );

}
