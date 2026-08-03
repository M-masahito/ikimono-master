// =====================================
// screens/home.js Ver4
// PART1
// =====================================

import { getSave } from "../system/storage.js";
import { openScreen } from "../app.js";

export function showHome(screen) {

    const save = getSave();

    const discovered =
        save.discovered?.length ?? 0;

    const spiritName =
        save.spirit?.name ??
        "ふしぎなたまご";

    const progress =
        Math.min(
            (discovered / 500) * 100,
            100
        );

    const percent =
        progress.toFixed(1);

    const stages = [

        {
            min:150,
            icon:"🐉",
            message:"伝説の精霊になったよ！"
        },

        {
            min:60,
            icon:"🧚",
            message:"今日も探検しよう！"
        },

        {
            min:10,
            icon:"🌱",
            message:"仲間が増えてきたね！"
        },

        {
            min:3,
            icon:"🐣",
            message:"生まれたよ！"
        },

        {
            min:0,
            icon:"🥚",
            message:"まだ眠っているよ…"
        }

    ];

    const currentStage =
        stages.find(
            stage =>
                discovered >= stage.min
        );
            screen.innerHTML = `

<section class="garden-home">

    <div class="garden-sky">

        <div class="garden-title">

            <h1>いきものマスター</h1>

        </div>

        <div class="spirit-area">

            <button
                id="spiritButton"
                class="spirit-button"
                type="button">

                <span class="spirit-character">

                    ${currentStage.icon}

                </span>

                <span class="spirit-name">

                    ${spiritName}

                </span>

            </button>

            <div
                id="spiritSpeech"
                class="spirit-speech">

                ${currentStage.message}

            </div>

        </div>

        <div class="garden-ground">

            <span class="garden-tree">🌳</span>

            <span class="garden-plant">🌷</span>

            <span class="garden-plant">🌿</span>

            <span class="garden-plant">🍄</span>

        </div>

    </div>

    <div class="home-status-card">

        <h3>📖 図鑑完成率</h3>

        <strong>

            ${discovered} / 500

        </strong>

        <div class="encyclopedia-progress">

            <div
                class="encyclopedia-progress-bar"
                style="width:${progress}%">
            </div>

        </div>

        <p>

            ${percent}%

        </p>

    </div>

    <div class="home-main-actions">

        <button
            id="cameraButton"
            class="home-action-button camera-action"
            type="button">

            📷 仲間をさがす

        </button>

        <button
            id="bookButton"
            class="home-action-button book-action"
            type="button">

            📖 図鑑をひらく

        </button>

    </div>

</section>

`;
    const spiritButton =
        document.getElementById("spiritButton");

    const spiritSpeech =
        document.getElementById("spiritSpeech");

    const cameraButton =
        document.getElementById("cameraButton");

    const bookButton =
        document.getElementById("bookButton");

    const messages = [

        "今日はどんな仲間に会えるかな？",

        "新しい生き物を探しに行こう！",

        "図鑑をいっぱいにしよう！",

        `もう${discovered}種類も見つけたね！`,

        "木の下を探してみよう！",

        "草むらには昆虫がいるかも！",

        "池には魚やカエルがいるよ！",

        "写真を撮ったら教えてね！"

    ];

   spiritButton?.addEventListener("click", () => {

    openScreen("spirit");

});

    cameraButton?.addEventListener("click", () => {

        openScreen("camera");

    });

    bookButton?.addEventListener("click", () => {

        openScreen("catalog");

    });

}