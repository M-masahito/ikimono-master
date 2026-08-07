// =====================================
// screens/home.js Ver6
// 森のホーム画面
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
// ホーム画面
// =====================================

export function showHome(screen) {

    const save = getSave();

    const discoveredNumbers =
        getDiscoveredNumbers(save);

    const discoveredCount =
        discoveredNumbers.length;


    // =================================
    // 図鑑レベル
    // =================================

    const catalogLevel =
        getCatalogLevel(discoveredCount);

    const unlockedMaxNo =
        getUnlockedMaxNo(catalogLevel);

    const nextLevelCount =
        getNextLevelCount(catalogLevel);

    const totalProgress =
        Math.min(
            discoveredCount /
            TOTAL_ENCYCLOPEDIA *
            100,
            100
        );


    // =================================
    // 精霊
    // =================================

    const spiritName =
        save?.spirit?.name ??
        "ふしぎなたまご";

    const spiritStages = [

        {
            min: 150,
            icon: "🐉",
            message: "すごい！ 大きな力が目覚めているよ！"
        },

        {
            min: 60,
            icon: "🧚",
            message: "たくさんの仲間と出会えたね！"
        },

        {
            min: 10,
            icon: "🌱",
            message: "もっといろんな仲間を探してみよう！"
        },

        {
            min: 3,
            icon: "🐣",
            message: "新しい命が生まれたよ！"
        },

        {
            min: 0,
            icon: "🥚",
            message: "今日はどんな仲間に会えるかな？"
        }

    ];

    const currentSpiritStage =
        spiritStages.find(
            stage =>
                discoveredCount >= stage.min
        ) ??
        spiritStages[
            spiritStages.length - 1
        ];


    // =================================
    // 今日の発見
    // =================================

    const todayCount =
        getTodayDiscoveryCount(save);


    // =================================
    // HTML
    // =================================

    screen.innerHTML = `

        <section class="forest-home">

            <!-- タイトル -->

            <div class="forest-title-board">

                <span class="title-leaf">
                    🌿
                </span>

                <h1>
                    いきものマスター
                </h1>

                <span class="title-leaf">
                    🍃
                </span>

            </div>


            <!-- 上部ステータス -->

            <div class="forest-top-status">

                <button
                    id="catalogProgressButton"
                    class="forest-progress-card"
                    type="button"
                >

                    <span class="forest-book-icon">
                        📗
                    </span>

                    <span class="forest-progress-info">

                        <small>
                            図鑑の進み具合
                        </small>

                        <strong>
                            ${discoveredCount}
                            <span>
                                / ${TOTAL_ENCYCLOPEDIA}
                            </span>
                        </strong>

                        <span class="forest-progress-bar">

                            <span
                                style="
                                    width:${totalProgress}%;
                                "
                            ></span>

                        </span>

                    </span>

                </button>


                <button
                    id="settingsButton"
                    class="forest-settings-button"
                    type="button"
                    aria-label="設定"
                >

                    <span>
                        ⚙️
                    </span>

                    <small>
                        設定
                    </small>

                </button>

            </div>


            <!-- 精霊と大きな木 -->

            <div class="forest-world">

                <div class="forest-sunlight"></div>

                <div class="forest-big-tree">

                    <div class="tree-crown">
                        🌳
                    </div>

                    <div class="tree-door">
                        🚪
                    </div>

                </div>


                <div class="forest-spirit-zone">

                    <div class="forest-speech">

                        ${escapeHtml(
                            currentSpiritStage.message
                        )}

                    </div>

                    <button
                        id="spiritButton"
                        class="forest-spirit"
                        type="button"
                    >

                        <span class="forest-spirit-character">

                            ${currentSpiritStage.icon}

                        </span>

                        <small>

                            ${escapeHtml(spiritName)}

                        </small>

                    </button>

                </div>


                <div class="forest-message-board">

                    <span>
                        今日も
                    </span>

                    <strong>
                        すてきな出会いが
                    </strong>

                    <span>
                        ありますように！
                    </span>

                </div>

            </div>


            <!-- メインボタン -->

            <div class="forest-main-actions">

                <button
                    id="cameraButton"
                    class="
                        forest-action-card
                        forest-camera-card
                    "
                    type="button"
                >

                    <div class="forest-action-picture">

                        <span class="action-butterfly">
                            🦋
                        </span>

                        <span class="action-camera">
                            📷
                        </span>

                    </div>

                    <strong>
                        仲間をさがす
                    </strong>

                    <small>
                        写真をとって
                        <br>
                        いきものを見つけよう！
                    </small>

                </button>


                <button
                    id="bookButton"
                    class="
                        forest-action-card
                        forest-book-card
                    "
                    type="button"
                >

                    <div class="forest-action-picture">

                        📗

                    </div>

                    <strong>
                        図鑑
                    </strong>

                    <small>
                        見つけた仲間を
                        <br>
                        図鑑に集めよう！
                    </small>

                </button>

            </div>


            <!-- 下部ステータス -->

            <div class="forest-bottom-status">

                <div class="forest-today">

                    <span>
                        🍀
                    </span>

                    <div>

                        <small>
                            今日見つけた仲間
                        </small>

                        <strong>
                            ${todayCount}
                            <span>種類</span>
                        </strong>

                    </div>

                </div>


                <div class="forest-status-divider"></div>


                <div class="forest-total">

                    <span>
                        👑
                    </span>

                    <div>

                        <small>
                            図鑑の達成
                        </small>

                        <strong>
                            ${discoveredCount}
                            <span>
                                / ${TOTAL_ENCYCLOPEDIA}
                            </span>
                        </strong>

                    </div>

                </div>

            </div>


            <!-- プレゼント -->

            <button
                id="presentButton"
                class="forest-present-button"
                type="button"
            >

                <span>
                    🎁
                </span>

                <small>
                    プレゼント
                </small>

            </button>


            <!-- 図鑑レベル情報 -->

            <div class="forest-level-info">

                Lv.${catalogLevel}

                ・

                No.001〜${String(
                    unlockedMaxNo
                ).padStart(3, "0")}

                解放中

                ${
                    nextLevelCount !== null
                        ? `
                            ・次の解放まで
                            ${Math.max(
                                nextLevelCount -
                                discoveredCount,
                                0
                            )}種類
                        `
                        : "・図鑑マスター！"
                }

            </div>

        </section>

    `;


    // =================================
    // ボタン
    // =================================

    screen
        .querySelector("#cameraButton")
        ?.addEventListener(
            "click",
            () => openScreen("camera")
        );


    screen
        .querySelector("#bookButton")
        ?.addEventListener(
            "click",
            () => openScreen("catalog")
        );


    screen
        .querySelector("#catalogProgressButton")
        ?.addEventListener(
            "click",
            () => openScreen("catalog")
        );


    screen
        .querySelector("#spiritButton")
        ?.addEventListener(
            "click",
            () => openScreen("spirit")
        );


    screen
        .querySelector("#settingsButton")
        ?.addEventListener(
            "click",
            () => {

                if (
                    typeof openScreen === "function"
                ) {

                    try {

                        openScreen("settings");

                    } catch {

                        console.log(
                            "設定画面は準備中です"
                        );

                    }

                }

            }
        );


    screen
        .querySelector("#presentButton")
        ?.addEventListener(
            "click",
            () => {

                alert(
                    "🎁 プレゼントは準備中だよ！"
                );

            }
        );

}


// =====================================
// 今日の発見数
// =====================================

function getTodayDiscoveryCount(save) {

    if (
        !Array.isArray(
            save?.discoveryHistory
        )
    ) {

        return 0;

    }

    const today =
        new Date();

    return save.discoveryHistory.filter(
        item => {

            const rawDate =
                item?.date ??
                item?.discoveredAt ??
                item?.createdAt;

            if (!rawDate) {

                return false;

            }

            const date =
                new Date(rawDate);

            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {

                return false;

            }

            return (
                date.getFullYear() ===
                    today.getFullYear() &&

                date.getMonth() ===
                    today.getMonth() &&

                date.getDate() ===
                    today.getDate()
            );

        }
    ).length;

}


// =====================================
// 発見済みNo.
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