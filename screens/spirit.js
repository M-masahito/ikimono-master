// =====================================
// screens/spirit.js Ver12
// 入手済み精霊の選択画面
// =====================================

import {
    getSave,
    update
} from "../system/storage.js";

export function showSpirit(screen) {

    const save = getSave();

    const spiriaMaster =
        Array.isArray(window.MASTER?.spiria)
            ? window.MASTER.spiria
            : [];

const savedEquippedId =
    save.spirit?.equippedSpiria ??
    "base";

const testUnlocked =
    sessionStorage.getItem(
        "spiriaTestUnlocked"
    ) === "true";

const testMode =
    testUnlocked &&
    sessionStorage.getItem(
        "spiriaTestMode"
    ) === "true";

const equippedId =
    testMode

        ? sessionStorage.getItem(
            "spiriaTestEquipped"
        ) ??
        savedEquippedId

        : savedEquippedId;    // 入手済みスピリアのID
    // ベース精霊は最初から使用可能
    const ownedSpiriaIds =
        new Set([
            "base",

            ...(Array.isArray(save.spiria)
                ? save.spiria
                    .map(item => {

                        if (
                            typeof item ===
                            "string"
                        ) {
                            return item;
                        }

                        return (
                            item?.id ??
                            item?.spiriaId
                        );
                    })
                    .filter(Boolean)
                : [])
        ]);

    // 未入手のスピリアは表示しない
const availableSpiria =
    testMode

        ? spiriaMaster

        : spiriaMaster.filter(
            spiria =>
                ownedSpiriaIds.has(
                    spiria.id
                )
        );

        const currentSpiria =
    spiriaMaster.find(
        spiria =>
            spiria.id === equippedId
    ) ??
    spiriaMaster.find(
        spiria =>
            spiria.id === "base"
    );

const currentStageNumber =
    testMode

        ? Number(
            sessionStorage.getItem(
                "spiriaTestStage"
            )
        ) || 1

        : Number(
            save.spirit?.stage
        ) || 1;
const currentStage =
    currentSpiria?.stages?.find(
        stage =>
            Number(stage.stage) ===
            currentStageNumber
    ) ??
    currentSpiria?.stages?.[0];

const currentSpiriaImage =
    currentStage?.image ??
    "./assets/spiria/spiria_base.png";

const currentSpiriaName =
    currentSpiria?.name ??
    "ふしぎなスピリア";
    screen.innerHTML = `

        <section class="spiria-screen">

            <div class="spiria-screen-header">

                <span>精霊の庭</span>

                <h2>
                    一緒に過ごす精霊を選ぼう
                </h2>

${
    testUnlocked
        ? `
            <button
                id="spiriaTestModeButton"
                class="spiria-test-mode-button ${
                    testMode
                        ? "active"
                        : ""
                }"
                type="button"
            >
                ${
                    testMode
                        ? "テストモード ON"
                        : "テストモード OFF"
                }
            </button>
          `
        : ""
}
            </div>
<div class="current-spiria-panel">

    <span class="current-spiria-label">
        現在一緒にいる精霊
    </span>

    <img
        class="current-spiria-image"
        src="${escapeHtml(
            currentSpiriaImage
        )}"
        alt="${escapeHtml(
            currentSpiriaName
        )}"
    >

    <strong class="current-spiria-name">
        ${escapeHtml(
            currentSpiriaName
        )}
    </strong>
${
    testMode
        ? `
            <div class="spiria-stage-buttons">

                ${
                    (currentSpiria?.stages ?? [])
                        .map(stage => `

                            <button
                                type="button"
                                class="spiria-stage-button ${
                                    Number(stage.stage) ===
                                    currentStageNumber
                                        ? "active"
                                        : ""
                                }"
                                data-stage="${Number(
                                    stage.stage
                                )}"
                            >
                                Stage${Number(
                                    stage.stage
                                )}
                            </button>

                        `)
                        .join("")
                }

            </div>
          `
        : ""
}
</div>
            <div class="spiria-select-list">

                ${availableSpiria.map(spiria => {

                    const stages =
                        Array.isArray(spiria.stages)
                            ? spiria.stages
                            : [];

                    const firstStage =
                        stages.find(
                            stage =>
                                Number(
                                    stage.stage
                                ) === 1
                        ) ??
                        stages[0];

                    if (!firstStage) {
                        return "";
                    }

                    const selected =
                        equippedId ===
                        spiria.id;

                    return `

                        <button
                            type="button"
                            class="spiria-select-card ${
                                selected
                                    ? "selected"
                                    : ""
                            }"
                            data-spiria-id="${escapeHtml(
                                spiria.id
                            )}"
                        >

                            <img
                                src="${escapeHtml(
                                    firstStage.image
                                )}"
                                alt="${escapeHtml(
                                    spiria.name ??
                                    spiria.id
                                )}"
                            >

                            <strong>
                                ${escapeHtml(
                                    spiria.name ??
                                    spiria.id
                                )}
                            </strong>

                            <small>
                                ${escapeHtml(
                                    spiria.attribute ??
                                    ""
                                )}
                            </small>

                            ${
                                selected
                                    ? `
                                        <span
                                            class="spiria-selected-label"
                                        >
                                            選択中
                                        </span>
                                      `
                                    : ""
                            }

                        </button>
                    `;

                }).join("")}

            </div>

        </section>
    `;
