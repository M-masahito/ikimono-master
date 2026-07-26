/* ==========================================
   いきものマスター Ver9
========================================== */

const APP = {
    total: 500,
    discovered: [],
    current: null,
    spirit: {
        name: "",
        stage: 0,
        title: "たまご"
    }
};

/* ---------- 画面 ---------- */

const screens = document.querySelectorAll(".screen");

function showScreen(id){

    screens.forEach(screen=>{
        screen.classList.remove("active");
    });

    document
        .getElementById(id)
        .classList.add("active");

}

/* ---------- ボタン ---------- */

document
.querySelectorAll("[data-go]")
.forEach(btn=>{

    btn.onclick=()=>{

        showScreen(
            btn.dataset.go
        );

    };

});

/* ---------- 保存 ---------- */

function saveGame(){

    localStorage.setItem(

        "ikimonoMaster",

        JSON.stringify(APP)

    );

}

/* ---------- 読み込み ---------- */

function loadGame(){

    const data=

    localStorage.getItem(

        "ikimonoMaster"

    );

    if(data){

        Object.assign(

            APP,

            JSON.parse(data)

        );

    }

}

/* ---------- 初期化 ---------- */

window.onload=()=>{

    loadGame();

    updateHome();

};
/* ==========================================
   ホーム画面更新
========================================== */

function updateHome(){

    const owned = APP.discovered.length;

    const percent = Math.floor(
        owned / APP.total * 100
    );

    document.getElementById(
        "homeOwnedCount"
    ).textContent = owned;

    document.getElementById(
        "bookOwnedCount"
    ).textContent = owned;

    document.getElementById(
        "homeRate"
    ).textContent = percent + "%";

    document.getElementById(
        "homeRemaining"
    ).textContent =
    "あと" + (APP.total - owned) + "種類";

    document.getElementById(
        "collectionBar"
    ).style.width =
    percent + "%";

    updateSpirit();

}

/* ==========================================
   精霊更新
========================================== */

function updateSpirit(){

    const count = APP.discovered.length;

    let title = "たまご";
    let emoji = "🥚";
    let next = 3;

    if(count >= 150){

        title = "神獣";
        emoji = "🐉";
        next = 500;

    }else if(count >= 100){

        title = "精霊王";
        emoji = "👑";
        next = 150;

    }else if(count >= 50){

        title = "精霊";
        emoji = "✨";
        next = 100;

    }else if(count >= 20){

        title = "ぬし";
        emoji = "🦌";
        next = 50;

    }else if(count >= 10){

        title = "のこ";
        emoji = "🦊";
        next = 20;

    }else if(count >= 3){

        title = "誕生";
        emoji = "🐣";
        next = 10;

        if(APP.spirit.name===""){

            showHatchEvent();

        }

    }

    APP.spirit.title = title;

    document.getElementById(
        "homeSpiritTitle"
    ).textContent = title;

    document.getElementById(
        "spiritTitle"
    ).textContent = title;

    document.getElementById(
        "homeSpiritImage"
    ).textContent = emoji;

    document.getElementById(
        "spiritImage"
    ).textContent = emoji;

    document.getElementById(
        "spiritCount"
    ).textContent = count;

    document.getElementById(
        "spiritRank"
    ).textContent = title;

    document.getElementById(
        "spiritMessage"
    ).textContent =
    "次の進化まで あと " +
    Math.max(0,next-count) +
    "種類";

    document.getElementById(
        "spiritProgress"
    ).style.width =
    (count/APP.total*100)+"%";

    const name =
        APP.spirit.name || "？？？";

    document.getElementById(
        "homeSpiritName"
    ).textContent = name;

    document.getElementById(
        "spiritName"
    ).textContent = name;

    saveGame();

}
/* ==========================================
   NEW CARD GET
========================================== */

function showGetCard(card){

    const overlay =
        document.getElementById("overlay");

    const area =
        document.getElementById("getCard");

    const reward =
        document.getElementById("getReward");

    area.innerHTML = `
        <h3>No.${String(card.no).padStart(3,"0")}</h3>
        <h2>${card.name}</h2>
        <p>レア度：${card.rarity}</p>
    `;

    reward.textContent =
        "図鑑に登録されました！";

    overlay.classList.remove("hidden");

}

