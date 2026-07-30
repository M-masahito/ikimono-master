// =====================================
// screens/camera.js Ver4
// 仲間をさがす画面
// PART1
// =====================================

import {
    getSave,
    update,
    syncDiscoveredNumbers
} from "../system/storage.js";
// 図鑑に保存できるカードの最大表示枚数
const MAX_CARD_COUNT = 10;

// AIが表示する候補数
const CANDIDATE_LIMIT = 3;

// 選択中の写真を管理する
let selectedImageFile = null;
let selectedImageUrl = "";

// =====================================
// 仲間をさがす画面
// =====================================

export function showCamera(screen) {

    // 前回選択した写真を解除
    resetSelectedImage();

    screen.innerHTML = `
        <section class="camera-page">

            <header class="camera-header">

                <div class="camera-header-icon">
                    🌿
                </div>

                <div>
                    <h2>仲間をさがす</h2>
                    <p>
                        生き物の写真を見せると、精霊が仲間を探してくれるよ！
                    </p>
                </div>

            </header>

            <div class="camera-card">

                <div class="camera-select-title">

                    <span class="camera-select-spirit">
                        🥚
                    </span>

                    <div>
                        <strong>写真を見せてね！</strong>
                        <small>
                            今から撮るか、写真の中から選べるよ
                        </small>
                    </div>

                </div>

                <div class="photo-source-buttons">

                    <button
                        id="takePhotoButton"
                        class="photo-source-button take-photo-button"
                        type="button"
                    >
                        <span class="photo-source-icon">
                            📷
                        </span>

                        <span>
                            <strong>写真を撮る</strong>
                            <small>カメラをひらく</small>
                        </span>
                    </button>

                    <button
                        id="choosePhotoButton"
                        class="photo-source-button choose-photo-button"
                        type="button"
                    >
                        <span class="photo-source-icon">
                            🖼️
                        </span>

                        <span>
                            <strong>写真を選ぶ</strong>
                            <small>アルバムから選ぶ</small>
                        </span>
                    </button>

                </div>

                <!-- カメラ撮影用 -->
                <input
                    id="cameraInput"
                    class="photo-input"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    hidden
                >

                <!-- 写真選択用 -->
                <input
                    id="galleryInput"
                    class="photo-input"
                    type="file"
                    accept="image/*"
                    hidden
                >

                <div
                    id="previewArea"
                    class="preview-area preview-empty"
                >
                    <div class="preview-placeholder">

                        <span class="preview-placeholder-icon">
                            🐞
                        </span>

                        <strong>
                            ここに写真が表示されるよ
                        </strong>

                        <small>
                            生き物が大きく写った写真がおすすめ！
                        </small>

                    </div>
                </div>

                <div
                    id="photoInfo"
                    class="photo-info"
                    hidden
                >
                    <span>✅</span>
                    <p>写真の準備ができたよ！</p>
                </div>

                <button
                    id="searchFriendButton"
                    class="mainButton search-friend-button"
                    type="button"
                    disabled
                >
                    <span>✨</span>
                    この写真で仲間をさがす
                </button>

                <button
                    id="clearPhotoButton"
                    class="subButton clear-photo-button"
                    type="button"
                    hidden
                >
                    写真を選び直す
                </button>

            </div>

            <div
                id="judgeResult"
                class="judge-result"
                aria-live="polite"
            >
                <div class="spirit-judge-message">
                    🥚「どんな仲間に会えるかな？」
                </div>
            </div>

        </section>
    `;

    // -----------------------------
    // 画面内の要素
    // -----------------------------

    const takePhotoButton =
        screen.querySelector("#takePhotoButton");

    const choosePhotoButton =
        screen.querySelector("#choosePhotoButton");

    const cameraInput =
        screen.querySelector("#cameraInput");

    const galleryInput =
        screen.querySelector("#galleryInput");

    const previewArea =
        screen.querySelector("#previewArea");

    const photoInfo =
        screen.querySelector("#photoInfo");

    const searchFriendButton =
        screen.querySelector("#searchFriendButton");

    const clearPhotoButton =
        screen.querySelector("#clearPhotoButton");

    const judgeResult =
        screen.querySelector("#judgeResult");

    // -----------------------------
    // カメラを開く
    // -----------------------------

    takePhotoButton?.addEventListener("click", () => {

        cameraInput?.click();

    });

    // -----------------------------
    // 写真一覧を開く
    // -----------------------------

    choosePhotoButton?.addEventListener("click", () => {

        galleryInput?.click();

    });

    // -----------------------------
    // カメラで撮った写真
    // -----------------------------

    cameraInput?.addEventListener("change", event => {

        const file =
            event.target.files?.[0] ?? null;

        handleSelectedImage({
            file,
            previewArea,
            photoInfo,
            searchFriendButton,
            clearPhotoButton,
            judgeResult
        });

    });

    // -----------------------------
    // アルバムから選んだ写真
    // -----------------------------

    galleryInput?.addEventListener("change", event => {

        const file =
            event.target.files?.[0] ?? null;

        handleSelectedImage({
            file,
            previewArea,
            photoInfo,
            searchFriendButton,
            clearPhotoButton,
            judgeResult
        });

    });

    // -----------------------------
    // 写真を選び直す
    // -----------------------------

    clearPhotoButton?.addEventListener("click", () => {

        resetCameraScreen({
            cameraInput,
            galleryInput,
            previewArea,
            photoInfo,
            searchFriendButton,
            clearPhotoButton,
            judgeResult
        });

    });

    // -----------------------------
    // 仲間をさがす
    // -----------------------------

    searchFriendButton?.addEventListener("click", async () => {

        if (!selectedImageFile) {
            return;
        }

        await startFriendSearch({
            screen,
            judgeResult,
            searchFriendButton,
            clearPhotoButton
        });

    });

}
// =====================================
// PART2
// 写真選択・プレビュー
// =====================================

