// =====================================
// screens/catalog.js
// いきものマスター Ver8
// 図鑑画面
// PART1
// =====================================

import { getSave } from "../system/storage.js";
import {
    getCatalogLevel,
    getUnlockedMaxNo
} from "../system/catalogLevel.js";

const DEFAULT_IMAGE = "./icon-192.png";

// =====================================
// エンブレム画面 テスト用データ
// =====================================

function isEmblemTestMode() {
    return localStorage.getItem("emblemTestMode") === "true";
}
const EMBLEM_TEST_ITEMS = [
    {
        id: "shark",
        name: "サメ",
        attribute: "mizu",
        attributeName: "みず",
        stoneRanks: ["bronze", "silver", "gold"]
    },
    {
        id: "kuwagata",
        name: "クワガタ",
        attribute: "mushi",
        attributeName: "むし",
        stoneRanks: ["bronze", "silver", "gold"]
    },
    {
        id: "kabutomushi",
        name: "カブトムシ",
        attribute: "mushi",
        attributeName: "むし",
        stoneRanks: ["bronze", "gold"]
    },
    {
        id: "hebi",
        name: "ヘビ",
        attribute: "daichi",
        attributeName: "だいち",
        stoneRanks: []
    },
    {
        id: "karasu",
        name: "カラス",
        attribute: "sora",
        attributeName: "そら",
        stoneRanks: []
    },
    {
        id: "ookami",
        name: "オオカミ",
        attribute: "kemono",
        attributeName: "けもの",
        stoneRanks: ["bronze", "silver", "gold"]
    }
];

// =====================================
// 図鑑画面を表示
// =====================================

export function showCatalog(screen) {

  const save = getSave();

const discoveredNumbers =
    getDiscoveredNumbers(save);

const catalogLevel =
    getCatalogLevel(
        discoveredNumbers.length
    );

const unlockedMaxNo =
    getUnlockedMaxNo(
        catalogLevel
    );

const allCatalog =
    Array.isArray(window.MASTER?.encyclopedia)
        ? window.MASTER.encyclopedia
        : [];

const catalog =
    allCatalog.filter(item =>
        Number(item.no) <= unlockedMaxNo
    );
    const discoveredCatalogCount =
    discoveredNumbers.filter(number =>
        catalog.some(item =>
            Number(item?.no) === number
        )
    ).length;



    screen.innerHTML = `

        <section class="encyclopedia-page">

            <nav class="catalog-mode-tabs" aria-label="図鑑の表示切替">
                <button
                    type="button"
                    class="catalog-mode-tab active"
                    data-catalog-mode="catalog"
                >
                    いきもの図鑑
                </button>

                <button
                    type="button"
                    class="catalog-mode-tab"
                    data-catalog-mode="emblems"
                >
                    エンブレム
                </button>
            </nav>

            <header class="encyclopedia-header">

                <div class="encyclopedia-title-area">

                    <div class="encyclopedia-title-icon">
                        📖
                    </div>

                    <div>

                        <h2>
                            いきもの図鑑
                        </h2>

                        <p>
                            見つけた仲間を集めよう！
                        </p>

                    </div>

                </div>

                <div class="encyclopedia-count">

                    <strong id="discoveredCount">
                        ${discoveredCatalogCount}
                        
                    </strong>

                    <span>
                        / ${catalog.length}
                    </span>

                </div>

            </header>

            <div class="encyclopedia-progress-area">

                <div class="encyclopedia-progress-info">

                    <span>
                        図鑑完成度
                    </span>

                    <strong id="catalogProgressText">
                        ${getProgressPercent(
                            discoveredCatalogCount,
                            catalog.length
                        )}%
                    </strong>

                </div>

                <div class="encyclopedia-progress-track">

                    <div
                        id="catalogProgressBar"
                        class="encyclopedia-progress-bar"
                        style="
                            width:
                            ${getProgressPercent(
                                discoveredCatalogCount,
                                catalog.length
                            )}%;
                        "
                    ></div>

                </div>

            </div>

            <div class="encyclopedia-search-area">

                <label class="encyclopedia-search-box">

                    <span>
                        🔍
                    </span>

                    <input
                        id="catalogSearchBox"
                        class="encyclopedia-search"
                        type="search"
                        placeholder="生き物の名前を検索"
                        autocomplete="off"
                    >

                </label>

                <select
                    id="catalogCategoryFilter"
                    class="encyclopedia-filter"
                    aria-label="カテゴリーで絞り込む"
                >
                    <option value="">
                        すべてのカテゴリー
                    </option>
                </select>

                <select
                    id="catalogStatusFilter"
                    class="encyclopedia-filter"
                    aria-label="発見状態で絞り込む"
                >
                    <option value="">
                        すべてのカード
                    </option>

                    <option value="found">
                        発見済み
                    </option>

                    <option value="unknown">
                        未発見
                    </option>
                </select>

            </div>

            <div
                id="catalogResultInfo"
                class="catalog-result-info"
            ></div>

            <div
                id="catalogList"
                class="catalog-grid"
            ></div>

            <div
                id="catalogEmpty"
                class="catalog-empty"
                hidden
            >

                <div class="catalog-empty-icon">
                    🥚
                </div>

                <h3>
                    仲間が見つかりません
                </h3>

                <p>
                    検索する名前や絞り込みを変えてみてね。
                </p>

            </div>

        </section>

    `;

    screen
        .querySelector('[data-catalog-mode="emblems"]')
        ?.addEventListener(
            "click",
            () => showEmblemCollection(screen)
        );

    const searchBox =
        screen.querySelector("#catalogSearchBox");

    const categoryFilter =
        screen.querySelector("#catalogCategoryFilter");

    const statusFilter =
        screen.querySelector("#catalogStatusFilter");

    const catalogList =
        screen.querySelector("#catalogList");

    const resultInfo =
        screen.querySelector("#catalogResultInfo");

    const emptyArea =
        screen.querySelector("#catalogEmpty");

    setCategoryOptions({
        select: categoryFilter,
        catalog
    });

    drawCatalog({
        catalog,
        save,
        discoveredNumbers,
        searchBox,
        categoryFilter,
        statusFilter,
        catalogList,
        resultInfo,
        emptyArea
    });

    searchBox?.addEventListener(
        "input",
        () => {

            drawCatalog({
                catalog,
                save,
                discoveredNumbers,
                searchBox,
                categoryFilter,
                statusFilter,
                catalogList,
                resultInfo,
                emptyArea
            });

        }
    );

    categoryFilter?.addEventListener(
        "change",
        () => {

            drawCatalog({
                catalog,
                save,
                discoveredNumbers,
                searchBox,
                categoryFilter,
                statusFilter,
                catalogList,
                resultInfo,
                emptyArea
            });

        }
    );

    statusFilter?.addEventListener(
        "change",
        () => {

            drawCatalog({
                catalog,
                save,
                discoveredNumbers,
                searchBox,
                categoryFilter,
                statusFilter,
                catalogList,
                resultInfo,
                emptyArea
            });

        }
    );

}

