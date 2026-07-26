/* ==========================================
   いきものマスター Ver9
   spirit.js
========================================== */

const DEFAULT_SPIRIT = {

    name: "",

    currentTitle: "たまご",

    titles: ["たまご"],

    species: [],

    specialTitles: []

};

let spirit = loadSpirit();

/* ==========================================
   保存
========================================== */

function saveSpirit() {

    localStorage.setItem(
        "ikimono_spirit",
        JSON.stringify(spirit)
    );

}

/* ==========================================
   読み込み
========================================== */

function loadSpirit() {

    const save =
        localStorage.getItem("ikimono_spirit");

    if (!save) {

        return structuredClone(DEFAULT_SPIRIT);

    }

    try {

        return JSON.parse(save);

    } catch {

        return structuredClone(DEFAULT_SPIRIT);

    }

}
/* ==========================================
   名前
========================================== */

function setSpiritName(name){

    spirit.name = name;

    saveSpirit();

}

/* ==========================================
   称号
========================================== */

function addTitle(title){

    if(
        !spirit.titles.includes(title)
    ){

        spirit.titles.push(title);

    }

    spirit.currentTitle = title;

    saveSpirit();

}

/* ==========================================
   特殊称号
========================================== */

function addSpecialTitle(title){

    if(
        !spirit.specialTitles.includes(title)
    ){

        spirit.specialTitles.push(title);

    }

    saveSpirit();

}
/* ==========================================
   種類登録
========================================== */

function addSpecies(category) {

    if (!category) return;

    if (!spirit.species.includes(category)) {

        spirit.species.push(category);

        saveSpirit();

    }

}

function getSpeciesCount() {

    return spirit.species.length;

}
/* ==========================================
   精霊更新
========================================== */

function updateSpirit() {

    const count = getSpeciesCount();

    // 3種類で羽化
    if (count >= 3 && spirit.currentTitle === "たまご") {

        addTitle("誕生");

        if (typeof showHatchEvent === "function") {

            showHatchEvent();

        }

    }

    // 表示更新
    const nameEl = document.getElementById("homeSpiritName");
    const titleEl = document.getElementById("homeSpiritTitle");

    if (nameEl) {

        nameEl.textContent = spirit.name || "？？？";

    }

    if (titleEl) {

        titleEl.textContent = spirit.currentTitle;

    }

}