function handleSelectedImage({

    file,
    previewArea,
    photoInfo,
    searchFriendButton,
    clearPhotoButton,
    judgeResult

}){

    if(!file){
        return;
    }

    selectedImageFile = file;

    const reader = new FileReader();

    reader.onload = () => {

        selectedImageUrl = reader.result;

        previewArea.classList.remove("preview-empty");

        previewArea.innerHTML = `

            <div class="preview-image-area">

                <img
                    src="${selectedImageUrl}"
                    class="cameraPreview"
                    alt="選択した写真"
                >

            </div>

        `;

        photoInfo.hidden = false;

        clearPhotoButton.hidden = false;

        searchFriendButton.disabled = false;

        judgeResult.innerHTML = `

            <div class="spirit-judge-message">

                🥚「写真ありがとう！

                仲間を探してみるね！」

            </div>

        `;

    };

    reader.readAsDataURL(file);

}

// =====================================
// 初期状態へ戻す
// =====================================

function resetCameraScreen({

    cameraInput,
    galleryInput,
    previewArea,
    photoInfo,
    searchFriendButton,
    clearPhotoButton,
    judgeResult

}){

    resetSelectedImage();

    cameraInput.value = "";

    galleryInput.value = "";

    previewArea.classList.add("preview-empty");

    previewArea.innerHTML = `

        <div class="preview-placeholder">

            <span class="preview-placeholder-icon">

                🐞

            </span>

            <strong>

                ここに写真が表示されるよ

            </strong>

            <small>

                生き物が大きく写った写真がおすすめ！

            </small>

        </div>

    `;

    photoInfo.hidden = true;

    clearPhotoButton.hidden = true;

    searchFriendButton.disabled = true;

    judgeResult.innerHTML = `

        <div class="spirit-judge-message">

            🥚「どんな仲間に会えるかな？」

        </div>

    `;

}

// =====================================
// 選択解除
// =====================================

function resetSelectedImage(){

    selectedImageFile = null;

    selectedImageUrl = "";

}
// =====================================
// PART3
// 精霊が仲間をさがす演出
// =====================================

