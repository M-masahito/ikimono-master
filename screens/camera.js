// =====================================
// screens/camera.js Ver3
// 精霊によるAI判定画面
// =====================================

import { getSave, update } from "../system/storage.js";

export function showCamera(screen) {

    screen.innerHTML = `
        <section class="camera-page">

            <div class="camera-header">
                <h2>📷 精霊の生き物判定</h2>
                <p>写真を見せると、精霊が候補を探してくれるよ。</p>
            </div>

            <div class="camera-card">

                <label class="photo-select-button" for="photoInput">
                    <span>📷</span>
                    <strong>写真を撮る・選ぶ</strong>
                </label>

                <input
                    id="photoInput"
                    class="photo-input"
                    type="file"
                    accept="image/*"
                    capture="environment"
                >

                <div id="previewArea" class="preview-area">
                    <p>ここに写真が表示されます</p>
                </div>

                <button
                    id="judgeButton"
                    class="mainButton"
                    type="button"
                    disabled
                >
                    ✨ 精霊に調べてもらう
                </button>

            </div>

            <div id="judgeResult" class="judge-result">
                <div class="spirit-judge-message">
                    🥚「写真を見せてね！」
                </div>
            </div>

        </section>
    `;

    const photoInput = screen.querySelector("#photoInput");
    const previewArea = screen.querySelector("#previewArea");
    const judgeButton = screen.querySelector("#judgeButton");
    const judgeResult = screen.querySelector("#judgeResult");

    let imageFile = null;

    photoInput.addEventListener("change", event => {

        imageFile = event.target.files?.[0] ?? null;

        if (!imageFile) {
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            previewArea.innerHTML = `
                <img
                    class="cameraPreview"
                    src="${reader.result}"
                    alt="選択した生き物の写真"
                >
            `;
        };

        reader.readAsDataURL(imageFile);

        judgeButton.disabled = false;

        judgeResult.innerHTML = `
            <div class="spirit-judge-message">
                🥚「準備できたよ！調べてみよう！」
            </div>
        `;

    });

    judgeButton.addEventListener("click", async () => {

        if (!imageFile) {
            return;
        }

        judgeButton.disabled = true;

        judgeResult.innerHTML = `
            <div class="analysis-box">

                <div class="analysis-spirit">🥚</div>

                <h3>精霊が調べています…</h3>

                <p>写真の形や色を見ています。</p>

                <div class="analysis-loader"></div>

            </div>
        `;

        try {

            const candidates = await judgeImage(imageFile);

            showCandidates(
                candidates,
                judgeResult,
                screen
            );

        } catch (error) {

            console.error(error);

            judgeResult.innerHTML = `
                <div class="error-box">
                    <h3>判定できませんでした</h3>
                    <p>もう一度、写真を選び直してください。</p>
                </div>
            `;

            judgeButton.disabled = false;

        }

    });

}


// =====================================
// 仮のAI判定
// 後で本物のAIへ置き換える
// =====================================

async function judgeImage(file) {

    await new Promise(resolve =>
        setTimeout(resolve, 1800)
    );

    return [
        {
            no: 1,
            name: "カブトムシ",
            rarity: "B",
            category: "昆虫",
            type: "甲虫",
            confidence: 87
        },
        {
            no: 2,
            name: "コカブト",
            rarity: "A",
            category: "昆虫",
            type: "甲虫",
            confidence: 9
        },
        {
            no: 3,
            name: "ノコギリクワガタ",
            rarity: "B",
            category: "昆虫",
            type: "甲虫",
            confidence: 4
        }
    ];

}


// =====================================
// 候補表示
// =====================================

