// =======================================
// いきものマスター Ver2
// tools/ai.js
// MASTER図鑑対応・AI判定改善版
// =======================================

// =======================================
// 写真をAIで判定
// =======================================

async function identifyPhoto(imageBase64) {

    const status =
        document.getElementById("aiStatus");

    try {

        setStatus(
            status,
            "AI判定中..."
        );

        // -------------------------------
        // 入力画像を確認
        // -------------------------------

        const imageData =
            parseImageData(imageBase64);

        if (!imageData) {

            throw new Error(
                "画像データを読み込めませんでした"
            );

        }

        // -------------------------------
        // 図鑑データを取得
        // -------------------------------

        const catalog =
            getCatalog();

        if (catalog.length === 0) {

            throw new Error(
                "図鑑データがありません"
            );

        }

        const candidateNames =
            catalog
                .map(item =>
                    String(item?.name ?? "").trim()
                )
                .filter(Boolean);

        // -------------------------------
        // Gemini APIへ送信
        // -------------------------------

        const response =
            await fetch(
                createGeminiUrl(),
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text:
createIdentifyPrompt(
    candidateNames
)
                                    },
                                    {
                                        inline_data: {
                                            mime_type:
                                                imageData.mimeType,

                                            data:
                                                imageData.base64
                                        }
                                    }
                                ]
                            }
                        ],

                        generationConfig: {
                            temperature: 0,
                            maxOutputTokens: 30
                        }
                    })
                }
            );

        // -------------------------------
        // HTTPエラー確認
        // -------------------------------

        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Gemini API エラー",
                response.status,
                errorText
            );

            throw new Error(
                `AI通信エラー（${response.status}）`
            );

        }

        const json =
            await response.json();

        // -------------------------------
        // AIの回答を取得
        // -------------------------------

        const rawResult =
            json
                ?.candidates
                ?.[0]
                ?.content
                ?.parts
                ?.[0]
                ?.text;

        const result =
            cleanAiResult(rawResult);

        if (!result) {

            console.error(
                "AI回答がありません",
                json
            );

            throw new Error(
                "生き物を判定できませんでした"
            );

        }

        console.log(
            "AI判定結果:",
            result
        );

        // -------------------------------
        // 図鑑から検索
        // -------------------------------

        const card =
            getCardByName(result);

        if (!card) {

            setStatus(
                status,
                "図鑑にない生き物かも"
            );

            showToast(
                `${result} は現在の図鑑にありません`
            );

            return;

        }

        // -------------------------------
        // 登録
        // -------------------------------

        setStatus(
            status,
            `${card.name} を発見！`
        );

        registerCard(
            Number(card.no)
        );

    } catch (error) {

        console.error(
            "AI判定に失敗しました",
            error
        );

        setStatus(
            status,
            "判定に失敗しました"
        );

        showToast(
            error?.message ??
            "AI判定に失敗しました"
        );

    }

}

// =======================================
// MASTERから図鑑データ取得
// =======================================

function getCatalog() {

    return Array.isArray(
        window.MASTER?.encyclopedia
    )
        ? window.MASTER.encyclopedia
        : [];

}

// =======================================
// 名前で図鑑を検索
// =======================================

function getCardByName(name) {

    const targetName =
        normalizeName(name);

    if (!targetName) {

        return null;

    }

    const catalog =
        getCatalog();

    // 完全一致を優先
    const exactMatch =
        catalog.find(item => {

            return normalizeName(
                item?.name
            ) === targetName;

        });

    if (exactMatch) {

        return exactMatch;

    }

    // 「ニホン」「日本」などが回答に
    // 付いた場合を考慮して部分一致
    return (
        catalog.find(item => {

            const itemName =
                normalizeName(
                    item?.name
                );

            return (
                itemName.includes(
                    targetName
                ) ||
                targetName.includes(
                    itemName
                )
            );

        }) ?? null
    );

}

// =======================================
// AIへの指示文
// =======================================

function createIdentifyPrompt(
    candidateNames
) {

    const nameList =
        candidateNames.join("、");

    return `
この画像に写っている生き物・植物を判定してください。

次の図鑑一覧の中から、もっとも近い名前を必ず1つだけ選んでください。

【図鑑一覧】
${nameList}

【回答ルール】
・図鑑一覧にある名前だけを答える
・説明や記号は付けない
・名前を1つだけ答える
・判断できない場合は「判定不能」と答える
`.trim();

}

// =======================================
// Gemini API URL
// =======================================

function createGeminiUrl() {

    if (
        !window.CONFIG?.MODEL ||
        !window.CONFIG?.GEMINI_API_KEY
    ) {

        throw new Error(
            "AI設定が見つかりません"
        );

    }

    const model =
        encodeURIComponent(
            window.CONFIG.MODEL
        );

    const apiKey =
        encodeURIComponent(
            window.CONFIG.GEMINI_API_KEY
        );

    return (
        "https://generativelanguage.googleapis.com/" +
        `v1beta/models/${model}:generateContent` +
        `?key=${apiKey}`
    );

}

// =======================================
// Data URLを分解
// =======================================

function parseImageData(
    imageBase64
) {

    const text =
        String(
            imageBase64 ?? ""
        );

    const match =
        text.match(
            /^data:([^;]+);base64,(.+)$/
        );

    if (!match) {

        return null;

    }

    return {
        mimeType:
            match[1] ||
            "image/jpeg",

        base64:
            match[2]
    };

}

// =======================================
// AI回答を整理
// =======================================

function cleanAiResult(result) {

    return String(
        result ?? ""
    )
        .trim()
        .replace(/^["'「『]/, "")
        .replace(/["'」』]$/, "")
        .replace(
            /^(答え|回答|判定結果)[:：]\s*/,
            ""
        )
        .split(/\r?\n/)[0]
        .trim();

}

// =======================================
// 名前の比較用に整える
// =======================================

function normalizeName(name) {

    return String(
        name ?? ""
    )
        .trim()
        .replaceAll(" ", "")
        .replaceAll("　", "")
        .replace(/[。、，,.！!？?]/g, "")
        .toLowerCase();

}

// =======================================
// ステータス表示
// =======================================

function setStatus(
    element,
    message
) {

    if (element) {

        element.textContent =
            message;

    }

}