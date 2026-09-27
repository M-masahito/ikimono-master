// =======================================
// screens/discoveryPouch.js
// 発見ポーチ
// =======================================

import { showCamera } from "./camera.js";

export function showDiscoveryPouch(screen) {

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
                <div class="discovery-pouch-empty">
                    <div class="discovery-pouch-empty-icon">
                        🎒
                    </div>

                    <strong>
                        ポーチはまだ空っぽだよ
                    </strong>

                    <p>
                        新しい仲間を見つけると<br>
                        ここに入るよ！
                    </p>
                </div>
            </div>

        </section>
    `;

    const pouch =
        getDiscoveryPouch();

    const pouchList =
        screen.querySelector("#discoveryPouchList");

    if (pouchList && pouch.length > 0) {

        pouchList.innerHTML =
            pouch.map(item => `
                <div class="discovery-pouch-item">
                    <img
                        src="${item.image}"
                        alt="発見した生き物の写真"
                        class="discovery-pouch-image"
                    >
                </div>
            `).join("");
    }

        const backButton =
        screen.querySelector("#discoveryPouchBack");

    backButton?.addEventListener(
        "click",
        () => {
            showCamera(screen);
        }
    );

}

export function saveToDiscoveryPouch(imageData) {

    const pouch =
        JSON.parse(
            localStorage.getItem("ikimonoDiscoveryPouch") || "[]"
        );

    pouch.unshift({
        id: Date.now(),
        image: imageData,
        savedAt: new Date().toISOString(),
        unread: true
    });

    localStorage.setItem(
        "ikimonoDiscoveryPouch",
        JSON.stringify(pouch)
    );
}

function getDiscoveryPouch() {

    try {
        const pouch =
            JSON.parse(
                localStorage.getItem("ikimonoDiscoveryPouch") || "[]"
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