async function startFriendSearch({

    screen,
    judgeResult,
    searchFriendButton,
    clearPhotoButton

}) {

    if (!selectedImageFile) {
        return;
    }

    searchFriendButton.disabled = true;
    clearPhotoButton.hidden = true;

    const loadingMessages = [

        "写真をじっくり見ているよ…",

        "色や形を調べているよ…",

        "羽や足の形を見ているよ…",

        "図鑑の仲間と比べているよ…",

        "もう少しで分かりそう！"

    ];

    judgeResult.innerHTML = `

        <div class="friend-search-loading">

            <div class="search-magic-area">

                <span class="search-sparkle sparkle-one">
                    ✨
                </span>

                <span class="search-sparkle sparkle-two">
                    ✨
                </span>

                <span class="search-sparkle sparkle-three">
                    ✨
                </span>

                <div class="search-spirit">
                    🥚
                </div>

            </div>

            <h3>
                精霊が仲間をさがしています…
            </h3>

            <p id="searchLoadingMessage">
                ${loadingMessages[0]}
            </p>

            <div
                class="analysis-loader"
                aria-hidden="true"
            ></div>

            <div class="search-progress-track">

                <div
                    id="searchProgressBar"
                    class="search-progress-bar"
                ></div>

            </div>

            <small>
                写真を閉じずに待ってね
            </small>

        </div>
    `;

    const messageElement =
        judgeResult.querySelector("#searchLoadingMessage");

    const progressBar =
        judgeResult.querySelector("#searchProgressBar");

    let messageIndex = 0;
    let progress = 8;

    const messageTimer = window.setInterval(() => {

        messageIndex =
            (messageIndex + 1) % loadingMessages.length;

        if (messageElement) {

            messageElement.textContent =
                loadingMessages[messageIndex];

        }

    }, 650);

    const progressTimer = window.setInterval(() => {

        progress += Math.floor(Math.random() * 12) + 4;

        if (progress > 92) {
            progress = 92;
        }

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

    }, 300);

    try {

        const candidates =
            await judgeImage(selectedImageFile);

        window.clearInterval(messageTimer);
        window.clearInterval(progressTimer);

        if (progressBar) {
            progressBar.style.width = "100%";
        }

        await wait(350);

        showCandidates({
            candidates,
            judgeResult,
            screen
        });

    } catch (error) {

        window.clearInterval(messageTimer);
        window.clearInterval(progressTimer);

        console.error(
            "仲間を探している途中でエラーが発生しました。",
            error
        );

        showSearchError({
            judgeResult,
            searchFriendButton,
            clearPhotoButton
        });

    }

}


// =====================================
// 判定失敗時の表示
// =====================================

function showSearchError({

    judgeResult,
    searchFriendButton,
    clearPhotoButton

}) {

    judgeResult.innerHTML = `

        <div class="search-error-box">

            <div class="search-error-spirit">
                🥚
            </div>

            <h3>
                うまく見つけられなかったよ
            </h3>

            <p>
                生き物が大きく写った写真で、
                もう一度試してみてね。
            </p>

            <button
                id="retrySearchButton"
                class="mainButton"
                type="button"
            >
                もう一度さがす
            </button>

        </div>
    `;

    searchFriendButton.disabled = false;
    clearPhotoButton.hidden = false;

    judgeResult
        .querySelector("#retrySearchButton")
        ?.addEventListener("click", () => {

            searchFriendButton.click();

        });

}


// =====================================
// 指定時間待つ
// =====================================

function wait(milliseconds) {

    return new Promise(resolve => {

        window.setTimeout(
            resolve,
            milliseconds
        );

    });

}
// =====================================
// PART4
// 仮AI判定
// 必ず候補を3件返す
// =====================================

async function judgeImage(file) {

    if (!file) {
        throw new Error("写真が選ばれていません。");
    }

    // 今は仮判定。
    // 後で本物のAI判定APIへ置き換える。
    await wait(1800);

    const mockCandidates = [

        {
            no: 1,
            name: "カブトムシ",
            rarity: "B",
            category: "昆虫",
            type: "甲虫",
            typeIcon: "🪲",
            categoryIcon: "🐞",
            illustration: "🪲",
            confidence: 87
        },

        {
            no: 2,
            name: "コカブト",
            rarity: "A",
            category: "昆虫",
            type: "甲虫",
            typeIcon: "🪲",
            categoryIcon: "🐞",
            illustration: "🪲",
            confidence: 9
        },

        {
            no: 3,
            name: "ノコギリクワガタ",
            rarity: "B",
            category: "昆虫",
            type: "甲虫",
            typeIcon: "🪲",
            categoryIcon: "🐞",
            illustration: "🪲",
            confidence: 4
        }

    ];

    return normalizeCandidates(
        mockCandidates
    );

}


// =====================================
// 候補データを整える
// =====================================

function normalizeCandidates(candidates) {

    if (!Array.isArray(candidates)) {
        throw new Error(
            "候補データの形式が正しくありません。"
        );
    }

    const normalized = candidates

        .filter(candidate => {

            return (
                candidate &&
                Number.isFinite(Number(candidate.no)) &&
                typeof candidate.name === "string"
            );

        })

        .map(candidate => {

            return {

                no:
                    Number(candidate.no),

                name:
                    candidate.name.trim(),

                rarity:
                    normalizeRarity(
                        candidate.rarity
                    ),

                category:
                    candidate.category?.trim() ||
                    "その他",

                type:
                    candidate.type?.trim() ||
                    "未分類",

                typeIcon:
                    candidate.typeIcon ||
                    "🔹",

                categoryIcon:
                    candidate.categoryIcon ||
                    "🌿",

                illustration:
                    candidate.illustration ||
                    "❓",

                confidence:
                    normalizeConfidence(
                        candidate.confidence
                    )

            };

        })

        .sort((a, b) => {

            return (
                b.confidence -
                a.confidence
            );

        })

        .slice(
            0,
            CANDIDATE_LIMIT
        );

    if (normalized.length === 0) {

        throw new Error(
            "表示できる候補がありません。"
        );

    }

    return normalized;

}