// =====================================
// エンブレムコレクション（テスト版）
// =====================================

// =====================================
// エンブレムコレクション
// =====================================

// =====================================
// エンブレムコレクション
// 取得済みのみ・1ページ6個
// =====================================

function showEmblemCollection(screen) {

    const save = getSave();

    const savedEmblems =
        Array.isArray(save.emblems)
            ? save.emblems.filter(
                emblem =>
                    emblem &&
                    typeof emblem === "object"
            )
            : [];

    const emblemMasters =
        Array.isArray(window.MASTER?.emblems)
            ? window.MASTER.emblems
            : [];

const collection = isEmblemTestMode()
    ? emblemMasters.map(master => {

        const stages =
            Array.isArray(master.stages)
                ? [...master.stages].sort(
                    (a, b) =>
                        Number(a.stage) -
                        Number(b.stage)
                )
                : [];

        const currentStage =
            stages[stages.length - 1];

        if (!currentStage) {
            return null;
        }

        return {
            id: master.id,
            name: master.name,
            rank: currentStage.rank ?? "",
            rankName: currentStage.rankName ?? "",
            image: currentStage.image ?? ""
        };

    }).filter(Boolean)

    : savedEmblems
        .map(saved => {

            const master =
                emblemMasters.find(
                    item =>
                        item.id === saved.id ||
                        item.typeId === saved.typeId ||
                        item.id === saved.typeId ||
                        item.typeId === saved.id
                );

            if (!master) {
                return null;
            }

            const savedStage =
                Number(saved.stage) || 0;

            const stages =
                Array.isArray(master.stages)
                    ? [...master.stages].sort(
                        (a, b) =>
                            Number(a.stage) -
                            Number(b.stage)
                    )
                    : [];

            const currentStage =
                [...stages]
                    .reverse()
                    .find(
                        stage =>
                            Number(stage.stage) <= savedStage
                    );

            if (!currentStage) {
                return null;
            }

            return {
                id: master.id,
                name: master.name,
                rank: currentStage.rank ?? "",
                rankName: currentStage.rankName ?? "",
                image: currentStage.image ?? ""
            };

        })
        .filter(Boolean);
    const PAGE_SIZE = 6;

    const totalPages =
        Math.max(
            1,
            Math.ceil(collection.length / PAGE_SIZE)
        );

    let currentPage = 1;

    screen.innerHTML = `
        <section class="encyclopedia-page emblem-collection-page">

            <nav
                class="catalog-mode-tabs"
                aria-label="図鑑の表示切替"
            >
                <button
                    type="button"
                    class="catalog-mode-tab"
                    data-catalog-mode="catalog"
                >
                    いきもの図鑑
                </button>

                <button
                    type="button"
                    class="catalog-mode-tab active"
                    data-catalog-mode="emblem"
                >
                    エンブレム
                </button>
            </nav>

            <section class="emblem-sanctuary">

                <div class="emblem-sanctuary-light"></div>

                <header class="emblem-sanctuary-header">

                    <div>
                        <span class="emblem-sanctuary-mark">
                            ◆
                        </span>

                        <strong>
                            エンブレムの聖域
                        </strong>
                    </div>

                    <span class="emblem-sanctuary-count">
                        獲得数 ${collection.length}
                    </span>

                </header>

                <div
                    class="emblem-sanctuary-grid"
                    id="emblemSanctuaryGrid"
                ></div>

                <div
                    class="emblem-page-controls"
                    id="emblemPageControls"
                ></div>

            </section>

        </section>
    `;

    const grid =
        screen.querySelector("#emblemSanctuaryGrid");

    const pageControls =
        screen.querySelector("#emblemPageControls");

    function drawPage() {

        if (!grid || !pageControls) {
            return;
        }

        const start =
            (currentPage - 1) * PAGE_SIZE;

        const pageItems =
            collection.slice(
                start,
                start + PAGE_SIZE
            );

        if (pageItems.length === 0) {

            grid.innerHTML = `
                <div class="emblem-sanctuary-empty">

                    <span class="emblem-sanctuary-empty-light">
                        ✦
                    </span>

                    <strong>
                        まだ聖域は静かです
                    </strong>

                    <small>
                        エンブレムを手に入れると
                        この場所に現れるよ
                    </small>

                </div>
            `;

        } else {

            grid.innerHTML =
                pageItems
                    .map(item => `
                        <article
                            class="
                                emblem-sanctuary-item
                                emblem-rank-${item.rank}
                            "
                        >

                            <div class="emblem-sanctuary-aura"></div>

                            <div class="emblem-sanctuary-pedestal">

                                <div class="emblem-sanctuary-rune"></div>

                                <img
                                    src="${item.image}"
                                    alt="${item.name}のエンブレム"
                                    class="emblem-sanctuary-image"
                                >

                            </div>

                            <div class="emblem-sanctuary-info">

                                <strong>
                                    ${item.name}
                                </strong>

                                <span>
                                    ${item.rankName}
                                </span>

                            </div>

                        </article>
                    `)
                    .join("");
        }

        if (totalPages <= 1) {

            pageControls.innerHTML = "";
            return;
        }

        pageControls.innerHTML = `
            <button
                type="button"
                class="emblem-page-button"
                data-emblem-page="prev"
                ${currentPage === 1 ? "disabled" : ""}
            >
                ◀
            </button>

            <span class="emblem-page-number">
                ${currentPage} / ${totalPages}
            </span>

            <button
                type="button"
                class="emblem-page-button"
                data-emblem-page="next"
                ${currentPage === totalPages ? "disabled" : ""}
            >
                ▶
            </button>
        `;

        pageControls
            .querySelector('[data-emblem-page="prev"]')
            ?.addEventListener("click", () => {

                if (currentPage <= 1) {
                    return;
                }

                currentPage -= 1;
                drawPage();
            });

        pageControls
            .querySelector('[data-emblem-page="next"]')
            ?.addEventListener("click", () => {

                if (currentPage >= totalPages) {
                    return;
                }

                currentPage += 1;
                drawPage();
            });
    }

    screen
        .querySelector('[data-catalog-mode="catalog"]')
        ?.addEventListener("click", () => {
            showCatalog(screen);
        });

    drawPage();
}// 図鑑カード一覧を描画
// =====================================

