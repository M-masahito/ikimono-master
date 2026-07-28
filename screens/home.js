// =====================================
// screens/home.js Ver3
// PART1
// =====================================

import { getSave } from "../system/storage.js";
import { openScreen } from "../app.js";

export function showHome(screen) {

    const save = getSave();

    const discovered =
        save.discovered?.length ?? 0;

    const spiritName =
        save.spirit?.name ?? "ふしぎなたまご";

    const progress =
        Math.min(
            (discovered / 500) * 100,
            100
        );

    // ---------------------
    // 精霊進化
    // ---------------------

    const stages = [
        {
            min:150,
            icon:"🐉",
            title:"神獣",
            message:"ぼくたちは最強の神獣になった！"
        },
        {
            min:100,
            icon:"👑",
            title:"精霊王",
            message:"もうすぐ伝説完成だね！"
        },
        {
            min:60,
            icon:"✨",
            title:"精霊",
            message:"新しい命を感じるよ！"
        },
        {
            min:30,
            icon:"🧚",
            title:"ぬし",
            message:"今日も探検しよう！"
        },
        {
            min:10,
            icon:"🌱",
            title:"のこ",
            message:"どんどん仲間を増やそう！"
        },
        {
            min:3,
            icon:"🐣",
            title:"たまご",
            message:"生まれたよ！"
        },
        {
            min:0,
            icon:"🥚",
            title:"眠り",
            message:"まだ眠っているよ…"
        }
    ];

    const currentStage =
        stages.find(
            stage => discovered >= stage.min
        );

    // ---------------------
    // 次の進化
    // ---------------------

    let nextTarget = 500;

    if(discovered < 3){
        nextTarget = 3;
    }
    else if(discovered < 10){
        nextTarget = 10;
    }
    else if(discovered < 30){
        nextTarget = 30;
    }
    else if(discovered < 60){
        nextTarget = 60;
    }
    else if(discovered < 100){
        nextTarget = 100;
    }
    else if(discovered < 150){
        nextTarget = 150;
    }

    const remain =
        Math.max(
            nextTarget - discovered,
            0
        );

    // ---------------------
    // 時間帯
    // ---------------------

    const hour =
        new Date().getHours();

    let greeting =
        "こんにちは！";

    if(hour < 6){

        greeting =
            "夜更かししてるね！";

    }
    else if(hour < 12){

        greeting =
            "おはよう！";

    }
    else if(hour < 18){

        greeting =
            "探検日和だね！";

    }
    else{

        greeting =
            "こんばんは！";

    }
        // ---------------------
    // 今日のミッション
    // ---------------------

    const missions = [

        "昆虫を1種類見つけよう！",
        "花を1種類見つけよう！",
        "鳥を探してみよう！",
        "写真を3枚撮ってみよう！",
        "まだ見つけていない生き物を探そう！",
        "精霊に話しかけてみよう！"

    ];

    const todayMission =
        missions[
            new Date().getDate() %
            missions.length
        ];

    // ---------------------
    // レベル
    // ---------------------

    const level =
        Math.max(
            1,
            Math.floor(discovered / 5) + 1
        );

    // ---------------------
    // 発見率
    // ---------------------

    const percent =
        progress.toFixed(1);

    // ---------------------
    // ホーム画面
    // ---------------------

    screen.innerHTML = `

<section class="garden-home">

<div class="garden-sky">

<div class="garden-title">

<h1>いきものマスター</h1>

<p>${greeting}</p>

</div>

<div class="garden-cloud cloud-one">☁️</div>
<div class="garden-cloud cloud-two">☁️</div>

<div class="spirit-area">

<button
id="spiritButton"
class="spirit-button"
type="button">

<span class="spirit-character">

${currentStage.icon}

</span>

<span class="spirit-name">

${spiritName}

</span>

</button>

<div
id="spiritSpeech"
class="spirit-speech">

${currentStage.message}

</div>

</div>

<div class="garden-ground">

<span class="garden-plant plant-one">🌷</span>

<span class="garden-plant plant-two">🌿</span>

<span class="garden-plant plant-three">🌼</span>

<span class="garden-tree">🌳</span>

<span class="garden-plant plant-four">🍄</span>

</div>

</div>

<div class="home-status-card">

<div>

<span class="status-label">

図鑑完成率

</span>

<strong>

${discovered} / 500

</strong>

</div>

<div class="encyclopedia-progress">

<div
class="encyclopedia-progress-bar"
style="width:${progress}%">

</div>

</div>

<p style="margin-top:8px;">

完成率

<b>${percent}%</b>

</p>

</div>

<div class="home-status-card">

<h3>

⭐ レベル ${level}

</h3>

<p>

次の進化まで

<b>

あと ${remain}種類

</b>

</p>

</div>

<div class="home-status-card">

<h3>

🎯 今日のミッション

</h3>

<p>

${todayMission}

</p>

</div>

<div class="home-main-actions">

<button

id="cameraButton"

class="home-action-button camera-action"

type="button">

<span class="action-icon">

📷

</span>

<span>

<strong>

AI判定する

</strong>

<small>

写真から生き物を調べよう

</small>

</span>

</button>

<button

id="bookButton"

class="home-action-button book-action"

type="button">

<span class="action-icon">

📖

</span>

<span>

<strong>

図鑑を見る

</strong>

<small>

発見した生き物を確認

</small>

</span>

</button>

</div>

</section>

`;
    // ---------------------
    // 要素取得
    // ---------------------

    const spiritButton =
        document.getElementById("spiritButton");

    const spiritSpeech =
        document.getElementById("spiritSpeech");

    const cameraButton =
        document.getElementById("cameraButton");

    const bookButton =
        document.getElementById("bookButton");

    // ---------------------
    // 精霊セリフ
    // ---------------------

    const messages = [

        "今日はどんな生き物に会えるかな？",

        "新しい仲間が待っているよ！",

        "図鑑を完成させよう！",

        `もう${discovered}種類見つけたね！`,

        "空を見上げると鳥がいるかも！",

        "木の下も探してみよう！",

        "草むらには昆虫がいっぱい！",

        "花にはチョウが来るよ！",

        "池にも行ってみよう！",

        "写真を撮ったら教えてね！",

        "レアな生き物が近くにいるかも！",

        "図鑑No.500まであと少し！",

        "毎日探検すると発見が増えるよ！",

        "ぼくも一緒に探すよ！",

        "今日も頑張ろう！",

        greeting,

        currentStage.message,

        remain === 0
            ? "次の進化だ！"
            : `あと${remain}種類で進化するよ！`

    ];

    // ---------------------
    // 精霊タップ
    // ---------------------

    spiritButton?.addEventListener("click", () => {

        const random = Math.floor(
            Math.random() * messages.length
        );

        spiritSpeech.textContent =
            messages[random];

        spiritButton.animate(

            [

                {
                    transform:"translateY(0px) scale(1)"
                },

                {
                    transform:"translateY(-12px) scale(1.12)"
                },

                {
                    transform:"translateY(0px) scale(1)"
                }

            ],

            {

                duration:500

            }

        );

    });

    // ---------------------
    // AI判定画面
    // ---------------------

    cameraButton?.addEventListener("click", () => {

        openScreen("camera");

    });

    // ---------------------
    // 図鑑画面
    // ---------------------

    bookButton?.addEventListener("click", () => {

        openScreen("catalog");

    });

}