// =====================================
// 一致率を0〜100へ整える
// =====================================

function normalizeConfidence(value) {

    const number =
        Number(value);

    if (!Number.isFinite(number)) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(
            0,
            Math.round(number)
        )
    );

}


// =====================================
// レア度を整える
// =====================================

function normalizeRarity(value) {

    const rarity =
        String(value ?? "C")
            .trim()
            .toUpperCase();

    const allowed =
        ["S", "A", "B", "C"];

    if (
        allowed.includes(rarity)
    ) {
        return rarity;
    }

    return "C";

}


// =====================================
// レア度表示用
// =====================================

function getRarityLabel(rarity) {

    const labels = {

        S: "S レア",

        A: "A レア",

        B: "B レア",

        C: "C レア"

    };

    return (
        labels[rarity] ??
        labels.C
    );

}


// =====================================
// レア度CSSクラス
// =====================================

function getRarityClass(rarity) {

    const classes = {

        S: "rarity-s",

        A: "rarity-a",

        B: "rarity-b",

        C: "rarity-c"

    };

    return (
        classes[rarity] ??
        classes.C
    );

}
// =====================================
// PART5
// 候補3件を表示する
// =====================================

function showCandidates({

    candidates,
    judgeResult,
    screen

}) {

    if (
        !Array.isArray(candidates) ||
        candidates.length === 0
    ) {

        throw new Error(
            "候補を表示できません。"
        );

    }

    const candidateCards =
        candidates
            .map((candidate, index) => {

                const rarityClass =
                    getRarityClass(
                        candidate.rarity
                    );

                const rarityLabel =
                    getRarityLabel(
                        candidate.rarity
                    );

                return `

                    <button
                        class="candidate-card ${rarityClass}"
                        type="button"
                        data-candidate-index="${index}"
                    >

                        <div class="candidate-card-top">

                            <span class="candidate-number">
                                No.${String(candidate.no).padStart(3, "0")}
                            </span>

                            <span class="candidate-rarity">
                                ${rarityLabel}
                            </span>

                        </div>

                        <div class="candidate-illustration-area">

                            <span class="candidate-illustration">
                                ${escapeHtml(candidate.illustration)}
                            </span>

                        </div>

                        <div class="candidate-name-area">

                            <h3>
                                ${escapeHtml(candidate.name)}
                            </h3>

                            <div class="candidate-tags">

                                <span class="candidate-category">
                                    ${escapeHtml(candidate.categoryIcon)}
                                    ${escapeHtml(candidate.category)}
                                </span>

                                <span class="candidate-type">
                                    ${escapeHtml(candidate.typeIcon)}
                                    ${escapeHtml(candidate.type)}
                                </span>

                            </div>

                        </div>

                        <div class="candidate-confidence-area">

                            <div class="candidate-confidence-label">

                                <span>
                                    にている度
                                </span>

                                <strong>
                                    ${candidate.confidence}%
                                </strong>

                            </div>

                            <div class="candidate-confidence-track">

                                <div
                                    class="candidate-confidence-bar"
                                    style="width: ${candidate.confidence}%"
                                ></div>

                            </div>

                        </div>

                        <span class="candidate-select-label">
                            この仲間をえらぶ
                        </span>

                    </button>

                `;

            })
            .join("");

    judgeResult.innerHTML = `

        <section class="candidate-result-section">

            <div class="candidate-result-header">

                <div class="candidate-result-spirit">
                    🥚
                </div>

                <div>

                    <h2>
                        この仲間かな？
                    </h2>

                    <p>
                        写真に一番近い仲間を選んでね！
                    </p>

                </div>

            </div>

            <div class="candidate-list">
                ${candidateCards}
            </div>

            <div class="candidate-help">

                <p>
                    見つからないときは、
                    写真を選び直してね。
                </p>

                <button
                    id="candidateBackButton"
                    class="subButton"
                    type="button"
                >
                    写真を選び直す
                </button>

            </div>

        </section>
    `;

    const candidateButtons =
        judgeResult.querySelectorAll(
            ".candidate-card"
        );

    candidateButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const candidateIndex =
                    Number(
                        button.dataset
                            .candidateIndex
                    );

                const selectedCandidate =
                    candidates[
                        candidateIndex
                    ];

                if (!selectedCandidate) {
                    return;
                }

                selectCandidate({

                    candidate:
                        selectedCandidate,

                    button,

                    candidateButtons,

                    judgeResult,

                    screen

                });

            }
        );

    });

    judgeResult
        .querySelector(
            "#candidateBackButton"
        )
        ?.addEventListener(
            "click",
            () => {

                showCamera(screen);

            }
        );

}