function showCandidates(candidates, judgeResult, screen) {

    judgeResult.innerHTML = `

        <div class="candidate-area">

            <div class="spirit-judge-message">
                🥚「この中にいると思うよ！」
            </div>

            <h3>どの生き物かな？</h3>

            <div class="candidate-list">

                ${candidates.map((candidate, index) => `
                    <button
                        class="candidate-button"
                        type="button"
                        data-index="${index}"
                    >
                        <span class="candidate-rank">
                            ${index + 1}
                        </span>

                        <span class="candidate-main">
                            <strong>${candidate.name}</strong>
                            <small>
                                ${candidate.category}・${candidate.type}
                            </small>
                        </span>

                        <span class="candidate-confidence">
                            ${candidate.confidence}%
                        </span>
                    </button>
                `).join("")}

            </div>

            <button
                id="retryPhotoButton"
                class="subButton"
                type="button"
            >
                📷 別の写真を選ぶ
            </button>

        </div>
    `;

    judgeResult
        .querySelectorAll(".candidate-button")
        .forEach(button => {

            button.addEventListener("click", () => {

                const index = Number(button.dataset.index);
                const selected = candidates[index];

                const isNew = saveResult(selected);

                showResult(
                    selected,
                    isNew,
                    judgeResult,
                    screen
                );

            });

        });

    screen
        .querySelector("#retryPhotoButton")
        ?.addEventListener("click", () => {

            showCamera(screen);

        });

}


// =====================================
// 保存
// 発見種類数で精霊が成長する
// =====================================

function saveResult(result) {

    let isNew = false;

    update(save => {

        if (!Array.isArray(save.discovered)) {
            save.discovered = [];
        }

        if (!Array.isArray(save.cards)) {
            save.cards = [];
        }

        if (!save.discovered.includes(result.no)) {

            save.discovered.push(result.no);
            isNew = true;

        }

        const card = save.cards.find(
            item => item.no === result.no
        );

        if (card) {

            card.count = (card.count ?? 1) + 1;

        } else {

            save.cards.push({
                no: result.no,
                name: result.name,
                rarity: result.rarity,
                category: result.category,
                type: result.type,
                owner: "あなた",
                count: 1,
                obtained: new Date().toISOString()
            });

        }

    });

    return isNew;

}


// =====================================
// 結果表示
// =====================================

function showResult(result, isNew, judgeResult, screen) {

    const save = getSave();

    const card = save.cards.find(
        item => item.no === result.no
    );

    judgeResult.innerHTML = `

        <div class="discovery-result">

            <div class="discovery-effect">
                ${isNew ? "✨ NEW DISCOVERY ✨" : "🔁 また会えたね！"}
            </div>

            <div class="discovery-card">

                <div class="discovery-number">
                    No.${String(result.no).padStart(3, "0")}
                </div>

                <div class="discovery-image">
                    🪲
                </div>

                <h2>${result.name}</h2>

                <div class="discovery-details">
                    <p>カテゴリ：${result.category}</p>
                    <p>タイプ：${result.type}</p>
                    <p>レア度：${result.rarity}</p>
                    <p>AI一致率：${result.confidence}%</p>
                </div>

            </div>

            <div class="registration-message">

                ${
                    isNew
                        ? `
                            <p>📖 図鑑に登録されました！</p>
                            <p>🃏 カードを手に入れました！</p>
                        `
                        : `
                            <p>🃏 カードの保有数が増えました！</p>
                        `
                }

                <p>現在の発見数：${save.discovered.length} / 500</p>
                <p>保有枚数：${card?.count ?? 1}</p>

            </div>

            <div class="resultButtons">

                <button
                    id="openBookButton"
                    class="mainButton"
                    type="button"
                >
                    📖 図鑑を見る
                </button>

                <button
                    id="againButton"
                    class="subButton"
                    type="button"
                >
                    📷 もう一度調べる
                </button>

            </div>

        </div>
    `;

    screen
        .querySelector("#openBookButton")
        ?.addEventListener("click", () => {

            window.location.hash = "#encyclopedia";

        });

    screen
        .querySelector("#againButton")
        ?.addEventListener("click", () => {

            showCamera(screen);

        });

}