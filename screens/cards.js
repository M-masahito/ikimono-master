// =====================================
// screens/cards.js
// カード一覧画面
// =====================================

import { getSave } from "../system/storage.js";

export function showCards(screen) {
    const save = getSave();
    const cards = save.cards || [];

    if (cards.length === 0) {
        screen.innerHTML = `
            <section class="cards-screen">
                <h2 class="cards-title">カード</h2>

                <div class="cards-empty">
                    <div class="cards-empty-icon">🎴</div>
                    <p>まだカードを持っていません。</p>
                    <p>生き物と出会うとカードが増えます。</p>
                </div>
            </section>
        `;

        return;
    }

    const cardList = cards.map((card, index) => {
        const no = String(card.no ?? index + 1).padStart(3, "0");
        const name = card.name || "なまえ不明";
        const rarity = card.rarity || "C";
        const category = card.category || "未分類";
        const type = card.type || category;
        const owner = card.owner || "あなた";
        const count = card.count || 1;

        const image =
            card.illustration ||
            card.image ||
            card.photo ||
            "assets/images/card-placeholder.png";

        return `
            <button
                class="collection-card"
                type="button"
                data-card-index="${index}"
                aria-label="${name}のカードを見る"
            >
                <div class="collection-card-top">
                    <span class="collection-card-no">No.${no}</span>
                    <span class="collection-card-emblem">
                        ${getCategoryMark(category)}
                    </span>
                </div>

                <div class="collection-card-picture">
                    <img
                        src="${image}"
                        alt="${name}"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                    >

                    <div class="collection-card-placeholder">
                        <span>${getCategoryMark(category)}</span>
                    </div>
                </div>

                <div class="collection-card-info">
                    <h3>${name}</h3>

                    <div class="collection-card-bottom">
                        <span class="collection-card-type">
                            ${type}
                        </span>

                        <span class="collection-card-rarity rarity-${rarity.toLowerCase()}">
                            ${rarity}
                        </span>
                    </div>

                    <p class="collection-card-owner">
                        発見者：${owner}
                    </p>

                    <p class="collection-card-count">
                        ${count}枚
                    </p>
                </div>
            </button>
        `;
    }).join("");

    screen.innerHTML = `
        <section class="cards-screen">
            <div class="cards-header">
                <div>
                    <p class="cards-subtitle">集めた仲間たち</p>
                    <h2 class="cards-title">カード</h2>
                </div>

                <div class="cards-total">
                    ${cards.length}種類
                </div>
            </div>

            <div class="cards-grid">
                ${cardList}
            </div>
        </section>

        <div class="card-detail-modal" id="card-detail-modal" hidden>
            <div class="card-detail-backdrop" data-close-card></div>

            <div class="card-detail-window">
                <button
                    class="card-detail-close"
                    type="button"
                    data-close-card
                    aria-label="閉じる"
                >
                    ×
                </button>

                <div id="card-detail-content"></div>
            </div>
        </div>
    `;

    const cardButtons = screen.querySelectorAll(".collection-card");

    cardButtons.forEach(button => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.cardIndex);
            openCardDetail(screen, cards[index]);
        });
    });

    screen.querySelectorAll("[data-close-card]").forEach(button => {
        button.addEventListener("click", () => {
            closeCardDetail(screen);
        });
    });
}

function openCardDetail(screen, card) {
    const modal = screen.querySelector("#card-detail-modal");
    const content = screen.querySelector("#card-detail-content");

    if (!modal || !content || !card) {
        return;
    }

    const no = String(card.no || 1).padStart(3, "0");
    const name = card.name || "なまえ不明";
    const rarity = card.rarity || "C";
    const category = card.category || "未分類";
    const type = card.type || category;
    const owner = card.owner || "あなた";

    const image =
        card.illustration ||
        card.image ||
        card.photo ||
        "assets/images/card-placeholder.png";

    content.innerHTML = `
        <article class="large-creature-card rarity-border-${rarity.toLowerCase()}">
            <div class="large-card-top">
                <span class="large-card-number">No.${no}</span>

                <span class="large-card-emblem">
                    ${getCategoryMark(category)}
                </span>
            </div>

            <div class="large-card-art">
                <img
                    src="${image}"
                    alt="${name}"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                >

                <div class="large-card-placeholder">
                    ${getCategoryMark(category)}
                </div>
            </div>

            <div class="large-card-name">
                ${name}
            </div>

            <div class="large-card-footer">
                <span class="large-card-type">
                    ${type}
                </span>

                <span class="large-card-rarity rarity-${rarity.toLowerCase()}">
                    ${rarity}
                </span>
            </div>

            <div class="large-card-owner">
                発見者：${owner}
            </div>
        </article>
    `;

    modal.hidden = false;
    document.body.classList.add("card-modal-open");
}

function closeCardDetail(screen) {
    const modal = screen.querySelector("#card-detail-modal");

    if (!modal) {
        return;
    }

    modal.hidden = true;
    document.body.classList.remove("card-modal-open");
}

function getCategoryMark(category) {
    const marks = {
        "昆虫": "🪲",
        "水の生き物": "🐟",
        "魚": "🐟",
        "鳥": "🦉",
        "爬虫類・両生類": "🐢",
        "爬虫類": "🐢",
        "両生類": "🐸",
        "獣": "🐾",
        "哺乳類": "🐾",
        "植物": "🌿",
        "きのこ・木の実・果物": "🍄",
        "きのこ": "🍄"
    };

    return marks[category] || "🌱";
}