document
.getElementById("closeGet")
.onclick = ()=>{

    document
    .getElementById("overlay")
    .classList.add("hidden");

};

/* ==========================================
   羽化イベント
========================================== */

function showHatchEvent(){

    document
    .getElementById("hatchOverlay")
    .classList.remove("hidden");

}

document
.getElementById("saveSpiritName")
.onclick=()=>{

    const name =

    document
    .getElementById("hatchName")
    .value
    .trim();

    if(name===""){

        alert("名前を入力してください");

        return;

    }

    APP.spirit.name=name;

    document
    .getElementById("hatchOverlay")
    .classList.add("hidden");

    updateSpirit();

    saveGame();

};

/* ==========================================
   カード登録
========================================== */

function registerCard(no){

    if(APP.discovered.includes(no)){

        return;

    }

    APP.discovered.push(no);

    const card =
        MASTER_DATA.find(
            c=>c.no===no
        );

    if(card){

        showGetCard(card);

    }

    updateHome();

    saveGame();

}

/* ==========================================
   Toast
========================================== */

function showToast(text){

    const toast =
        document.getElementById("toast");

    toast.textContent=text;

    toast.classList.remove("hidden");

    setTimeout(()=>{

        toast.classList.add("hidden");

    },2000);

}
/* ==========================================
   AI判定結果登録
========================================== */

function completeIdentification(result){

    if(!result){

        alert("判定できませんでした");

        return;

    }

    const card = MASTER_DATA.find(

        c => c.name === result.name

    );

    if(!card){

        alert("図鑑データがありません");

        return;

    }

    registerCard(card.no);

    showToast(card.name + " を発見！");

}

/* ==========================================
   カードクリック
========================================== */

function openDetail(no){

    const card = MASTER_DATA.find(

        c => c.no === no

    );

    if(!card) return;

    APP.current = no;

    document.getElementById("detailNo").textContent =
        "No." + String(card.no).padStart(3,"0");

    document.getElementById("detailName").textContent =
        card.name;

    document.getElementById("detailCategory").textContent =
        card.category;

    document.getElementById("detailType").textContent =
        card.type;

    document.getElementById("detailRarity").textContent =
        card.rarity;

    document.getElementById("detailDescription").textContent =
        card.description;

    document.getElementById("detailImage").src =
        card.cardImage || "";

    showScreen("detail");

}

/* ==========================================
   読み込み後初期化
========================================== */

function initializeApp(){

    loadGame();

    updateHome();

    if(typeof renderCatalog==="function"){

        renderCatalog();

    }

}

window.onload = initializeApp;
/* ==========================================
   検索・フィルター
========================================== */

function refreshCatalog(){

    if(typeof renderCatalog==="function"){

        const keyword =
            document
            .getElementById("search")
            .value
            .trim();

        const filter =
            document
            .getElementById("filter")
            .value;

        renderCatalog(keyword,filter);

    }

}

const searchBox =
document.getElementById("search");

if(searchBox){

    searchBox.addEventListener(

        "input",

        refreshCatalog

    );

}

const filterBox =
document.getElementById("filter");

if(filterBox){

    filterBox.addEventListener(

        "change",

        refreshCatalog

    );

}

/* ==========================================
   AIボタン
========================================== */

const identifyButton =
document.getElementById("identify");

if(identifyButton){

    identifyButton.onclick=()=>{

        document
        .getElementById("loading")
        .classList.remove("hidden");

        setTimeout(()=>{

            document
            .getElementById("loading")
            .classList.add("hidden");

            alert("AI接続は次のPartで実装します");

        },1200);

    };

}

/* ==========================================
   写真プレビュー
========================================== */

const photo =
document.getElementById("photo");

if(photo){

    photo.onchange=e=>{

        const file=
        e.target.files[0];

        if(!file)return;

        const reader=
        new FileReader();

        reader.onload=()=>{

            document
            .getElementById("preview")
            .innerHTML=

            `<img
            src="${reader.result}"
            style="
            width:100%;
            height:100%;
            object-fit:cover;
            border-radius:12px;
            ">`;

            identifyButton.disabled=false;

            document
            .getElementById("aiStatus")
            .textContent=
            "AI判定できます";

        };

        reader.readAsDataURL(file);

    };

}

/* ==========================================
   自動保存
========================================== */

window.addEventListener(

    "beforeunload",

    saveGame

);