// =====================================
// 候補を選択したときの処理
// =====================================

function selectCandidate({

    candidate,
    button,
    candidateButtons,
    judgeResult,
    screen

}) {

    candidateButtons.forEach(
        candidateButton => {

            candidateButton.disabled = true;

            candidateButton.classList.remove(
                "candidate-selected"
            );

        }
    );

    button.classList.add(
        "candidate-selected"
    );

    button.innerHTML += `

        <div class="candidate-selected-mark">
            ✅ これに決めた！
        </div>
    `;

    window.setTimeout(
        () => {

            startCardGetAnimation({

                candidate,
                judgeResult,
                screen

            });

        },
        450
    );

}


// =====================================
// HTMLへ安全に文字を表示する
// =====================================

function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}
// =====================================
// PART6
// 写真 → イラスト → カードGET演出
// =====================================

async function startCardGetAnimation({

    candidate,
    judgeResult,
    screen

}) {

    judgeResult.innerHTML = `

        <section class="card-get-scene">

            <div class="card-get-background-effect">

                <span class="get-sparkle get-sparkle-one">
                    ✨
                </span>

                <span class="get-sparkle get-sparkle-two">
                    ✨
                </span>

                <span class="get-sparkle get-sparkle-three">
                    ✨
                </span>

                <span class="get-sparkle get-sparkle-four">
                    ✨
                </span>

                <span class="get-sparkle get-sparkle-five">
                    ✨
                </span>

            </div>

            <div class="card-get-title">
                仲間が見つかった！
            </div>

            <div
                id="discoveryTransformArea"
                class="discovery-transform-area"
            >

                <div
                    id="discoveryPhoto"
                    class="discovery-photo"
                >

                    <img
                        src="${selectedImageUrl}"
                        alt="見つけた生き物の写真"
                    >

                </div>

                <div
                    id="discoveryMagic"
                    class="discovery-magic"
                    hidden
                >

                    <span>✨</span>
                    <span>✨</span>
                    <span>✨</span>
                    <span>✨</span>

                </div>

                <div
                    id="discoveryIllustration"
                    class="discovery-illustration"
                    hidden
                >

                    ${escapeHtml(
                        candidate.illustration
                    )}

                </div>

                <div
                    id="discoveryCard"
                    class="discovery-card ${getRarityClass(
                        candidate.rarity
                    )}"
                    hidden
                >

                    ${createGetCardHtml(
                        candidate
                    )}

                </div>

            </div>

            <div
                id="cardGetMessage"
                class="card-get-message"
            >
                写真に不思議な力が集まっている…
            </div>

        </section>
    `;

    const photo =
        judgeResult.querySelector(
            "#discoveryPhoto"
        );

    const magic =
        judgeResult.querySelector(
            "#discoveryMagic"
        );

    const illustration =
        judgeResult.querySelector(
            "#discoveryIllustration"
        );

    const card =
        judgeResult.querySelector(
            "#discoveryCard"
        );

    const message =
        judgeResult.querySelector(
            "#cardGetMessage"
        );

    await wait(700);

    photo?.classList.add(
        "discovery-photo-glow"
    );

    magic.hidden = false;

    if (message) {
        message.textContent =
            "キラキラが写真を包みこんだ！";
    }

    await wait(900);

    photo?.classList.add(
        "discovery-photo-fade"
    );

    illustration.hidden = false;

    illustration?.classList.add(
        "discovery-illustration-appear"
    );

    if (message) {
        message.textContent =
            `${candidate.name}の姿が見えてきた！`;
    }

    await wait(900);

    illustration?.classList.add(
        "discovery-illustration-fly"
    );

    await wait(650);

    illustration.hidden = true;
    card.hidden = false;

    card?.classList.add(
        "discovery-card-spin"
    );

    if (message) {
        message.textContent =
            "仲間の力がカードになっていく！";
    }

    await wait(1200);

    card?.classList.remove(
        "discovery-card-spin"
    );

    card?.classList.add(
        "discovery-card-finish"
    );

    await wait(450);

    showCardGetResult({

        candidate,
        judgeResult,
        screen

    });

}


// =====================================
// GET演出用カードHTML
// =====================================

