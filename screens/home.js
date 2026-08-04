// =====================================
// screens/home.js Ver5
// 図鑑レベル＋精霊の姿変化対応
// =====================================

import { getSave } from "../system/storage.js";
import { openScreen } from "../app.js";

import {
    getCatalogLevel,
    getUnlockedMaxNo,
    getNextLevelCount
} from "../system/catalogLevel.js";

const TOTAL_ENCYCLOPEDIA = 700;

// =====================================
// ホーム画面を表示
// =====================================

export function showHome(screen) {

    const save = getSave();

    const discoveredNumbers =
        getDiscoveredNumbers(save);

    const discoveredCount =
        discoveredNumbers.length;

    // -------------------------------
    // 図鑑レベル
    // -------------------------------

    const catalogLevel =
        getCatalogLevel(discoveredCount);

    const unlockedMaxNo =
        getUnlockedMaxNo(catalogLevel);

    const nextLevelCount =
        getNextLevelCount(catalogLevel);

    const remainingCount =
        nextLevelCount === null
            ? 0
            : Math.max(
                nextLevelCount - discoveredCount,
                0
            );

    const levelProgress =
        getLevelProgress({
            discoveredCount,
            catalogLevel,
            nextLevelCount
        });

    const totalProgress =
        Math.min(
            discoveredCount /
            TOTAL_ENCYCLOPEDIA *
            100,
            100
        );

    // -------------------------------
    // 精霊
    // レベルではなく発見数で姿が変わる
    // -------------------------------

    const spiritName =
        save?.spirit?.name ??
        "ふしぎなたまご";

    const spiritStages = [

        {
            min: 150,
            icon: "🐉",
            message: "大きな力が目覚めているよ！"
        },

        {
            min: 60,
            icon: "🧚",
            message: "たくさんの仲間と出会えたね！"
        },

        {
            min: 10,
            icon: "🌱",
            message: "少しずつ力が目覚めてきたよ！"
        },

        {
            min: 3,
            icon: "🐣",
            message: "新しい命が生まれたよ！"
        },

        {
            min: 0,
            icon: "🥚",
            message: "まだ静かに眠っているよ…"
        }

    ];

    const currentSpiritStage =
        spiritStages.find(
            stage =>
                discoveredCount >= stage.min
        ) ?? spiritStages[
            spiritStages.length - 1
        ];

    // -------------------------------
    // HTML
    // -------------------------------

    screen.innerHTML = `

        <section class="garden-home">

            <div class="garden-sky">

                <div class="garden-title">

                    <h1>
                        いきものマスター
                    </h1>

                </div>

                <div class="spirit-area">

                    <button
                        id="spiritButton"
                        class="spirit-button"
                        type="button"
                        aria-label="精霊画面を開く"
                    >

                        <span class="spirit-character">

                            ${currentSpiritStage.icon}

                        </span>

                        <span class="spirit-name">

                            ${escapeHtml(spiritName)}

                        </span>

                    </button>

                    <div
                        id="spiritSpeech"
                        class="spirit-speech"
                    >

                        ${escapeHtml(
                            currentSpiritStage.message
                        )}

                    </div>

                </div>

                <div class="garden-ground">

                    <span class="garden-tree">
                        🌳
                    </span>

                    <span class="garden-plant">
                        🌷
                    </span>

                    <span class="garden-plant">
                        🌿
                    </span>

                    <span class="garden-plant">
                        🍄
                    </span>

                </div>

            </div>

            <div class="home-status-card">

                <div class="home-level-header">

                    <div>

                        <span class="home-level-label">

                            📖 図鑑レベル

                        </span>

                        <strong class="home-level-number">

                            Lv.${catalogLevel}

                        </strong>

                    </div>

                    <div class="home-unlocked-range">

                        解放中

                        <br>

                        <strong>

                            No.001〜${String(
                                unlockedMaxNo
                            ).padStart(3, "0")}

                        </strong>

                    </div>

                </div>

                ${
                    nextLevelCount !== null

                        ? `

                            <div class="home-next-level">

                                <div class="home-next-level-info">

                                    <span>
                                        次のレベルまで
                                    </span>

                                    <strong>

                                        あと${remainingCount}種類

                                    </strong>

                                </div>

                                <div class="encyclopedia-progress">

                                    <div
                                        class="encyclopedia-progress-bar"
                                        style="
                                            width:${levelProgress}%;
                                        "
                                    ></div>

                                </div>

                                <p>

                                    ${discoveredCount}
                                    /
                                    ${nextLevelCount}種類

                                </p>

                            </div>

                        `

                        : `

                            <div class="home-next-level">

                                <strong>

                                    🎉 図鑑マスター！

                                </strong>

                                <p>

                                    すべての図鑑ページが
                                    解放されています。

                                </p>

                            </div>

                        `
                }

            </div>

            <div class="home-status-card">

                <h3>

                    🌟 発見した生き物

                </h3>

                <strong>

                    ${discoveredCount}
                    /
                    ${TOTAL_ENCYCLOPEDIA}

                </strong>

                <div class="encyclopedia-progress">

                    <div
                        class="encyclopedia-progress-bar"
                        style="
                            width:${totalProgress}%;
                        "
                    ></div>

                </div>

                <p>

                    ${totalProgress.toFixed(1)}%

                </p>

            </div>

            <div class="home-main-actions">

                <button
                    id="cameraButton"
                    class="
                        home-action-button
                        camera-action
                    "
                    type="button"
                >

                    📷 仲間をさがす

                </button>

                <button
                    id="bookButton"
                    class="
                        home-action-button
                        book-action
                    "
                    type="button"
                >

                    📖 図鑑をひらく

                </button>

            </div>

        </section>

    `;

    // -------------------------------
    // ボタン
    // -------------------------------

    const spiritButton =
        screen.querySelector(
            "#spiritButton"
        );

    const cameraButton =
        screen.querySelector(
            "#cameraButton"
        );

    const bookButton =
        screen.querySelector(
            "#bookButton"
        );

    spiritButton?.addEventListener(
        "click",
        () => {

            openScreen("spirit");

        }
    );

    cameraButton?.addEventListener(
        "click",
        () => {

            openScreen("camera");

        }
    );

    bookButton?.addEventListener(
        "click",
        () => {

            openScreen("catalog");

        }
    );

}

// =====================================
// 発見済みNo.を重複なしで取得
// =====================================

function getDiscoveredNumbers(save) {

    const numbers = [];

    if (
        Array.isArray(
            save?.discovered
        )
    ) {

        numbers.push(
            ...save.discovered
        );

    }

    if (
        Array.isArray(
            save?.discoveredCards
        )
    ) {

        numbers.push(
            ...save.discoveredCards.map(
                card => card?.no
            )
        );

    }

    return [
        ...new Set(
            numbers
                .map(Number)
                .filter(Number.isFinite)
        )
    ];

}

// =====================================
// 現在レベル内の進行率
// =====================================

function getLevelProgress({

    discoveredCount,
    catalogLevel,
    nextLevelCount

}) {

    if (nextLevelCount === null) {

        return 100;

    }

    const previousLevelCount =
        Math.max(
            (catalogLevel - 1) * 50,
            0
        );

    const requiredCount =
        nextLevelCount -
        previousLevelCount;

    const currentCount =
        discoveredCount -
        previousLevelCount;

    if (requiredCount <= 0) {

        return 100;

    }

    return Math.min(
        Math.max(
            currentCount /
            requiredCount *
            100,
            0
        ),
        100
    );

}

// =====================================
// HTMLエスケープ
// =====================================

function escapeHtml(text) {

    return String(text ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

}