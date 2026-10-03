// =======================================
// いきものマスター Ver2
// app.js
// =======================================

import { loadMaster } from "./master/loadMaster.js";
import { getSave } from "./system/storage.js";
import { showSettings } from "./screens/settings.js";
import { showHome } from "./screens/home.js";
import { showCamera } from "./screens/camera.js";
import { showCatalog } from "./screens/catalog.js";
import { showSpirit } from "./screens/spirit.js";

import { showOpening } from "./screens/opening.js";
import { showInstallGuide } from "./screens/installGuide.js";

const screen = document.getElementById("screen");

const screens = {
    home: showHome,
    camera: showCamera,
    catalog: showCatalog,
    spirit: showSpirit,
    settings: showSettings
};

startApp();

// =======================================
// アプリ起動
// =======================================

async function startApp() {

    try {

        await loadMaster();

        getSave();

        createNavigation();

        openScreen("home");

                await showInstallGuide();

        await showOpening();

    } catch (error) {

        console.error(
            "アプリの起動に失敗しました",
            error
        );

        screen.innerHTML = `
            <div class="card">
                <h2>読み込みエラー</h2>
                <p>
                    ゲームデータを読み込めませんでした。
                </p>
                <p>
                    ${escapeHtml(
                        error?.message ??
                        "不明なエラー"
                    )}
                </p>
            </div>
        `;

    }

}

// =======================================
// 下メニュー
// =======================================

function createNavigation() {

    const buttons =
        document.querySelectorAll(
            "#bottomNav button"
        );

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const screenName =
                    button.dataset.screen;

                if (screenName) {

                    openScreen(screenName);

                }

            }
        );

    });

}
// =======================================
// 下メニュー 精霊アイコン更新
// =======================================

function updateSpiritNavIcon() {

    const icon =
        document.getElementById(
            "navSpiritIcon"
        );

    if (!icon) {
        return;
    }

    const save = getSave();

    const spiriaMaster =
        Array.isArray(window.MASTER?.spiria)
            ? window.MASTER.spiria
            : [];

    const equippedSpiriaId =
        save.spirit?.equippedSpiria ??
        "base";

    const spiriaData =
        spiriaMaster.find(
            item =>
                item.id === equippedSpiriaId
        );

    // まず発見0なら必ず卵
    const discoveredCount =
        Array.isArray(save.discovered)
            ? save.discovered.length
            : 0;

    if (discoveredCount === 0) {

        icon.src =
            "./assets/spiria/spiria_egg.png";

        return;
    }

    // タイプ別スピリア
    if (equippedSpiriaId !== "base") {

        const stageNumber =
            Number(save.spirit?.stage) || 1;

        const stageData =
            spiriaData?.stages?.find(
                stage =>
                    Number(stage.stage) ===
                    stageNumber
            );

        icon.src =
            stageData?.image ??
            "./assets/spiria/spiria_base.png";

        return;
    }

    // ベース精霊
    icon.src =
        "./assets/spiria/spiria_base.png";
}
// =======================================
// 画面切り替え
// =======================================

export function openScreen(name) {

    updateDiscoverCount();
            updateSpiritNavIcon();

    document

        .querySelectorAll(
            "#bottomNav button"
        )
        .forEach(button => {

            button.classList.remove(
                "active"
            );

        });

    document
        .querySelector(
            `[data-screen="${name}"]`
        )
        ?.classList.add("active");

    screen.innerHTML = "";

    const showScreen =
        screens[name];

    if (typeof showScreen === "function") {

        showScreen(screen);


        return;

    }
    screen.innerHTML = `
        <div class="card">
            <h2>準備中</h2>
            <p>
                ${escapeHtml(name)}
                はまだ作成中です。
            </p>
        </div>
    `;

}

// =======================================
// ヘッダーの発見数を更新
// =======================================

function updateDiscoverCount() {

    const save = getSave();

    const numbers = [];

    if (Array.isArray(save?.discovered)) {
        numbers.push(...save.discovered);
    }

    if (Array.isArray(save?.discoveredCards)) {
        numbers.push(
            ...save.discoveredCards.map(
                card => card?.no
            )
        );
    }

    const discoveredCount = [
        ...new Set(
            numbers
                .map(Number)
                .filter(Number.isFinite)
        )
    ].length;

    const discoverCountElement =
        document.getElementById(
            "discoverCount"
        );

    if (discoverCountElement) {
        discoverCountElement.textContent =
            `発見 ${discoveredCount}`;
    }

}

// =======================================
// HTMLエスケープ
// =======================================

function escapeHtml(text) {

    return String(text ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

}