screen
    .querySelector(
        "#spiriaTestModeButton"
    )
    ?.addEventListener(
        "click",
        () => {

            sessionStorage.setItem(
                "spiriaTestMode",
                String(!testMode)
            );

            showSpirit(screen);
        }
    );
    screen
    .querySelectorAll(
        ".spiria-stage-button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const stage =
                    Number(
                        button.dataset.stage
                    );

                if (
                    !Number.isFinite(stage)
                ) {
                    return;
                }

const targetStage =
    currentSpiria?.stages?.find(
        item =>
            Number(item.stage) ===
            stage
    );

if (!targetStage?.image) {
    return;
}

playSpiriaEvolution({

    fromImage:
        currentSpiriaImage,

    toImage:
        targetStage.image,

    spiriaName:
        currentSpiriaName,

    onComplete: () => {

        sessionStorage.setItem(
            "spiriaTestStage",
            String(stage)
        );

        showSpirit(screen);
    }
});            }
        );
    });
    screen
        .querySelectorAll(
            ".spiria-select-card"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const spiriaId =
                        button.dataset.spiriaId;

                    if (!spiriaId) {
                        return;
                    }

if (testMode) {

    sessionStorage.setItem(
        "spiriaTestEquipped",
        spiriaId
    );

    sessionStorage.setItem(
        "spiriaTestStage",
        "1"
    );

} else {

    update(currentSave => {

        currentSave.spirit ??= {};

        currentSave.spirit
            .equippedSpiria =
                spiriaId;

        currentSave.spirit
            .stage = 1;
    });
}

showSpirit(screen);                }
            );
        });
}

// =====================================
// 進化ムービー
// =====================================

function playSpiriaEvolution({
    fromImage,
    toImage,
    spiriaName,
    onComplete
}) {

    const movie =
        document.createElement("div");

    movie.className =
        "spiria-evolution-movie";

    movie.innerHTML = `

        <div class="evolution-space">

            <div class="evolution-stars">
                <span>✦</span>
                <span>✧</span>
                <span>✦</span>
                <span>✧</span>
                <span>✦</span>
                <span>✧</span>
            </div>

            <div class="evolution-title">
                EVOLUTION
            </div>

            <div class="evolution-magic-circle">
                <div></div>
                <div></div>
            </div>

            <div class="evolution-creature">

                <img
                    class="evolution-before"
                    src="${escapeHtml(
                        fromImage
                    )}"
                    alt=""
                >

                <img
                    class="evolution-after"
                    src="${escapeHtml(
                        toImage
                    )}"
                    alt="${escapeHtml(
                        spiriaName
                    )}"
                >

            </div>

            <div class="evolution-flash"></div>

            <div class="evolution-result">

                <strong>進化！</strong>

                <span>
                    ${escapeHtml(
                        spiriaName
                    )}
                </span>

            </div>

        </div>
    `;

    document.body.appendChild(movie);

    requestAnimationFrame(
        () => {
            movie.classList.add("play");
        }
    );

    window.setTimeout(
        () => {

            if (
                typeof onComplete ===
                "function"
            ) {
                onComplete();
            }

        },
        4700
    );

    window.setTimeout(
        () => {

            movie.classList.add("finish");

        },
        6500
    );

    window.setTimeout(
        () => {

            movie.remove();

        },
        7000
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