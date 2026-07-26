/* ==========================================
   いきものマスター Ver9
   app.js
========================================== */

const APP = {
    total: 500,
    discovered: [],
    currentCard: null
};

/* ==========================================
   保存
========================================== */

function saveGame() {

    localStorage.setItem(
        "ikimonoMaster",
        JSON.stringify(APP)
    );

}

/* ==========================================
   読み込み
========================================== */

function loadGame() {

    const data = localStorage.getItem("ikimonoMaster");

    if (!data) return;

    try {

        Object.assign(
            APP,
            JSON.parse(data)
        );

    } catch (e) {

        console.error("Save Load Error", e);

    }

}

/* ==========================================
   画面切替
========================================== */
function showScreen(id) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.style.display = "none";

        });

    const target = document.getElementById(id);

    if (target) {

        target.style.display = "block";

    }

}

/* ==========================================
   ボタン設定
========================================== */

function initializeNavigation() {

    document
        .querySelectorAll("[data-go]")
        .forEach(button => {

            button.onclick = () => {

                showScreen(
                    button.dataset.go
                );

            };

        });

}
/* ==========================================
   カード登録
========================================== */

function hasCard(no) {

    return APP.discovered.includes(no);

}



 

/* ==========================================
   発見数
========================================== */

function getDiscoveryCount() {

    return APP.discovered.length;

}

/* ==========================================
   ホーム更新
========================================== */

function updateHome() {

    const owned = getDiscoveryCount();

    const percent = Math.floor(
        owned / APP.total * 100
    );

    const ownedEl = document.getElementById("homeOwnedCount");
    const bookEl = document.getElementById("bookOwnedCount");
    const rateEl = document.getElementById("homeRate");
    const remainEl = document.getElementById("homeRemaining");
    const barEl = document.getElementById("collectionBar");

    if (ownedEl) ownedEl.textContent = owned;

    if (bookEl) bookEl.textContent = owned;

    if (rateEl) rateEl.textContent = percent + "%";

    if (remainEl) {

        remainEl.textContent =
            "あと " + (APP.total - owned) + "種類";

    }

    if (barEl) {

        barEl.style.width = percent + "%";

    }

    // 精霊画面更新
    if (typeof updateSpirit === "function") {

        updateSpirit();

    }

}
/* ==========================================
   図鑑詳細
========================================== */

function openDetail(no) {

    const card = window.IKIMONO_DATA.find(
        c => c.no === no
    );

    if (!card) return;

    APP.currentCard = card;

    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value ?? "-";
    };

    setText("detailNo", "No." + String(card.no).padStart(3, "0"));
    setText("detailName", card.name);
    setText("detailCategory", card.category);
    setText("detailType", card.type);
    setText("detailRarity", card.rarity);
    setText("detailDescription", card.description);

    const image = document.getElementById("detailImage");

    if (image) {

        image.src = card.cardImage || "";

    }

    showScreen("detail");

}

/* ==========================================
   初期化
========================================== */

function initializeApp() {

    loadGame();

    initializeNavigation();

    updateHome();

    if (typeof renderCatalog === "function") {

        renderCatalog();

    }

    showScreen("home");

    console.log("いきものマスター Ver9 起動");

}

/* ==========================================
   起動
========================================== */

window.addEventListener("DOMContentLoaded", initializeApp);
/* ==========================================
   カード登録
========================================== */

function registerCard(no) {

    if (hasCard(no)) {

        showToast("すでに発見済みです");

        return false;

    }

    APP.discovered.push(no);

    saveGame();

const card = getCardByNo(no);

if(!card){

    console.error("カードが見つかりません");

    return false;

}
if (card) {

    addSpecies(card.category);

    if (typeof showGetCard === "function") {

        showGetCard(card);

    }

}

    updateHome();

    if (typeof renderCatalog === "function") {

        renderCatalog();

    }

    if (typeof updateSpirit === "function") {

        updateSpirit();

    }

    showToast("🎉 " + card.name + " を発見！");

    return true;

}
/* ==========================================
   Toast
========================================== */

function showToast(text) {

    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.textContent = text;

    toast.classList.remove("hidden");

    setTimeout(() => {

        toast.classList.add("hidden");

    }, 2000);

}
APP.currentImage = null;
/* ==========================================
   写真プレビュー
========================================== */

const photo = document.getElementById("photo");

if (photo) {

    photo.onchange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            APP.currentImage = reader.result;

            const preview = document.getElementById("preview");

            if (preview) {

                preview.innerHTML = `
                    <img
                        src="${reader.result}"
                        style="
                            width:100%;
                            height:100%;
                            object-fit:cover;
                            border-radius:12px;
                        ">
                `;

            }

            const status = document.getElementById("aiStatus");

            if (status) {

                status.textContent = "AI判定できます";

            }

        };

        reader.readAsDataURL(file);

    };

}

document
.getElementById("identify")
?.addEventListener("click", () => {

    if(!APP.currentImage){

        showToast("写真を選択してください");

        return;

    }

    if(typeof identifyPhoto==="function"){

        identifyPhoto(APP.currentImage);

    }

});