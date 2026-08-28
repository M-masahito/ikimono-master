// =====================================
// screens/home.js Ver7
// 精霊と過ごす庭
// =====================================

import { getSave } from "../system/storage.js";
import { openScreen } from "../app.js";


// =====================================
// ホーム画面
// =====================================

export function showHome(screen) {

    const save = getSave();

const testMode =
    sessionStorage.getItem(
        "spiriaTestUnlocked"
    ) === "true" &&
    sessionStorage.getItem(
        "spiriaTestMode"
    ) === "true";

const equippedSpiriaId =
    testMode

        ? sessionStorage.getItem(
            "spiriaTestEquipped"
        ) ??
        save.spirit?.equippedSpiria ??
        "base"

        : save.spirit?.equippedSpiria ??
        "base";

const equippedStageNumber =
    testMode

        ? Number(
            sessionStorage.getItem(
                "spiriaTestStage"
            )
        ) || 1

        : Number(
            save.spirit?.stage
        ) || 1;
    const spiriaMaster =
        Array.isArray(
            window.MASTER?.spiria
        )
            ? window.MASTER.spiria
            : [];

    const equippedSpiriaData =
        spiriaMaster.find(
            item =>
                item.id ===
                equippedSpiriaId
        );

    const equippedStageData =
        equippedSpiriaData?.stages?.find(
            stage =>
                Number(stage.stage) ===
                equippedStageNumber
        ) ??
        equippedSpiriaData?.stages?.[0];

    const homeSpiriaImage =
        equippedStageData?.image ??
        "./assets/spiria/spiria_base.png";

    const homeSpiriaName =
        equippedSpiriaData?.name ??
        "ふしぎなスピリア";


    screen.innerHTML = `

        <section
            class="forest-home forest-garden-home"
        >

            <button
                id="settingsButton"
                class="forest-settings-button"
                type="button"
                aria-label="設定"
            >
                <span>⚙️</span>
            </button>

            <div
                class="forest-world forest-garden-world"
            >

                <div
                    class="forest-sunlight"
                ></div>

                <div
                    class="forest-spirit-zone"
                >

<div
    class="forest-spirit"
    data-stage="${equippedStageNumber}"
>                        <img
                            class="forest-spirit-character forest-spirit-image"
                            src="${escapeHtml(
                                homeSpiriaImage
                            )}"
                            alt="${escapeHtml(
                                homeSpiriaName
                            )}"
                        >

                    </div>

                </div>

            </div>

        </section>
    `;


    // =================================
    // 設定ボタン
    // 5回連続でテストモード解除
    // =================================

    const settingsButton =
        screen.querySelector(
            "#settingsButton"
        );

    settingsButton
        ?.addEventListener(
            "click",
            () => {

                const tapCount =
                    Number(
                        settingsButton
                            .dataset
                            .testTapCount ?? 0
                    ) + 1;

                settingsButton
                    .dataset
                    .testTapCount =
                        String(tapCount);

                clearTimeout(
                    settingsButton
                        .testTapTimer
                );

                if (tapCount >= 5) {

                    settingsButton
                        .dataset
                        .testTapCount =
                            "0";

                    sessionStorage.setItem(
                        "spiriaTestUnlocked",
                        "true"
                    );

                    sessionStorage.setItem(
                        "spiriaTestMode",
                        "true"
                    );

                    alert(
                        "スピリアのテストモードを解除しました"
                    );

                    openScreen("spirit");

                    return;
                }

                settingsButton.testTapTimer =
                    setTimeout(
                        () => {

                            settingsButton
                                .dataset
                                .testTapCount =
                                    "0";

                            openScreen(
                                "settings"
                            );
                        },
                        900
                    );
            }
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