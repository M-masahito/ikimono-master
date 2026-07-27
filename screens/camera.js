// =====================================
// screens/camera.js Ver2
// =====================================

import { getSave, update } from "../system/storage.js";

const EXP_PER_DISCOVERY = 10;

export function showCamera(screen) {

    screen.innerHTML = `
        <div class="card cameraScreen">

            <h2>📷 AI判定</h2>

            <p>生き物の写真を撮影、または選択してください。</p>

            <input
                id="photoInput"
                type="file"
                accept="image/*"
                capture="environment">

            <div id="previewArea" class="previewArea"></div>

            <button
                id="judgeButton"
                class="mainButton"
                disabled>

                🤖 AI判定する

            </button>

            <div id="judgeResult" class="judgeResult">

                写真を選択してください。

            </div>

        </div>
    `;

    const photoInput = screen.querySelector("#photoInput");
    const previewArea = screen.querySelector("#previewArea");
    const judgeButton = screen.querySelector("#judgeButton");
    const judgeResult = screen.querySelector("#judgeResult");

    let imageFile = null;

    photoInput.addEventListener("change", e => {

        imageFile = e.target.files[0];

        if (!imageFile) return;

        const reader = new FileReader();

        reader.onload = () => {

            previewArea.innerHTML = `
                <img
                    class="cameraPreview"
                    src="${reader.result}">
            `;

        };

        reader.readAsDataURL(imageFile);

        judgeButton.disabled = false;

        judgeResult.innerHTML =
            "AI判定の準備ができました。";

    });

    judgeButton.addEventListener("click", async () => {

        if (!imageFile) return;

        judgeButton.disabled = true;

        judgeResult.innerHTML = `
            <h3>🤖 AI判定中...</h3>
            <p>画像を解析しています。</p>
        `;

        try {

            const result = await judgeImage(imageFile);

            const isNew = saveResult(result);

            showResult(result, isNew, judgeResult, screen);

        } catch (err) {

            console.error(err);

            judgeResult.innerHTML = `
                <h3>❌ 判定失敗</h3>
                <p>もう一度お試しください。</p>
            `;

        }

        judgeButton.disabled = false;

    });

}


// ======================
// AI判定
// 後でOpenAI/Geminiへ置き換える
// ======================

async function judgeImage(file) {

    await new Promise(resolve =>
        setTimeout(resolve, 1500)
    );

    return {

        no: 1,

        name: "カブトムシ",

        rarity: "B",

        category: "昆虫",

        confidence: 98

    };

}


// ======================
// 保存
// ======================

function saveResult(result) {

    let isNew = false;

    update(save => {

        if (!save.discovered.includes(result.no)) {

            save.discovered.push(result.no);

            isNew = true;

        }

        const card =
            save.cards.find(c => c.no === result.no);

        if (card) {

            card.count =
                (card.count || 1) + 1;

        } else {

            save.cards.push({

                no: result.no,

                name: result.name,

                rarity: result.rarity,

                category: result.category,

                owner: "あなた",

                count: 1,

                obtained: new Date().toISOString()

            });

        }

        save.spirit.exp += EXP_PER_DISCOVERY;

        while (save.spirit.exp >= 100) {

            save.spirit.exp -= 100;

            save.spirit.level++;

        }

    });

    return isNew;

}
// ======================
// 結果表示
// ======================

function showResult(result, isNew, judgeResult, screen) {

    const save = getSave();

    const card = save.cards.find(c => c.no === result.no);

    judgeResult.innerHTML = `

        <div class="resultCard">

            <div class="resultTitle">

                ${isNew ? "🎉 NEW DISCOVERY!" : "🔁 GET!"}

            </div>

            <div class="resultName">

                ${result.name}

            </div>

            <div class="resultNo">

                No.${String(result.no).padStart(3, "0")}

            </div>

            <div class="resultInfo">

                <p>📂 カテゴリ：${result.category}</p>

                <p>⭐ レア度：${result.rarity}</p>

                <p>🎯 AI一致率：${result.confidence}%</p>

            </div>

            <hr>

            <div class="resultStatus">

                <p>📖 図鑑登録数：${save.discovered.length} / 500</p>

                <p>🃏 保有枚数：${card.count}</p>

                <p>✨ 精霊Lv：${save.spirit.level}</p>

                <p>⭐ EXP：${save.spirit.exp} / 100</p>

            </div>

            <div class="resultButtons">

                <button
                    id="againButton"
                    class="mainButton">

                    📷 もう一度判定

                </button>

            </div>

        </div>

    `;

    screen.querySelector("#againButton")
        .addEventListener("click", () => {

            showCamera(screen);

        });

}