function createGetCardHtml(candidate) {

    return `

        <div class="get-card-inner">

            <div class="get-card-top">

                <span class="get-card-number">
                    No.${String(candidate.no).padStart(
                        3,
                        "0"
                    )}
                </span>

                <span class="get-card-rarity">
                    ${escapeHtml(
                        candidate.rarity
                    )}
                </span>

            </div>

            <div class="get-card-category-icon">

                ${escapeHtml(
                    candidate.categoryIcon
                )}

            </div>

            <div class="get-card-illustration">

                ${escapeHtml(
                    candidate.illustration
                )}

            </div>

            <h2 class="get-card-name">

                ${escapeHtml(
                    candidate.name
                )}

            </h2>

            <div class="get-card-tags">

                <span>
                    ${escapeHtml(
                        candidate.categoryIcon
                    )}

                    ${escapeHtml(
                        candidate.category
                    )}
                </span>

                <span>
                    ${escapeHtml(
                        candidate.typeIcon
                    )}

                    ${escapeHtml(
                        candidate.type
                    )}
                </span>

            </div>

        </div>
    `;

}


// =====================================
// GET完了画面
// =====================================

function showCardGetResult({

    candidate,
    judgeResult,
    screen

}) {

    judgeResult.innerHTML = `

        <section class="card-get-result">

            <div class="card-get-burst">
                ✨
            </div>

            <div class="card-get-text">
                GET!!
            </div>

            <div class="card-get-result-card ${getRarityClass(
                candidate.rarity
            )}">

                ${createGetCardHtml(
                    candidate
                )}

            </div>

            <h2 class="card-get-creature-name">

                ${escapeHtml(
                    candidate.name
                )}

            </h2>

            <p class="card-get-description">

                新しい仲間を見つけたよ！<br>
                図鑑に登録しよう！

            </p>

            <button
                id="registerCardButton"
                class="mainButton register-card-button"
                type="button"
            >

                📖 図鑑に登録する

            </button>

            <button
                id="cancelRegisterButton"
                class="subButton"
                type="button"
            >

                候補にもどる

            </button>

        </section>
    `;

    judgeResult
        .querySelector(
            "#registerCardButton"
        )
        ?.addEventListener(
            "click",
            async () => {

                await registerDiscoveredCard({

                    candidate,
                    screen,
                    judgeResult

                });

            }
        );

    judgeResult
        .querySelector(
            "#cancelRegisterButton"
        )
        ?.addEventListener(
            "click",
            () => {

                showCamera(screen);

            }
        );

}
// =====================================
// PART7
// 図鑑データへ保存する
// =====================================

async function registerDiscoveredCard({

    candidate,
    screen,
    judgeResult

}) {

    const registerButton =
        judgeResult.querySelector(
            "#registerCardButton"
        );

    if (registerButton) {

        registerButton.disabled = true;

        registerButton.textContent =
            "📖 登録しています…";

    }

    try {

        const saveData =
            getSave() ?? {};

        const discoveredCards =
            Array.isArray(
                saveData.discoveredCards
            )
                ? [
                    ...saveData.discoveredCards
                ]
                : [];

        const candidateNo =
            Number(candidate.no);

        const existingIndex =
            discoveredCards.findIndex(
                card =>
                    Number(card.no) ===
                    candidateNo
            );

        const now =
            new Date();

        const discoveredAt =
            now.toISOString();

        let isFirstDiscovery = false;
        let ownedCount = 1;

        // -----------------------------
        // 初めて見つけた生き物
        // -----------------------------

        if (existingIndex === -1) {

            isFirstDiscovery = true;

            const newCard = {

                no:
                    candidateNo,

                name:
                    candidate.name,

                rarity:
                    candidate.rarity,

                category:
                    candidate.category,

                type:
                    candidate.type,

                categoryIcon:
                    candidate.categoryIcon,

                typeIcon:
                    candidate.typeIcon,

                illustration:
                    candidate.illustration,

                discovered:
                    true,

                firstDiscoveredAt:
                    discoveredAt,

                lastDiscoveredAt:
                    discoveredAt,

                ownedCount:
                    1,

                displayOwnedCount:
                    1,

                photo:
                    selectedImageUrl,

                photos:
                    selectedImageUrl
                        ? [selectedImageUrl]
                        : []

            };

            discoveredCards.push(
                newCard
            );

        } else {

            // -----------------------------
            // すでに見つけた生き物
            // -----------------------------

            const existingCard =
                discoveredCards[
                    existingIndex
                ];

            const currentOwnedCount =
                Number(
                    existingCard.ownedCount
                ) || 1;

            ownedCount =
                currentOwnedCount + 1;

            const existingPhotos =
                Array.isArray(
                    existingCard.photos
                )
                    ? [
                        ...existingCard.photos
                    ]
                    : [];

            if (selectedImageUrl) {

                existingPhotos.push(
                    selectedImageUrl
                );

            }

            discoveredCards[
                existingIndex
            ] = {

                ...existingCard,

                name:
                    candidate.name,

                rarity:
                    candidate.rarity,

                category:
                    candidate.category,

                type:
                    candidate.type,

                categoryIcon:
                    candidate.categoryIcon,

                typeIcon:
                    candidate.typeIcon,

                illustration:
                    candidate.illustration,

                discovered:
                    true,

                lastDiscoveredAt:
                    discoveredAt,

                ownedCount,

                displayOwnedCount:
                    Math.min(
                        ownedCount,
                        MAX_CARD_COUNT
                    ),

                photo:
                    selectedImageUrl ||
                    existingCard.photo ||
                    "",

                photos:
                    existingPhotos

            };

        }

        // -----------------------------
        // 発見履歴
        // -----------------------------

        const discoveryHistory =
            Array.isArray(
                saveData.discoveryHistory
            )
                ? [
                    ...saveData.discoveryHistory
                ]
                : [];

        discoveryHistory.unshift({

            no:
                candidateNo,

            name:
                candidate.name,

            discoveredAt,

            photo:
                selectedImageUrl,

            isFirstDiscovery

        });

        // 履歴が増えすぎないようにする
        const limitedHistory =
            discoveryHistory.slice(
                0,
                100
            );

        // -----------------------------
        // 保存
        // -----------------------------

        update({

            discoveredCards,

            discoveryHistory:
                limitedHistory,

            lastDiscovery: {

                no:
                    candidateNo,

                name:
                    candidate.name,

                discoveredAt,

                isFirstDiscovery

            }

        });
        syncDiscoveredNumbers();

        await wait(500);

        showRegisterComplete({

            candidate,

            judgeResult,

            screen,

            isFirstDiscovery,

            ownedCount

        });

    } catch (error) {

        console.error(
            "図鑑への登録に失敗しました。",
            error
        );

        showRegisterError({

            judgeResult,

            candidate,

            screen

        });

    }

}


