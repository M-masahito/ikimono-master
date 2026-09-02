// =====================================
// screens/home.js Ver7
// 精霊と過ごす庭
// =====================================

import {
    getSave,
    update
} from "../system/storage.js";

import {
    getSpiritEvolutionStage
} from "../system/spiritEvolution.js";
import {
    playSpiriaEvolution
} from "./spirit.js";

import {
    openScreen
} from "../app.js";
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

const evolutionAttribute =
    equippedSpiriaId === "base"
        ? "all"
        : (
            equippedSpiriaData
                ?.attribute ??
            equippedSpiriaId
        );

const automaticEvolution =
    getSpiritEvolutionStage(
        save,
        evolutionAttribute
    );

const homeEvolutionStage =
    testMode
        ? equippedStageNumber
        : Number(
            automaticEvolution.stage
        );

const imageStageNumber =
    testMode
        ? equippedStageNumber
        : Math.max(
            1,
            Math.min(
                homeEvolutionStage - 1,
                3
            )
        );

const equippedStageData =
    equippedSpiriaData
        ?.stages
        ?.find(
            stage =>
                Number(stage.stage) ===
                imageStageNumber
        ) ??
    equippedSpiriaData
        ?.stages?.[0];

const homeSpiriaImage =
    !testMode &&
    homeEvolutionStage === 0

        ? "./assets/spiria/spiria_egg.png"

        : !testMode &&
          homeEvolutionStage === 1

            ? "./assets/spiria/spiria_base.png"

            : (
                equippedStageData?.image ??
                "./assets/spiria/spiria_base.png"
              );
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
    data-stage="${imageStageNumber}"
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
    // 通常モードの初回進化ムービー
    // =================================

    const movieEvolutionStage =
        Math.min(
            homeEvolutionStage,
            4
        );

    const savedEvolutionStage =
        Number(
            save.spirit
                ?.evolutionProgress
                ?.[evolutionAttribute] ??
            0
        );

    if (
        !testMode &&
        movieEvolutionStage >
            savedEvolutionStage
    ) {

        const previousEvolutionStage =
            Math.max(
                movieEvolutionStage - 1,
                0
            );

        const previousImageStage =
            Math.max(
                1,
                Math.min(
                    previousEvolutionStage - 1,
                    3
                )
            );

        const previousStageData =
            equippedSpiriaData
                ?.stages
                ?.find(
                    stage =>
                        Number(
                            stage.stage
                        ) ===
                        previousImageStage
                );

        const previousImage =
            previousEvolutionStage === 0

                ? "./assets/spiria/spiria_egg.png"

                : previousEvolutionStage === 1

                    ? "./assets/spiria/spiria_base.png"

                    : (
                        previousStageData?.image ??
                        "./assets/spiria/spiria_base.png"
                      );

        playSpiriaEvolution({

            fromImage:
                previousImage,

            toImage:
                homeSpiriaImage,

            spiriaName:
                automaticEvolution.name ??
                homeSpiriaName,

            onComplete: () => {

                update(currentSave => {

                    currentSave.spirit ??= {};

                    currentSave.spirit
                        .evolutionProgress ??= {};

                    currentSave.spirit
                        .evolutionProgress[
                            evolutionAttribute
                        ] =
                            movieEvolutionStage;
                });
            }
        });
    }

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