function drawCatalog({

    catalog,
    save,
    discoveredNumbers,
    searchBox,
    categoryFilter,
    statusFilter,
    catalogList,
    resultInfo,
    emptyArea

}) {

    if (!catalogList) {
        return;
    }

    const keyword =
        String(searchBox?.value ?? "")
            .trim()
            .toLowerCase();

    const selectedCategory =
        String(categoryFilter?.value ?? "");

    const selectedStatus =
        String(statusFilter?.value ?? "");

    const filteredCatalog =
        catalog.filter(item => {

            const number =
                Number(item?.no);

            const found =
                discoveredNumbers.includes(number);

            const itemName =
                found
                    ? String(item?.name ?? "")
                        .toLowerCase()
                    : "";

            const matchesName =
                !keyword ||
                itemName.includes(keyword);

            const matchesCategory =
                !selectedCategory ||
                String(item?.category ?? "その他") ===
                selectedCategory;

            const matchesStatus =
                !selectedStatus ||
                (
                    selectedStatus === "found" &&
                    found
                ) ||
                (
                    selectedStatus === "unknown" &&
                    !found
                );

            return (
                matchesName &&
                matchesCategory &&
                matchesStatus
            );

        });

    catalogList.innerHTML = "";

    if (resultInfo) {

        resultInfo.textContent =
            `${filteredCatalog.length}種類を表示中`;

    }

    if (emptyArea) {

        emptyArea.hidden =
            filteredCatalog.length !== 0;

    }

    catalogList.hidden =
        filteredCatalog.length === 0;

 filteredCatalog.forEach(item => {

    const number =
        Number(item?.no);

    const savedCard =
        Array.isArray(save?.discoveredCards)
            ? save.discoveredCards.find(card =>
                Number(card?.no) === number
            )
            : null;

    const found =
        Boolean(savedCard) ||
        discoveredNumbers.includes(number);

    const displayItem =
    savedCard
        ? {
            ...item,
            ...savedCard,
            description:
                savedCard.description ||
                `${savedCard.name}の特徴や見つかる場所、季節などを表示します。`
        }
        : item;

    const card =
        createCatalogCard({
            item: displayItem,
            found,
            save
        });

    catalogList.appendChild(card);

});

}
// =====================================
// PART2
// カテゴリー・発見判定・カード作成
// =====================================

function setCategoryOptions({

    select,
    catalog

}){

    if(!select){
        return;
    }

    const categories = [
        ...new Set(
            catalog.map(item =>
                item.category ?? "その他"
            )
        )
    ].sort();

    categories.forEach(category=>{

        const option =
            document.createElement("option");

        option.value = category;
        option.textContent = category;

        select.appendChild(option);

    });

}

// =====================================
// 発見済みNo取得
// =====================================

function getDiscoveredNumbers(save){

    if(
        !Array.isArray(save?.discovered)
    ){
        return [];
    }

    return save.discovered
        .map(Number)
        .filter(Number.isFinite);

}

// =====================================
// 図鑑完成率
// =====================================

function getProgressPercent(

    discovered,
    total

){

    if(total===0){
        return 0;
    }

    return Math.round(
        discovered/total*100
    );

}

// =====================================
// 図鑑カード
// =====================================

function getCreatureSizeClass(creatureNo) {

    const extraCompactNumbers = [
        "005",
        "006",
        "053",
        "064",
        "065"
    ];

    const compactNumbers = [
        "015",
        "016",
        "021",
        "063"
    ];

    const reducedNumbers = [
        "007",
        "008",
        "011",
        "012",
        "014",
        "017",
        "018",
        "019",
        "020",
        "022",
        "023",
        "024",
        "025",
        "026",
        "027",
        "028",
        "029",
        "032",
        "033",
        "034",
        "035",
        "036",
        "037",
        "045",
        "046",
        "047",
        "048",
        "049",
        "050",
        "051",
        "052",
        "054",
        "055",
        "061",
        "062",
        "066",
        "067",
        "069",
        "075",
        "089",
        "091",
        "095",
        "096",
        "099",
        "100"
    ];

    if (
        extraCompactNumbers.includes(
            creatureNo
        )
    ) {

        return "catalog-card-creature-extra-compact";
    }

    if (
        compactNumbers.includes(
            creatureNo
        )
    ) {

        return "catalog-card-creature-compact";
    }

    if (
        reducedNumbers.includes(
            creatureNo
        )
    ) {

        return "catalog-card-creature-reduced";
    }

    return "";
}

function getCreaturePositionClass(creatureNo) {

    const raisedNumbers = [
        "006",
        "007",
        "008",
        "009",
        "011",
        "012",
        "032",
        "033",
        "034",
        "035",
        "036",
        "045",
        "046",
        "047",
        "048",
        "049",
        "050",
        "051",
        "052",
        "053",
        "054",
        "055",
        "062",
        "063",
        "064",
        "065",
        "066",
        "067",
        "068",
        "069",
        "070",
        "075",
        "085",
        "089",
        "091",
        "095",
        "096",
        "099"
    ];

    if (
        raisedNumbers.includes(
            creatureNo
        )
    ) {

        return "catalog-card-creature-raised";
    }

    return "";
}