// =====================================
// 登録完了画面
// =====================================

function showRegisterComplete({

    candidate,
    judgeResult,
    screen,
    isFirstDiscovery,
    ownedCount

}) {

    const displayedOwnedCount =
        Math.min(
            ownedCount,
            MAX_CARD_COUNT
        );

    const discoveryMessage =
        isFirstDiscovery
            ? "図鑑に新しく登録されたよ！"
            : "もう一枚、仲間カードを手に入れたよ！";

    const ownedMessage =
        ownedCount >= MAX_CARD_COUNT
            ? `カードは最大の${MAX_CARD_COUNT}枚まで集まったよ！`
            : `この仲間のカードは${displayedOwnedCount}枚になったよ！`;

    judgeResult.innerHTML = `

        <section class="register-complete-screen">

            <div class="register-complete-effects">

                <span>✨</span>
                <span>🎉</span>
                <span>✨</span>

            </div>

            <div class="register-complete-spirit">
                🥚
            </div>

            <h2>
                図鑑登録完了！
            </h2>

            <p class="register-complete-message">

                ${escapeHtml(
                    discoveryMessage
                )}

            </p>

            <div class="registered-card ${getRarityClass(
                candidate.rarity
            )}">

                ${createGetCardHtml(
                    candidate
                )}

            </div>

            <div class="owned-card-count">

                <span>
                    🎴 保有カード
                </span>

                <strong>
                    ${displayedOwnedCount}
                    /
                    ${MAX_CARD_COUNT}
                </strong>

            </div>

            <p class="owned-card-message">

                ${escapeHtml(
                    ownedMessage
                )}

            </p>

            <div class="register-complete-buttons">

                <button
                    id="openCatalogButton"
                    class="mainButton"
                    type="button"
                >
                    📖 図鑑を見る
                </button>

                <button
                    id="searchAgainButton"
                    class="subButton"
                    type="button"
                >
                    🌿 ほかの仲間をさがす
                </button>

            </div>

        </section>
    `;

    judgeResult
        .querySelector(
            "#openCatalogButton"
        )
        ?.addEventListener(
            "click",
            () => {

                openCatalogScreen(
                    screen
                );

            }
        );

    judgeResult
        .querySelector(
            "#searchAgainButton"
        )
        ?.addEventListener(
            "click",
            () => {

                showCamera(
                    screen
                );

            }
        );

}


// =====================================
// 保存失敗画面
// =====================================

