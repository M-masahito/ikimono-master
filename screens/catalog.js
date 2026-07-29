// =====================================
// screens/catalog.js
// いきものマスター Ver.2
// カード図鑑システム
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
                    <p>見つけたカードを集めよう！</p>
                </div>

                <div class="encyclopedia-count">
                    <strong>${discovered.length}</strong>
                    <span>/ ${catalog.length}</span>
                </div>

            </div>

            <div class="encyclopedia-search-area">

                <input
                    id="searchBox"
                    class="encyclopedia-search"
                    type="search"
                    placeholder="名前で検索"
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

    draw();
        function draw() {

        const keyword =
            searchBox.value
                .trim()
                .toLowerCase();

        const category =
            categoryFilter.value;

        list.innerHTML = "";

        const filtered = catalog.filter(item => {

            const found =
                discovered.includes(item.no);

            const name =
                found
                    ? String(item.name).toLowerCase()
                    : "";

            const matchesName =
                !keyword ||
                name.includes(keyword);

            const matchesCategory =
                !category ||
                item.category === category;

            return matchesName &&
                   matchesCategory;

        });

        filtered.forEach(item => {

            const found =
                discovered.includes(item.no);

            const card =
                document.createElement("button");

            card.type = "button";

            card.className =
                `catalog-card ${
                    found
                        ? "found"
                        : "unknown"
                }`;

            card.innerHTML = `

                <div class="catalog-no">
                    No.${String(item.no).padStart(3,"0")}
                </div>

                <div class="catalog-card-image">

                    ${
                        found

                        ? `

                        <img
                            src="${item.cardImage ?? item.image}"
                            alt="${item.name}"
                        >

                        `

                        : `

                        <div class="card-back">
                            <span>？</span>
                        </div>

                        `
                    }

                </div>

                <div class="catalog-name">

                    ${
                        found
                            ? item.name
                            : "？？？"
                    }

                </div>

            `;

            card.addEventListener(
                "click",
                () => {

                    if(found){

                        showDetail(item);

                    }else{

                        showUnknownDetail(item);

                    }

                }
            );

            list.appendChild(card);

        });

    }

    searchBox.addEventListener(
        "input",
        draw
    );

    categoryFilter.addEventListener(
        "change",
        draw
    );

}
// =====================================
// 未発見カードの詳細
// =====================================

function showUnknownDetail(item) {

    const overlay =
        document.createElement("div");

    overlay.className =
        "catalog-detail-overlay";

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

            <div class="detail-card-back">

                <div class="detail-card-question">
                    ？
                </div>

                <div class="detail-card-unknown">
                    未発見
                </div>

            </div>

            <h2>？？？</h2>

            <p class="unknown-message">
                まだ発見していない生き物です。
            </p>

            <p class="unknown-hint">
                仲間をさがしてカードを手に入れよう！
            </p>

        </div>
    `;

    document.body.appendChild(overlay);

    setupOverlay(overlay);

}


// =====================================
// 発見済みカードの詳細
// =====================================

function showDetail(item) {

    const cardImage =
        item.cardImage ??
        item.illustration ??
        item.image ??
        "./icon-192.png";

    const realImage =
        item.realImage ??
        item.photo ??
        item.image ??
        "./icon-192.png";

    const overlay =
        document.createElement("div");

    overlay.className =
        "catalog-detail-overlay";

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

            <div class="detail-main-card">

                <img
                    src="${cardImage}"
                    alt="${item.name}のカード"
                    onerror="
                        this.onerror = null;
                        this.src = './icon-192.png';
                    "
                >

            </div>

            <h2>
                ${item.name}
            </h2>

            <div class="catalog-detail-tags">

                <span>
                    ${item.category ?? "その他"}
                </span>

                ${
                    item.type
                        ? `
                            <span>
                                ${item.type}
                            </span>
                        `
                        : ""
                }

                <span>
                    レア度 ${rarityText(item.rarity)}
                </span>

            </div>

            <div class="catalog-real-photo">

                <h3>
                    📷 リアル写真
                </h3>

                <img
                    class="catalog-detail-image"
                    src="${realImage}"
                    alt="${item.name}の写真"
                    onerror="
                        this.onerror = null;
                        this.src = './icon-192.png';
                    "
                >

            </div>

            <div class="catalog-description">

                ${
                    item.description ??
                    "説明は準備中です。"
                }

            </div>

            <div class="catalog-detail-info">

                <p>
                    <strong>季節</strong>
                    <span>
                        ${item.season ?? "不明"}
                    </span>
                </p>

                <p>
                    <strong>生息地</strong>
                    <span>
                        ${item.habitat ?? "不明"}
                    </span>
                </p>

                <p>
                    <strong>大きさ</strong>
                    <span>
                        ${item.size ?? "不明"}
                    </span>
                </p>

                <p>
                    <strong>発見場所</strong>
                    <span>
                        ${item.foundPlace ?? "未登録"}
                    </span>
                </p>

                <p>
                    <strong>発見日</strong>
                    <span>
                        ${item.foundDate ?? "未登録"}
                    </span>
                </p>

                <p>
                    <strong>発見者</strong>
                    <span>
                        ${item.finder ?? "未登録"}
                    </span>
                </p>

                <p>
                    <strong>保有数</strong>
                    <span>
                        ${item.count ?? 1}枚
                    </span>
                </p>

            </div>

        </div>
    `;

    document.body.appendChild(overlay);

    setupOverlay(overlay);

}


// =====================================
// 詳細画面を閉じる処理
// =====================================

function setupOverlay(overlay) {

    const closeButton =
        overlay.querySelector(".catalog-close");

    closeButton.addEventListener(
        "click",
        () => {

            overlay.remove();

        }
    );

    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target === overlay
            ) {

                overlay.remove();

            }

        }
    );

}


// =====================================
// レア度表示
// =====================================

function rarityText(rarity) {

    if (
        rarity === "S" ||
        rarity === "A" ||
        rarity === "B" ||
        rarity === "C"
    ) {

        return rarity;

    }

    const rarityMap = {

        1: "C",
        2: "C",
        3: "B",
        4: "A",
        5: "S"

    };

    return rarityMap[rarity] ?? "?";

}