// =======================================
// screens/discoveryPouch.js
// 発見ポーチ
// =======================================

import { showCamera } from "./camera.js";

const POUCH_KEY = "ikimonoDiscoveryPouch";

export function showDiscoveryPouch(screen) {

    const pouch = getDiscoveryPouch();

    screen.innerHTML = `
        <section class="discovery-pouch-screen">

            <header class="discovery-pouch-header">
                <button
                    id="discoveryPouchBack"
                    class="discovery-pouch-back"
                    type="button"
                >
                    ← 戻る
                </button>

                <div>
                    <h2>🎒 発見ポーチ</h2>
                    <p>
                        見つけた仲間をここで確認できるよ！
                    </p>
                </div>
            </header>

            <div
                class="discovery-pouch-list"
                id="discoveryPouchList"
            >
                ${
                    pouch.length === 0
                        ? `
                            <div class="discovery-pouch-empty">

                                <div class="discovery-pouch-empty-icon">
                                    🎒
                                </div>

                                <strong>
                                    ポーチはまだ空っぽだよ
                                </strong>

                                <p>
                                    オフラインで見つけた仲間が<br>
                                    ここに入るよ！
                                </p>

                            </div>
                        `
                        : pouch.map(item => `
                            <button
                                class="discovery-pouch-item"
                                type="button"
                                data-pouch-id="${item.id}"
                            >

                                <img
                                    src="${item.image}"
                                    alt="発見した生き物の写真"
                                    class="discovery-pouch-image"
                                >

                                <div class="discovery-pouch-item-info">

                                    <strong>
                                        🔍 この仲間を調べる
                                    </strong>

                                    <small>
                                        ${
                                            navigator.onLine
                                                ? "タップしてAI判定"
                                                : "オンラインになったら判定できるよ"
                                        }
                                    </small>

                                </div>

                            </button>
                        `).join("")
                }
            </div>

        </section>
    `;


    // =====================================
    // 戻る
    // =====================================

    const backButton =
        screen.querySelector("#discoveryPouchBack");

    backButton?.addEventListener(
        "click",
        () => {
            showCamera(screen);
        }
    );


    // =====================================
    // ポーチ写真を選ぶ
    // =====================================

    const pouchItems =
        screen.querySelectorAll(
            ".discovery-pouch-item"
        );

    pouchItems.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                const pouchId =
                    Number(item.dataset.pouchId);

                const selectedItem =
                    pouch.find(
                        pouchItem =>
                            Number(pouchItem.id) ===
                            pouchId
                    );

                if (!selectedItem) {
                    return;
                }

                if (!navigator.onLine) {

                    window.alert(
                        "今はオフラインみたい！\nオンラインになったら判定できるよ。"
                    );

                    return;
                }


                // camera.jsへ渡すため一時保存
                sessionStorage.setItem(
                    "ikimonoPouchJudgeImage",
                    selectedItem.image
                );

                sessionStorage.setItem(
                    "ikimonoPouchJudgeId",
                    String(selectedItem.id)
                );


                // 仲間さがし画面へ
                showCamera(screen);
            }
        );

    });

}


// =======================================
// 発見ポーチへ保存
// =======================================

export function saveToDiscoveryPouch(imageData) {

    const pouch =
        getDiscoveryPouch();

    pouch.unshift({
        id: Date.now(),
        image: imageData,
        savedAt: new Date().toISOString(),
        unread: true
    });

    localStorage.setItem(
        POUCH_KEY,
        JSON.stringify(pouch)
    );
}


// =======================================
// 発見ポーチを取得
// =======================================

export function getDiscoveryPouch() {

    try {

        const pouch =
            JSON.parse(
                localStorage.getItem(
                    POUCH_KEY
                ) || "[]"
            );

        return Array.isArray(pouch)
            ? pouch
            : [];

    } catch (error) {

        console.error(
            "発見ポーチの読み込みに失敗しました。",
            error
        );

        return [];
    }
}


// =======================================
// 判定済み写真をポーチから削除
// =======================================

export function removeFromDiscoveryPouch(id) {

    const pouch =
        getDiscoveryPouch()
            .filter(
                item =>
                    Number(item.id) !==
                    Number(id)
            );

    localStorage.setItem(
        POUCH_KEY,
        JSON.stringify(pouch)
    );
}