function showRegisterError({

    judgeResult,
    candidate,
    screen

}) {

    judgeResult.innerHTML = `

        <section class="register-error-screen">

            <div class="register-error-spirit">
                🥚
            </div>

            <h2>
                登録できなかったよ
            </h2>

            <p>
                一時的なエラーかもしれないよ。<br>
                もう一度登録してみてね。
            </p>

            <button
                id="retryRegisterButton"
                class="mainButton"
                type="button"
            >
                📖 もう一度登録する
            </button>

            <button
                id="registerErrorBackButton"
                class="subButton"
                type="button"
            >
                仲間さがしにもどる
            </button>

        </section>
    `;

    judgeResult
        .querySelector(
            "#retryRegisterButton"
        )
        ?.addEventListener(
            "click",
            async () => {

                await registerDiscoveredCard({

                    candidate,
                    screen,
                    judgeResult

                });

            }
        );

    judgeResult
        .querySelector(
            "#registerErrorBackButton"
        )
        ?.addEventListener(
            "click",
            () => {

                showCamera(
                    screen
                );

            }
        );

}


// =====================================
// 図鑑画面を開く
// =====================================

function openCatalogScreen(screen) {

    // catalog.js完成後に正式な処理へつなぐ
    // 今は下メニューの図鑑ボタンを探して押す

    const catalogButton =
        document.querySelector(
            '[data-screen="catalog"]'
        ) ||
        document.querySelector(
            '[data-page="catalog"]'
        ) ||
        document.querySelector(
            "#catalogButton"
        );

    if (catalogButton) {

        catalogButton.click();

        return;

    }

    screen.innerHTML = `

        <section class="camera-page">

            <div class="temporary-catalog-message">

                <div class="temporary-catalog-icon">
                    📖
                </div>

                <h2>
                    図鑑に登録したよ！
                </h2>

                <p>
                    図鑑画面はこれから作っていくよ。
                </p>

                <button
                    id="temporaryCatalogBackButton"
                    class="mainButton"
                    type="button"
                >
                    🌿 仲間をさがすにもどる
                </button>

            </div>

        </section>
    `;

    screen
        .querySelector(
            "#temporaryCatalogBackButton"
        )
        ?.addEventListener(
            "click",
            () => {

                showCamera(
                    screen
                );

            }
        );

}
// =====================================
// PART8
// 最終安全処理・共通補助
// =====================================

// =====================================
// 写真データが使用可能か確認
// =====================================

function hasSelectedImage() {

    return Boolean(
        selectedImageFile &&
        selectedImageUrl
    );

}


// =====================================
// カード番号を表示用に整える
// =====================================

function formatCardNumber(number) {

    const normalizedNumber =
        Number(number);

    if (
        !Number.isFinite(normalizedNumber)
    ) {
        return "000";
    }

    return String(
        Math.max(
            0,
            Math.floor(normalizedNumber)
        )
    ).padStart(
        3,
        "0"
    );

}


// =====================================
// 日付を日本語表示へ変換
// 図鑑詳細画面でも使用可能
// =====================================

function formatDiscoveryDate(dateValue) {

    if (!dateValue) {
        return "記録なし";
    }

    const date =
        new Date(dateValue);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "記録なし";
    }

    return new Intl.DateTimeFormat(
        "ja-JP",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    ).format(date);

}


// =====================================
// 保有数を安全な数値へ整える
// =====================================

function normalizeOwnedCount(value) {

    const count =
        Number(value);

    if (
        !Number.isFinite(count) ||
        count < 1
    ) {
        return 1;
    }

    return Math.floor(count);

}


// =====================================
// 写真ファイルの基本チェック
// =====================================

function validateImageFile(file) {

    if (!file) {

        return {
            valid: false,
            message:
                "写真が選ばれていません。"
        };

    }

    if (
        !String(file.type)
            .startsWith("image/")
    ) {

        return {
            valid: false,
            message:
                "画像ファイルを選んでね。"
        };

    }

    // 読み込み時の負担を抑えるための目安
    const maximumFileSize =
        20 * 1024 * 1024;

    if (
        Number(file.size) >
        maximumFileSize
    ) {

        return {
            valid: false,
            message:
                "写真のサイズが大きすぎるよ。別の写真を選んでね。"
        };

    }

    return {
        valid: true,
        message: ""
    };

}


// =====================================
// 画面上部へなめらかに移動
// =====================================

function scrollCameraPageToTop() {

    window.requestAnimationFrame(
        () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


// =====================================
// 仲間さがし画面の終了処理
// =====================================

export function cleanupCamera() {

    resetSelectedImage();

}


// =====================================
// camera.js読み込み確認
// =====================================

console.log(
    "🌿 camera.js Ver4 読み込み完了"
);