export function createCatalogCard({
    item,
    found,
    save

}){

    const card =
        document.createElement("button");

    card.type="button";

    card.className =
        `catalog-card ${
            found
                ? "found"
                : "unknown"
        }`;

        const creatureNo =
    String(item.no).padStart(3, "0");

const image = found
    ? `./assets/cards/creatures/${creatureNo}.png`
    : `../assets/cards/creatures/${creatureNo}.png`;

card.innerHTML = `

    <div class="catalog-card-shell ${
    found
        ? `rarity-card-${String(item?.rarity ?? "C").toLowerCase()}`
        : "catalog-card-locked"
}">

${
    found
        ? `
            <img
                class="catalog-card-frame"
                src="./assets/frames/${getTribeEmblem(item)}.png"                alt=""
                aria-hidden="true"
            >
        `
        : ""
}

        <div class="catalog-card-top">

    ${
        found
            ? `
                <img
                    class="catalog-card-rank-image"
                    src="./assets/rarity/rarity_${String(item?.rarity ?? "C").toLowerCase()}.png"
                    alt="${rarityText(item.rarity)}"
                >
            `
            : ""
    }

    <div class="catalog-card-number">
        No.${creatureNo}
    </div>

</div>


       <div class="catalog-card-art-area">
        ${
    found
        ? `
            <img
                class="catalog-tribe-emblem"
                src="./assets/emblems/tribe/${getTribeEmblem(item)}_locked.png"
                alt=""
                aria-hidden="true"
            >
        `
        : ""
}

            <img
                src="${image}"
                alt="${found ? item.name : '未発見の生き物'}"
                loading="lazy"
                class="${
                    found
                        ? `catalog-card-creature ${getCreatureSizeClass(creatureNo)} ${getCreaturePositionClass(creatureNo)}`
                        : 'catalog-real-image-unknown'
                }"
                onerror="
                    this.onerror=null;
                    this.src='${DEFAULT_IMAGE}';
                "
            >

        </div>

<div class="catalog-card-nameplate ${
    found &&
    String(item.name ?? "").length >= 10
        ? "catalog-card-nameplate-long"
        : ""
}">            ${found ? item.name : "？？？"}
        </div>
${found ? `
    <div class="catalog-card-bottom">
        <div class="catalog-discoverer">

    <div class="catalog-info-icon">
        ●
    </div>

    <div class="catalog-info-text">
        <span class="catalog-info-label">発見者</span>
        <strong>いきものマスター</strong>
    </div>

</div>

<div class="catalog-info-divider"></div>

<div class="catalog-type-info">

    <div class="catalog-type-icon">
        ◇
    </div>

    <div class="catalog-info-text">
        <span class="catalog-info-label">タイプ</span>
        <strong>${getTypeName(item)}</strong>
    </div>

</div>
` : ""}

    </div>

`;

    card.addEventListener(

        "click",

        ()=>{

            if(found){

                showDetail(item);

            }else{

                showUnknownDetail(item);

            }

        }

    );

    return card;

}
// =====================================
// PART3
// 未発見詳細・発見済み詳細
// =====================================

// =====================================
// 未発見カードの詳細
// =====================================

function showUnknownDetail(item){

    const overlay =
        document.createElement("div");

    overlay.className =
        "catalog-detail-overlay";

    overlay.innerHTML = `

        <div class="catalog-detail-panel">

            <button
                type="button"
                class="catalog-detail-close"
                aria-label="閉じる"
            >
                ×
            </button>

            <div class="unknown-detail-content">

                <div class="unknown-detail-number">

                    No.${String(item?.no ?? "")
                        .padStart(3,"0")}

                </div>

                <div class="unknown-detail-egg">

                    🥚

                </div>

                <h2>

                    まだ見つけていない生き物

                </h2>

                <p>

                    カメラで生き物を見つけると、
                    この図鑑に登録されるよ！

                </p>

                <div class="unknown-detail-hint">

                    <span>
                        ヒント
                    </span>

                    <strong>
                        ${item?.category ?? "生き物"}
                    </strong>

                </div>

            </div>

        </div>

    `;

    document.body.appendChild(overlay);

    const closeButton =
        overlay.querySelector(
            ".catalog-detail-close"
        );

    closeButton?.addEventListener(
        "click",
        ()=>{
            overlay.remove();
        }
    );

    overlay.addEventListener(
        "click",
        event=>{

            if(event.target===overlay){
                overlay.remove();
            }

        }
    );

}

// =====================================
// 発見済みカードの詳細
// =====================================

function showDetail(item){

    const overlay =
        document.createElement("div");

    overlay.className =
        "catalog-detail-overlay";

   const realImage =
    getSafeImage(
        item?.photo,
        item?.realImage,
        item?.image
    );

   const illustrationImage =
    getSafeImage(
        item?.cardImage,
        item?.illustration,
        item?.image
    );

    overlay.innerHTML = `

        <div class="catalog-detail-panel">

            <button
                type="button"
                class="catalog-detail-close"
                aria-label="閉じる"
            >
                ×
            </button>

            <div class="catalog-detail-header">

                <div class="catalog-detail-number">

                    No.${String(item?.no ?? "")
                        .padStart(3,"0")}

                </div>

                <div
                    class="
                        catalog-detail-rarity
                        rarity-${String(
                            item?.rarity ?? "C"
                        ).toLowerCase()}
                    "
                >

                    ${rarityText(item?.rarity)}

                </div>

            </div>

            <h2 class="catalog-detail-name">

                ${escapeHtml(
                    item?.name ?? "名前なし"
                )}

            </h2>

            <div class="catalog-detail-images">

                <div class="catalog-detail-image-box">

                    <span class="catalog-detail-image-label">

                        ほんもの

                    </span>

                    <img
                        src="${escapeAttribute(realImage)}"
                        alt="${escapeAttribute(
                            item?.name ?? "生き物"
                        )}の写真"
                        onerror="
                            this.onerror=null;
                            this.src='${DEFAULT_IMAGE}';
                        "
                    >

                </div>

                <div class="catalog-detail-image-box">

                    <span class="catalog-detail-image-label">

                        カード

                    </span>

                    <img
                        src="${escapeAttribute(
                            illustrationImage
                        )}"
                        alt="${escapeAttribute(
                            item?.name ?? "生き物"
                        )}のイラスト"
                        onerror="
                            this.onerror=null;
                            this.src='${DEFAULT_IMAGE}';
                        "
                    >

                </div>

            </div>

            <div class="catalog-detail-tags">

                <span class="catalog-detail-tag">

                    ${escapeHtml(
                        item?.category ?? "その他"
                    )}

                </span>

                ${
                    item?.type

                    ?`

                        <span class="catalog-detail-tag">

                            ${escapeHtml(item.type)}

                        </span>

                    `

                    :""
                }

            </div>

            <div class="catalog-detail-description">

                <h3>
                    どんないきもの？
                </h3>

                <p>

                    ${escapeHtml(
                        item?.description ??
                        item?.text ??
                        "まだ説明は登録されていません。"
                    )}

                </p>

            </div>

            ${createDetailInformation(item)}

        </div>

    `;

    document.body.appendChild(overlay);

    const closeButton =
        overlay.querySelector(
            ".catalog-detail-close"
        );

    closeButton?.addEventListener(
        "click",
        ()=>{
            overlay.remove();
        }
    );

    overlay.addEventListener(
        "click",
        event=>{

            if(event.target===overlay){
                overlay.remove();
            }

        }
    );

}
// =====================================
// PART4
// 詳細情報・共通関数
// =====================================

