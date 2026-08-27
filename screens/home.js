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

        <section class="forest-home forest-garden-home">

            <button
                id="settingsButton"
                class="forest-settings-button"
                type="button"
                aria-label="設定"
            >
                <span>⚙️</span>
            </button>

            <div class="forest-world forest-garden-world">

                <div class="forest-sunlight"></div>

                <div class="forest-spirit-zone">

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

    const today = new Date();

    const todayNumbers =
        save.discoveryHistory
            .filter(item => {

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
    today.getDate()                );

            })
            .map(
                item => Number(item?.no)
            )
            .filter(
                number =>
                    Number.isFinite(number)
            );

    return new Set(
        todayNumbers
    ).size;
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