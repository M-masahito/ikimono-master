// =====================================
// screens/home.js
// 庭ホーム画面
// =====================================

import { getSave } from "../system/storage.js";

export function showHome(screen) {

    const save = getSave();

    const discovered = save.discovered?.length ?? 0;
    const spiritName = save.spirit?.name ?? "ふしぎなたまご";

    let spiritStage = "🥚";
    let spiritMessage = "まだ眠っているみたい……";

    if (discovered >= 150) {
        spiritStage = "🐉";
        spiritMessage = "ぼくたちは、もう立派な神獣だよ！";
    } else if (discovered >= 100) {
        spiritStage = "👑";
        spiritMessage = "精霊王として、今日も一緒に探そう！";
    } else if (discovered >= 60) {
        spiritStage = "✨";
        spiritMessage = "新しい生き物の気配がするよ！";
    } else if (discovered >= 30) {
        spiritStage = "🧚";
        spiritMessage = "今日はどんな生き物に会えるかな？";
    } else if (discovered >= 10) {
        spiritStage = "🌱";
        spiritMessage = "もっとたくさんの生き物を見つけよう！";
    } else if (discovered >= 3) {
        spiritStage = "🐣";
        spiritMessage = "生まれたよ！名前をつけてね！";
    }

    const progress = Math.min((discovered / 500) * 100, 100);

    screen.innerHTML = `

        <section class="garden-home">

            <div class="garden-sky">

                <div class="garden-title">
                    <h1>いきものマスター</h1>
                    <p>精霊といっしょに生き物を探そう</p>
                </div>

                <div class="garden-cloud cloud-one">☁️</div>
                <div class="garden-cloud cloud-two">☁️</div>

                <div class="spirit-area">

                    <button
                        id="spiritButton"
                        class="spirit-button"
                        type="button"
                        aria-label="精霊に話しかける"
                    >
                        <span class="spirit-character">
                            ${spiritStage}
                        </span>

                        <span class="spirit-name">
                            ${spiritName}
                        </span>
                    </button>

                    <div id="spiritSpeech" class="spirit-speech">
                        ${spiritMessage}
                    </div>

                </div>

                <div class="garden-ground">

                    <span class="garden-plant plant-one">🌷</span>
                    <span class="garden-plant plant-two">🌿</span>
                    <span class="garden-plant plant-three">🌼</span>
                    <span class="garden-tree">🌳</span>
                    <span class="garden-plant plant-four">🍄</span>

                </div>

            </div>

            <div class="home-status-card">

                <div>
                    <span class="status-label">図鑑の発見</span>
                    <strong>${discovered} / 500</strong>
                </div>

                <div class="encyclopedia-progress">
                    <div
                        class="encyclopedia-progress-bar"
                        style="width: ${progress}%"
                    ></div>
                </div>

            </div>

            <div class="home-main-actions">

                <button
                    id="cameraButton"
                    class="home-action-button camera-action"
                    type="button"
                >
                    <span class="action-icon">📷</span>
                    <span>
                        <strong>精霊に写真を見せる</strong>
                        <small>生き物を調べてもらおう</small>
                    </span>
                </button>

                <button
                    id="bookButton"
                    class="home-action-button book-action"
                    type="button"
                >
                    <span class="action-icon">📖</span>
                    <span>
                        <strong>図鑑を見る</strong>
                        <small>見つけた生き物を確認</small>
                    </span>
                </button>

            </div>

        </section>
    `;

    const spiritButton = document.getElementById("spiritButton");
    const spiritSpeech = document.getElementById("spiritSpeech");
    const cameraButton = document.getElementById("cameraButton");
    const bookButton = document.getElementById("bookButton");

    const messages = [
        "今日はどんな生き物に会えるかな？",
        "写真を見せてくれたら、ぼくが調べるよ！",
        `いままでに${discovered}種類見つけたね！`,
        "図鑑には、まだ知らない生き物がいっぱいだよ！",
        "外へ探検に行ってみよう！"
    ];

    spiritButton?.addEventListener("click", () => {
        const randomIndex = Math.floor(Math.random() * messages.length);
        spiritSpeech.textContent = messages[randomIndex];
    });

    cameraButton?.addEventListener("click", () => {
        window.location.hash = "#camera";
    });

    bookButton?.addEventListener("click", () => {
        window.location.hash = "#encyclopedia";
    });

}