// =====================================
// 詳細情報テーブル
// =====================================

function createDetailInformation(item){

    return `

        <div class="catalog-detail-info">

            ${detailRow("No", item?.no)}

            ${detailRow(
                "カテゴリー",
                item?.category ?? "-"
            )}

            ${detailRow(
                "タイプ",
                item?.type ?? "-"
            )}

            ${detailRow(
                "レア度",
                rarityText(item?.rarity)
            )}

        </div>

    `;

}

// =====================================
// 1行
// =====================================

function detailRow(title,value){

    return `

        <div class="catalog-detail-row">

            <span>

                ${escapeHtml(title)}

            </span>

            <strong>

                ${escapeHtml(
                    String(value ?? "-")
                )}

            </strong>

        </div>

    `;

}

// =====================================
// レア度表示
// =====================================
function getTypeName(item){

    const typeId =
        String(item?.typeId ?? "");

    const types =
    Array.isArray(window.MASTER?.type)
        ? window.MASTER.type
        : [];

    const type =
        types.find(
            entry =>
                String(entry?.id ?? "") === typeId
        );

    return type?.name ?? "-";
}
function getTribeEmblem(item){

    const attribute =
        String(item?.attribute ?? "");

    const validAttributes = [
        "mushi",
        "mizu",
        "sora",
        "daichi",
        "kemono",
        "mori",
        "kodama"
    ];

    return validAttributes.includes(attribute)
        ? attribute
        : "kodama";
}
function rarityText(rarity){

    switch(String(rarity ?? "").toUpperCase()){

        case "S":
            return "S";

        case "A":
            return "A";

        case "B":
            return "B";

        default:
            return "C";

    }

}

// =====================================
// HTMLエスケープ
// =====================================

function escapeHtml(text){

    return String(text ?? "")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#39;");

}

// =====================================
// 属性エスケープ
// =====================================

function escapeAttribute(text){
    

    return escapeHtml(text);

}
// =====================================
// PART5
// 図鑑画面のデザイン
// =====================================

addCatalogStyles();

