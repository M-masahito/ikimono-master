// =====================================
// screens/catalog.js
// 500種類の図鑑画面
// =====================================

import { getSave } from "../system/storage.js";

export function showCatalog(screen) {

    const save = getSave();

    const discovered = Array.isArray(save.discovered)
        ? save.discovered
        : [];

    const catalog = Array.isArray(window.IKIMONO_CATALOG)
        ? window.IKIMONO_CATALOG
        : [];

    screen.innerHTML = `
        <section class="encyclopedia-page">

            <div class="encyclopedia-header">

                <div>
                    <h2>📖 いきもの図鑑</h2>
                    <p>まだ見つけていない生き物も探してみよう！</p>
                </div>

                <div class="encyclopedia-count">
                    <strong>${discovered.length}</strong>
                    <span>/ 500</span>
                </div>

            </div>

            <div class="encyclopedia-search-area">

                <input
                    id="searchBox"
                    class="encyclopedia-search"
                    type="search"
                    placeholder="生き物の名前で検索"
                    autocomplete="off"
                >

                <select
                    id="categoryFilter"
                    class="encyclopedia-filter"
                >
                    <option value="">すべて</option>
                    <option value="昆虫">昆虫</option>
                    <option value="魚">魚</option>
                    <option value="鳥">鳥</option>
                    <option value="哺乳類">哺乳類</option>
                    <option value="爬虫類">爬虫類</option>
                    <option value="両生類">両生類</option>
                    <option value="植物">植物</option>
                    <option value="キノコ">キノコ</option>
                    <option value="その他">その他</option>
                </select>

            </div>

            <div
                id="catalogList"
                class="catalog-grid"
            ></div>

        </section>
    `;

    const list = screen.querySelector("#catalogList");
    const searchBox = screen.querySelector("#searchBox");
    const categoryFilter = screen.querySelector("#categoryFilter");

    function draw() {

        const keyword =
            searchBox.value.trim().toLowerCase();

        const category =
            categoryFilter.value;

        list.innerHTML = "";

        const filtered = catalog.filter(item => {

            const itemName =
                String(item.name ?? "").toLowerCase();

            const matchesName =
                !keyword || itemName.includes(keyword);

            const matchesCategory =
                !category || item.category === category;

            return matchesName && matchesCategory;

        });

        filtered.forEach(item => {

            const found =
                discovered.includes(item.no);

            const hasName =
                Boolean(item.name?.trim());

            const displayName =
                found && hasName
                    ? item.name
                    : "？？？";

            const card = document.createElement("button");

            card.type = "button";

            card.className = `
                catalog-card
                ${found ? "found" : "unknown"}
            `;

            card.innerHTML = `

                <div class="catalog-no">
                    No.${String(item.no).padStart(3, "0")}
                </div>

                <div class="catalog-image">

                    <img
                        src="${item.image}"
                        alt="${found ? item.name : "未発見の生き物"}"
                        onerror="
                            this.onerror=null;
                            this.src='./icon-192.png';
                        "
                    >

                    ${
                        found
                            ? ""
                            : `<div class="catalog-lock">?</div>`
                    }

                </div>

                <div class="catalog-name">
                    ${displayName}
                </div>

                <div class="catalog-bottom">

                    <span class="catalog-category">
                        ${found ? item.category : "未発見"}
                    </span>

                    <span class="catalog-rarity">
                        ${
                            found
                                ? rarityText(item.rarity)
                                : "?"
                        }
                    </span>

                </div>
            `;

            card.addEventListener("click", () => {

                if (!found) {

                    showUnknownDetail(item);
                    return;

                }

                showDetail(item);

            });

            list.appendChild(card);

        });

        if (filtered.length === 0) {

            list.innerHTML = `
                <div class="catalog-empty">
                    該当する生き物がありません
                </div>
            `;

        }

    }

    function showUnknownDetail(item) {

        const overlay = createOverlay();

        overlay.innerHTML = `
            <div class="catalog-detail unknown-detail">

                <button
                    class="catalog-close"
                    type="button"
                    aria-label="閉じる"
                >
                    ✕
                </button>

                <div class="detail-number">
                    No.${String(item.no).padStart(3, "0")}
                </div>

                <div class="detail-unknown-image">

                    <img
                        src="${item.image}"
                        alt="未発見の生き物"
                        onerror="
                            this.onerror=null;
                            this.src='./icon-192.png';
                        "
                    >

                    <span>?</span>

                </div>

                <h2>？？？</h2>

                <p class="unknown-message">
                    まだ発見していない生き物です。
                </p>

                <p class="unknown-hint">
                    写真を撮って、精霊に調べてもらおう！
                </p>

            </div>
        `;

        setupOverlay(overlay);

    }

    function showDetail(item) {

        const overlay = createOverlay();

        const card =
            save.cards?.find(card => card.no === item.no);

        overlay.innerHTML = `
            <div class="catalog-detail">

                <button
                    class="catalog-close"
                    type="button"
                    aria-label="閉じる"
                >
                    ✕
                </button>

                <div class="detail-number">
                    No.${String(item.no).padStart(3, "0")}
                </div>

                <img
                    class="catalog-detail-image"
                    src="${item.image}"
                    alt="${item.name}"
                    onerror="
                        this.onerror=null;
                        this.src='./icon-192.png';
                    "
                >

                <h2>${item.name}</h2>

                <div class="catalog-detail-tags">

                    <span>${item.category}</span>

                    <span>
                        レア度 ${rarityText(item.rarity)}
                    </span>

                </div>

                <div class="catalog-detail-info">

                    <p>
                        <strong>季節</strong>
                        <span>${item.season ?? "不明"}</span>
                    </p>

                    <p>
                        <strong>生息地</strong>
                        <span>${item.habitat ?? "不明"}</span>
                    </p>

                    <p>
                        <strong>大きさ</strong>
                        <span>${item.size ?? "不明"}</span>
                    </p>

                    <p>
                        <strong>保有カード</strong>
                        <span>${card?.count ?? 1}枚</span>
                    </p>

                </div>

                <div class="catalog-description">
                    ${item.description ?? "説明は準備中です。"}
                </div>

                <button
                    id="showCardButton"
                    class="mainButton"
                    type="button"
                >
                    🃏 カードを見る
                </button>

            </div>
        `;

        setupOverlay(overlay);

        overlay
            .querySelector("#showCardButton")
            ?.addEventListener("click", () => {

                overlay.remove();

                window.location.hash =
                    `#cards?no=${item.no}`;

            });

    }

    function createOverlay() {

        const overlay =
            document.createElement("div");

        overlay.className =
            "catalog-detail-overlay";

        document.body.appendChild(overlay);

        return overlay;

    }

    function setupOverlay(overlay) {

        overlay
            .querySelector(".catalog-close")
            ?.addEventListener("click", () => {

                overlay.remove();

            });

        overlay.addEventListener("click", event => {

            if (event.target === overlay) {

                overlay.remove();

            }

        });

    }

    searchBox.addEventListener("input", draw);
    categoryFilter.addEventListener("change", draw);

    draw();

}

function rarityText(rarity) {

    const map = {
        1: "C",
        2: "C",
        3: "B",
        4: "A",
        5: "S"
    };

    return map[rarity] ?? "?";

}