function addCatalogStyles(){

    if(
        document.getElementById(
            "catalog-screen-styles"
        )
    ){
        return;
    }

    const style =
        document.createElement("style");

    style.id =
        "catalog-screen-styles";

    style.textContent = `

        .encyclopedia-page{
            width:100%;
            max-width:1100px;
            margin:0 auto;
            padding:
                16px
                14px
                calc(
                    110px +
                    env(safe-area-inset-bottom)
                );
            box-sizing:border-box;
        }

        .catalog-mode-tabs{
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:8px;
            padding:6px;
            margin-bottom:18px;
            border:1px solid rgba(96,76,44,.18);
            border-radius:18px;
            background:rgba(255,255,255,.76);
            box-shadow:0 8px 24px rgba(65,46,24,.08);
        }

        .catalog-mode-tab{
            min-height:46px;
            border:0;
            border-radius:13px;
            background:transparent;
            color:#655943;
            font:inherit;
            font-weight:800;
            cursor:pointer;
        }

        .catalog-mode-tab.active{
            color:#ffffff;
            background:linear-gradient(145deg,#315a43,#173c2b);
            box-shadow:0 6px 14px rgba(24,62,44,.24);
        }

        .emblem-collection-page{
            min-height:100%;
        }

        .emblem-title-icon{
            background:linear-gradient(145deg,#fff4cb,#d7a743);
        }

        .emblem-count{
            gap:5px;
        }

        .emblem-test-notice{
            margin:0 0 14px;
            padding:10px 14px;
            border:1px solid rgba(185,139,58,.32);
            border-radius:14px;
            color:#715323;
            background:linear-gradient(145deg,#fffaf0,#fff1c9);
            font-size:13px;
            font-weight:700;
            text-align:center;
        }

        .emblem-rank-tabs{
            display:flex;
            justify-content:center;
            gap:10px;
            margin-bottom:18px;
        }

        .emblem-rank-button{
            min-width:78px;
            min-height:42px;
            border:1px solid rgba(86,67,40,.22);
            border-radius:999px;
            color:#5e513e;
            background:#ffffff;
            font:inherit;
            font-weight:900;
            cursor:pointer;
            box-shadow:0 5px 13px rgba(46,35,20,.08);
        }

        .emblem-rank-button.active{
            color:#ffffff;
            border-color:transparent;
            background:linear-gradient(145deg,#9b6a32,#5b381c);
            box-shadow:0 7px 16px rgba(94,57,27,.24);
        }

        .emblem-grid{
            display:grid;
            grid-template-columns:repeat(2,minmax(0,1fr));
            gap:14px;
        }

        .emblem-card{
            overflow:hidden;
            border:1px solid rgba(89,69,40,.18);
            border-radius:20px;
            background:
                radial-gradient(circle at 50% 35%,rgba(63,88,73,.20),transparent 54%),
                linear-gradient(155deg,#18221d,#0c120f);
            box-shadow:0 10px 24px rgba(26,23,17,.18);
        }

        .emblem-stage{
            position:relative;
            width:100%;
            aspect-ratio:1/1;
            overflow:hidden;
        }

        .emblem-type-art,
        .emblem-frame-art{
            position:absolute;
            object-fit:contain;
            pointer-events:none;
            user-select:none;
        }

        .emblem-type-art{
            z-index:1;
            width:74%;
            height:74%;
            left:13%;
            top:10%;
            filter:drop-shadow(0 10px 8px rgba(0,0,0,.45));
        }

        .emblem-frame-art{
            z-index:2;
            inset:0;
            width:100%;
            height:100%;
        }

        .emblem-stone-art{
            position:absolute;
            z-index:3;
            width:18%;
            height:23%;
            left:41%;
            bottom:7%;
            object-fit:contain;
            pointer-events:none;
            user-select:none;
            filter:drop-shadow(0 4px 5px rgba(0,0,0,.55));
        }

        .emblem-card-info{
            position:relative;
            z-index:4;
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
            margin-top:-8px;
            padding:10px 13px 13px;
            color:#ffffff;
        }

        .emblem-card-info strong{
            font-size:15px;
        }

        .emblem-card-info span{
            padding:4px 8px;
            border-radius:999px;
            color:#f8e8b9;
            background:rgba(255,255,255,.10);
            font-size:11px;
            font-weight:800;
        }

        @media(min-width:760px){
            .emblem-grid{
                grid-template-columns:repeat(3,minmax(0,1fr));
            }
        }

        .encyclopedia-header{
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:12px;
            margin-bottom:16px;
        }

        .encyclopedia-title-area{
            display:flex;
            align-items:center;
            gap:10px;
        }

        .encyclopedia-title-icon{
            display:flex;
            align-items:center;
            justify-content:center;
            width:48px;
            height:48px;
            flex-shrink:0;
            border-radius:16px;
            background:#ffffff;
            font-size:26px;
            box-shadow:
                0 5px 15px
                rgba(0,0,0,0.08);
        }

        .encyclopedia-title-area h2{
            margin:0;
            font-size:22px;
            line-height:1.2;
        }

        .encyclopedia-title-area p{
            margin:4px 0 0;
            font-size:12px;
            opacity:0.7;
        }

        .encyclopedia-count{
            display:flex;
            align-items:flex-end;
            justify-content:center;
            min-width:82px;
            padding:10px 12px;
            border-radius:16px;
            background:#ffffff;
            box-shadow:
                0 5px 15px
                rgba(0,0,0,0.08);
        }

        .encyclopedia-count strong{
            font-size:23px;
            line-height:1;
        }

        .encyclopedia-count span{
            margin-left:3px;
            font-size:12px;
            opacity:0.7;
        }

        .encyclopedia-progress-area{
            margin-bottom:16px;
            padding:14px;
            border-radius:18px;
            background:#ffffff;
            box-shadow:
                0 5px 18px
                rgba(0,0,0,0.07);
        }

        .encyclopedia-progress-info{
            display:flex;
            align-items:center;
            justify-content:space-between;
            margin-bottom:8px;
            font-size:13px;
        }

        .encyclopedia-progress-track{
            width:100%;
            height:12px;
            overflow:hidden;
            border-radius:999px;
            background:#e8e8e8;
        }

        .encyclopedia-progress-bar{
            height:100%;
            min-width:0;
            border-radius:999px;
            background:
                linear-gradient(
                    90deg,
                    #49c774,
                    #ffcf3e
                );
            transition:width 0.3s ease;
        }

        .encyclopedia-search-area{
            display:grid;
            grid-template-columns:
                minmax(180px,1fr)
                auto
                auto;
            gap:8px;
            margin-bottom:12px;
        }

        .encyclopedia-search-box{
            display:flex;
            align-items:center;
            gap:8px;
            min-height:44px;
            padding:0 12px;
            border:2px solid transparent;
            border-radius:14px;
            background:#ffffff;
            box-shadow:
                0 4px 14px
                rgba(0,0,0,0.06);
        }

        .encyclopedia-search-box:focus-within{
            border-color:#66c987;
        }

        .encyclopedia-search{
            width:100%;
            min-width:0;
            border:0;
            outline:0;
            background:transparent;
            color:inherit;
            font-size:15px;
        }

        .encyclopedia-filter{
            min-height:44px;
            padding:0 12px;
            border:0;
            border-radius:14px;
            outline:0;
            background:#ffffff;
            color:inherit;
            font-size:13px;
            box-shadow:
                0 4px 14px
                rgba(0,0,0,0.06);
        }

        .catalog-result-info{
            margin:0 2px 10px;
            font-size:12px;
            opacity:0.7;
        }

        .catalog-grid{
            display:grid;
            grid-template-columns:
                repeat(
                    auto-fill,
                    minmax(135px,1fr)
                );
            gap:12px;
        }

        .catalog-card{
            position:relative;
            display:flex;
            flex-direction:column;
            align-items:stretch;
            min-width:0;
            padding:9px;
            overflow:hidden;
            border:0;
            border-radius:18px;
            background:#ffffff;
            color:inherit;
            font:inherit;
            text-align:left;
            cursor:pointer;
            box-shadow:
                0 5px 16px
                rgba(0,0,0,0.09);
            transition:
                transform 0.15s ease,
                box-shadow 0.15s ease;
        }

.catalog-card.found{
    background:transparent;
    box-shadow:none;
    padding:0;
    overflow:visible;
}

        .catalog-card:active{
            transform:scale(0.97);
        }

        .catalog-card.found:hover{
           transform:none;
           box-shadow:none;
        }

        .catalog-card.unknown{
            opacity:0.82;
        }

        .catalog-number{
            min-height:18px;
            margin-bottom:6px;
            font-size:11px;
            font-weight:700;
            opacity:0.72;
        }

        .catalog-image{
            position:relative;
            width:100%;
            aspect-ratio:1 / 1;
            overflow:hidden;
            border-radius:13px;
            background:#f1f3f2;
        }
         .catalog-card.found .catalog-image{
    background:transparent;
}   

        .catalog-image img{
            display:block;
            width:100%;
            height:100%;
            object-fit:cover;
        }

        .catalog-real-image-found{
    filter:none;
    opacity:1;
}

.catalog-real-image-unknown{
    filter:brightness(0.55) saturate(0.65);
    opacity:0.85;
}

        .catalog-card-back{
            display:flex;
            align-items:center;
            justify-content:center;
            width:100%;
            height:100%;
            background:
                radial-gradient(
                    circle at center,
                    #f4f4f4,
                    #dcdcdc
                );
        }

        .catalog-card-back span{
            display:flex;
            align-items:center;
            justify-content:center;
            width:58px;
            height:58px;
            border-radius:50%;
            background:rgba(255,255,255,0.85);
            font-size:30px;
            font-weight:900;
        }

        .catalog-name{
    margin-top:8px;
    padding:8px 10px;
    border:2px solid rgba(90,60,20,0.65);
    border-radius:8px;
    background:linear-gradient(
        180deg,
        rgba(255,239,188,0.95),
        rgba(222,190,120,0.95)
    );
    box-shadow:
        inset 0 0 0 2px rgba(255,255,255,0.35),
        0 2px 4px rgba(0,0,0,0.18);
    overflow:hidden;
    font-size:16px;
    font-weight:900;
    line-height:1.2;
    text-align:center;
    white-space:nowrap;
    text-overflow:ellipsis;
}
.catalog-card-info{
    display:grid;
    grid-template-columns:1.4fr 0.6fr;
    gap:6px;
    margin-top:10px;
    padding:8px 6px 2px;
    border-top:1px solid rgba(0,0,0,0.12);
}

.catalog-discoverer,
.catalog-type-info{
    display:flex;
    flex-direction:column;
    gap:2px;
    min-width:0;
}

.catalog-info-label{
    font-size:9px;
    font-weight:700;
    opacity:0.65;
}

.catalog-discoverer strong,
.catalog-type-info strong{
    overflow:hidden;
    font-size:9px;
    font-weight:800;
    white-space:nowrap;
    text-overflow:ellipsis;
}

        .catalog-rarity{
            margin-top:3px;
            font-size:11px;
            font-weight:700;
            opacity:0.72;
        }

        .catalog-empty{
            padding:48px 16px;
            text-align:center;
        }

        .catalog-empty-icon{
            font-size:58px;
        }

        .catalog-empty h3{
            margin:12px 0 5px;
        }

        .catalog-empty p{
            margin:0;
            font-size:13px;
            opacity:0.7;
        }

        .catalog-detail-overlay{
            position:fixed;
            inset:0;
            z-index:20000;
            display:flex;
            align-items:center;
            justify-content:center;
            padding:
                18px
                14px
                calc(
                    18px +
                    env(safe-area-inset-bottom)
                );
            box-sizing:border-box;
            background:rgba(0,0,0,0.58);
            backdrop-filter:blur(4px);
        }

        .catalog-detail-panel{
            position:relative;
            width:100%;
            max-width:620px;
            max-height:92vh;
            overflow:auto;
            padding:22px 16px 24px;
            box-sizing:border-box;
            border-radius:24px;
            background:#ffffff;
            color:#222222;
            box-shadow:
                0 18px 50px
                rgba(0,0,0,0.28);
        }

        .catalog-detail-close{
            position:absolute;
            top:10px;
            right:10px;
            z-index:2;
            display:flex;
            align-items:center;
            justify-content:center;
            width:38px;
            height:38px;
            border:0;
            border-radius:50%;
            background:#ededed;
            color:#222222;
            font-size:25px;
            line-height:1;
            cursor:pointer;
        }

        .catalog-detail-header{
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:10px;
            padding-right:42px;
        }

        .catalog-detail-number{
            font-size:13px;
            font-weight:800;
            opacity:0.72;
        }

        .catalog-detail-rarity{
            min-width:34px;
            padding:5px 10px;
            border-radius:999px;
            text-align:center;
            font-size:13px;
            font-weight:900;
        }

        .rarity-s{
            background:#ffe38a;
        }

        .rarity-a{
            background:#f6b3ff;
        }

        .rarity-b{
            background:#9fe7ff;
        }

        .rarity-c{
            background:#c9f3c4;
        }

        .catalog-detail-name{
            margin:13px 0 16px;
            padding-right:40px;
            font-size:25px;
            line-height:1.3;
        }

        .catalog-detail-images{
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:10px;
        }

        .catalog-detail-image-box{
            position:relative;
            aspect-ratio:1 / 1;
            overflow:hidden;
            border-radius:17px;
            background:#eeeeee;
        }

        .catalog-detail-image-box img{
            display:block;
            width:100%;
            height:100%;
            object-fit:cover;
        }

        .catalog-detail-image-label{
            position:absolute;
            top:7px;
            left:7px;
            z-index:1;
            padding:4px 8px;
            border-radius:999px;
            background:rgba(255,255,255,0.88);
            font-size:10px;
            font-weight:800;
        }

        .catalog-detail-tags{
            display:flex;
            flex-wrap:wrap;
            gap:7px;
            margin-top:14px;
        }

        .catalog-detail-tag{
            padding:6px 11px;
            border-radius:999px;
            background:#eaf7ed;
            font-size:12px;
            font-weight:700;
        }

        .catalog-detail-description{
            margin-top:16px;
            padding:14px;
            border-radius:17px;
            background:#f6f7f6;
        }

        .catalog-detail-description h3{
            margin:0 0 7px;
            font-size:15px;
        }

        .catalog-detail-description p{
            margin:0;
            font-size:14px;
            line-height:1.75;
            white-space:pre-wrap;
        }

        .catalog-detail-info{
            margin-top:14px;
            overflow:hidden;
            border:1px solid #e7e7e7;
            border-radius:17px;
        }

        .catalog-detail-row{
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:14px;
            padding:11px 13px;
            border-bottom:1px solid #ededed;
            font-size:13px;
        }

        .catalog-detail-row:last-child{
            border-bottom:0;
        }

        .catalog-detail-row span{
            opacity:0.7;
        }

        .catalog-detail-row strong{
            text-align:right;
        }

        .unknown-detail-content{
            padding:30px 12px 18px;
            text-align:center;
        }

        .unknown-detail-number{
            margin-bottom:14px;
            font-size:13px;
            font-weight:800;
            opacity:0.7;
        }

        .unknown-detail-egg{
            font-size:78px;
            line-height:1;
        }

        .unknown-detail-content h2{
            margin:18px 0 8px;
            font-size:21px;
        }

        .unknown-detail-content p{
            margin:0 auto;
            max-width:340px;
            font-size:14px;
            line-height:1.7;
            opacity:0.78;
        }

        .unknown-detail-hint{
            display:inline-flex;
            align-items:center;
            gap:9px;
            margin-top:18px;
            padding:9px 14px;
            border-radius:999px;
            background:#f2f2f2;
            font-size:12px;
        }

        @media(max-width:700px){

            .encyclopedia-search-area{
                grid-template-columns:1fr 1fr;
            }

            .encyclopedia-search-box{
                grid-column:1 / -1;
            }

        }

        @media(max-width:430px){

            .encyclopedia-page{
                padding-left:10px;
                padding-right:10px;
            }

            .encyclopedia-title-area h2{
                font-size:19px;
            }

            .encyclopedia-title-area p{
                font-size:11px;
            }

            .encyclopedia-count{
                min-width:68px;
                padding:9px;
            }

            .encyclopedia-count strong{
                font-size:20px;
            }

            .catalog-grid{
                grid-template-columns:
                    repeat(2,minmax(0,1fr));
                    
                gap:9px;
            }

            .catalog-detail-images{
                gap:7px;
            }

        }
          .catalog-card-shell{
    position:relative;
    width:100%;
    min-height:100%;
    padding:8px;
    box-sizing:border-box;
    overflow:hidden;
    border-radius:16px;

    background:
        linear-gradient(
            145deg,
            #f3e7c4 0%,
            #d8c49a 48%,
            #b49a6f 100%
        );

    border:4px solid #6f5423;

    box-shadow:
        inset 0 0 0 2px #e8c96b,
        inset 0 0 0 5px rgba(55,38,15,0.28),
        0 4px 10px rgba(0,0,0,0.28);
}
 .catalog-card.found .catalog-card-shell{
    background:transparent;
    border:none;
    box-shadow:none;
}       
        .catalog-card-shell::before{
    content:"";
    position:absolute;
    inset:5px;
border:none;    border-radius:10px;
    pointer-events:none;
    z-index:20;
}
.catalog-card-number{
  position:relative;
  z-index:6;
  width:55%;
  margin:0 auto 6px;
  padding:2px 0;

  text-align:center;
  font-size:14px;
  font-weight:900;
  line-height:1.1;
  letter-spacing:0.5px;

  color:#ffd700;
  background:none;
  border:none;
  border-radius:0;
  box-shadow:none;

  -webkit-text-fill-color:#ffd700;
  -webkit-text-stroke:0.7px #000000;

  text-shadow:
    0 1px 0 #000000,
    0 0 2px #000000;
}.catalog-card-art-area{
    position:relative;
    width:100%;
    aspect-ratio:1 / 1.05;
    overflow:hidden;
    border-radius:8px;
    background:transparent;
}
.catalog-card-header{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:6px;
    margin-bottom:6px;
}

.catalog-card-header .catalog-number{
    position:absolute;
    top:16px;
    left:50%;
    transform:translateX(-50%);
    margin:0;
    min-height:0;
    z-index:6;
    font-weight:900;
}
.catalog-card-rank-image{
    position:absolute;
    top:4px;
    left:8px;
    width:50px;
    height:50px;
    object-fit:contain;
    z-index:5;
 }   
.catalog-card-creature{
    position:absolute;
    left:50%;
    top:41%;
    width:88%;
    height:88%;
    transform:translate(-50%,-50%);
    object-fit:contain !important;
    z-index:30;
}
    .catalog-card-creature-reduced{
    width:82%;
    height:82%;
}

.catalog-card-creature-compact{
    width:78%;
    height:78%;
}
   .catalog-card-creature-extra-compact{
    width:72%;
    height:72%;
} 
    .catalog-card-creature-raised{
    top:35%;
}
 .catalog-card-frame{
    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    object-fit:fill;
    z-index:0;
    pointer-events:none;
}   
.catalog-card-nameplate{
  position:absolute;
  left:10%;
  right:10%;
  top:77%;
  z-index:40;

  text-align:center;
  font-size:16px;
  font-weight:900;
  line-height:1.1;
  color:#2d210e;

  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

.catalog-card-nameplate-long{
    left:2%;
    right:2%;
    font-size:12px;
    letter-spacing:-0.5px;
}
.catalog-card-bottom{
  position:absolute;
  inset:0;
  z-index:6;
  pointer-events:none;
}

.catalog-discoverer{
  position:absolute;
left:auto;
right:8%;
top:auto;
bottom:3%;
width:32%;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:5px;
}

.catalog-discoverer .catalog-info-icon{
  display:none;
}

.catalog-discoverer .catalog-info-text{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:0;
}

.catalog-discoverer .catalog-info-label{
  font-size:5px;
  font-weight:700;
  line-height:1;
  color:#fff0ad;
  opacity:0.8;
}

.catalog-discoverer strong{
  font-size:6px;
  font-weight:900;
  line-height:1.1;
  color:#fff0ad;
  white-space:nowrap;
  text-shadow:0 1px 2px rgba(0,0,0,0.9);
}
.catalog-info-divider{
  display:none;
}

.catalog-type-info{
  position:absolute;
  left:15%;
  bottom:3%;
  width:30%;

  display:flex;
  align-items:center;
  justify-content:center;
}

.catalog-type-info .catalog-type-icon{
  display:none;
}

.catalog-type-info .catalog-info-text{
  display:flex;
  flex-direction:row;
  align-items:center;
  justify-content:center;
  gap:3px;
}

.catalog-type-info .catalog-info-label{
  display:none;
}

.catalog-type-info strong{
  font-size:10px;
  font-weight:900;
  color:#fff0ad;
  text-shadow:0 1px 2px rgba(0,0,0,0.9);
}.catalog-tribe-emblem{
    position:absolute;
    left:50%;
    top:39%;
    width:80%;
    height:80%;
    object-fit:contain;
    transform:translate(-50%,-50%);
    opacity:0.65;
    pointer-events:none;
    z-index:1;
}
.catalog-image{
    position:relative;
    z-index:1;
}

.catalog-card-header,
.catalog-name,
.catalog-rarity{
    position:relative;
    z-index:2;
}

.rarity-card-s{
    background:linear-gradient(145deg,#fff3b0,#d79a16);
}

.rarity-card-a{
    background:linear-gradient(145deg,#e7f2ff,#6f98cc);
}

.rarity-card-b{
    background:linear-gradient(145deg,#e5f4dc,#76a65d);
}

.rarity-card-c{
    background:linear-gradient(145deg,#e7e1d8,#877d70);
}

.catalog-card-locked{
    background:#8a8a8a;
}


        @media(prefers-color-scheme:dark){

            .encyclopedia-title-icon,
            .encyclopedia-count,
            .encyclopedia-progress-area,
            .encyclopedia-search-box,
            .encyclopedia-filter,
            .catalog-card{
                background:#222722;
            }

            .catalog-detail-panel{
                background:#252525;
                color:#f4f4f4;
            }

            .catalog-detail-close{
                background:#414141;
                color:#ffffff;
            }

            .catalog-detail-description{
                background:#343434;
            }

            .catalog-detail-info{
                border-color:#444444;
            }

            .catalog-detail-row{
                border-color:#444444;
            }

            .catalog-detail-tag{
                background:#35513c;
            }

            .unknown-detail-hint{
                background:#3b3b3b;
            }

        }

    `;

    document.head.appendChild(style);

}
