// =======================================
// 初回オープニング・遊び方
// =======================================

import { getSave, update } from "../system/storage.js";

const OPENING_KEY = "ikimonoOpeningSeen_v1";

export function showOpening({ replay = false } = {}) {
    if (!replay) {
        try {
            if (
    localStorage.getItem(OPENING_KEY) === "true" &&
    String(getSave().playerName ?? "").trim()
) {
                return Promise.resolve();
            }
        } catch (error) {
            console.warn("初回表示の確認に失敗しました。", error);
        }
    }

    return new Promise(resolve => {
        const previousFocus = document.activeElement;
        const dialog = document.createElement("dialog");

        dialog.className = "ikimono-opening";
        dialog.setAttribute("aria-label", "冒険のはじまり");

        dialog.innerHTML = `
            <style>
                .ikimono-opening{
                    position:fixed;
                    inset:0;
                    width:100%;
                    max-width:none;
                    height:100%;
                    max-height:none;
                    margin:0;
                    padding:0;
                    border:0;
                    background:#102e20;
                    color:#fff;
                    box-sizing:border-box;
                }
                .ikimono-opening::backdrop{
                    background:#102e20;
                }
                .ikimono-opening .opening-world{
                    height:100%;
                    box-sizing:border-box;
                    overflow:auto;
                    display:flex;
                    flex-direction:column;
                    align-items:center;
                    justify-content:center;
                    padding:
                        calc(24px + env(safe-area-inset-top))
                        24px
                        calc(24px + env(safe-area-inset-bottom));
                    text-align:center;
                    background:
                        linear-gradient(
                            #102e2066,
                            #102e20dd
                        ),
                        url("./assets/home-forest.png")
                        center / cover;
                }
                .ikimono-opening .opening-art{
                    width:min(54vw,240px);
                    height:min(54vw,240px);
                    object-fit:contain;
                    margin:12px 0 24px;
                    animation:openingEggFloat 3s ease-in-out infinite;
                    filter:drop-shadow(0 0 24px #ffe6a0);
                }
                .ikimono-opening .opening-copy{
                    width:min(100%,460px);
                    animation:openingCopyAppear 0.8s ease both;
                }
                .ikimono-opening h1{
                    font-size:clamp(24px,7vw,34px);
                    margin:0 0 18px;
                    color:#fff1c7;
                    text-shadow:0 2px 12px #000;
                }
                .ikimono-opening p{
                    font-size:17px;
                    line-height:1.9;
                    margin:0 0 24px;
                    text-shadow:0 2px 8px #000;
                }
                .ikimono-opening .opening-count{
                    display:block;
                    margin-bottom:14px;
                    color:#ffe6a0;
                    font-size:13px;
                    letter-spacing:2px;
                }
                .ikimono-opening button{
                    font:inherit;
                    cursor:pointer;
                }
                .ikimono-opening .opening-next{
                    min-height:52px;
                    width:min(100%,320px);
                    padding:14px 20px;
                    border:1px solid #fff0ba;
                    border-radius:28px;
                    background:linear-gradient(135deg,#fff0bb,#e6bb58);
                    color:#244532;
                    font-weight:bold;
                    box-shadow:0 4px 24px #0004;
                }
                .ikimono-opening .opening-skip{
                    margin-top:20px;
                    padding:10px 18px;
                    border:0;
                    background:transparent;
                    color:#fff;
                    text-decoration:underline;
                }
                @keyframes openingEggFloat{
                    0%,100%{transform:translateY(0);}
                    50%{transform:translateY(-12px);}
                }
                @keyframes openingCopyAppear{
                    from{opacity:0;transform:translateY(12px);}
                    to{opacity:1;transform:translateY(0);}
                }
                @media(prefers-reduced-motion:reduce){
                    .ikimono-opening .opening-art,
                    .ikimono-opening .opening-copy{
                        animation:none;
                    }
                }

                .ikimono-opening .opening-world {
                    background:
                        linear-gradient(
                            #102e2033,
                            #102e20dd
                        ),
                        url("./assets/home-forest.png")
                        center / cover;
                    transition: background-color 2s;
                }

                .ikimono-opening .opening-art {
                    transition:
                        opacity 1.8s ease,
                        filter 1.8s ease;
                }

                /* 最初の場面：森の中で光を見つける */
                .ikimono-opening[data-scene="0"] .opening-art {
                    opacity: 0;
                }

                /* 2つ目の場面：卵が姿を現す */
                .ikimono-opening[data-scene="1"] .opening-art {
                    opacity: 1;
                    filter:
                        drop-shadow(0 0 16px #fff1b8)
                        drop-shadow(0 0 36px #e6bb58);
                }

                /* 3つ目の場面：命の光がゆっくり脈打つ */
                .ikimono-opening[data-scene="2"] .opening-art {
                    animation:
                        openingEggFloat 3s ease-in-out infinite,
                        openingLifeGlow 4s ease-in-out infinite;
                }

                /* 最後の場面：タイトルと卵が輝く */
                .ikimono-opening[data-scene="3"] .opening-art {
                    filter:
                        drop-shadow(0 0 24px #fff1b8)
                        drop-shadow(0 0 48px #e6bb58);
                }

                .ikimono-opening[data-scene="3"] h1 {
                    color: #ffe6a0;
                    text-shadow:
                        0 2px 12px #000,
                        0 0 24px #e6bb5888;
                }

                @keyframes openingLifeGlow {
                    0%, 100% {
                        filter: drop-shadow(0 0 16px #ffe6a0);
                    }
                    50% {
                        filter:
                            drop-shadow(0 0 28px #fff1b8)
                            drop-shadow(0 0 44px #e6bb58);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .ikimono-opening .opening-art {
                        animation: none !important;
                        transition: none;
                    }
                }

            </style>

            <div class="opening-world">
                <img
                    class="opening-art"
                    src="./assets/spiria/spiria_egg.png"
                    alt="輝く精霊の卵"
                >
                <div id="openingCopy" class="opening-copy"></div>
                <button class="opening-next" type="button"></button>
                <button class="opening-skip" type="button">
                    オープニングをスキップ
                </button>
            </div>
        `;

        const story = [
            {
                title: "森の奥で、光がゆれた。",
                text: "木もれ日の中を歩いていると、<br>草かげに、小さな光を見つけた。"
            },
            {
                title: "そこにあったのは、不思議な卵。",
                text: "そっと近づくと、卵がほのかに輝く。<br>まるで、きみを待っていたみたいに。"
            },
            {
                title: "どんな子に出会えるんだろう。",
                text: "いつもの道や公園で、生き物を見つけよう。<br>きみの発見が、卵の中の命を育てていく。"
            },
            {
                title: "いきものマスター",
                text: "この卵と一緒に、出かけよう。<br>きみだけの冒険が、ここから始まる。"
            }
        ];
        const guide = [
            {
                title: "写真で仲間を見つけよう",
                text: "「仲間をさがす」で生き物の写真を選ぼう。<br>AIが出した候補から、見つけた仲間を選んでね。"
            },
            {
                title: "図鑑を集めよう",
                text: "見つけた仲間が図鑑に登録されるよ。<br>いろんな生き物を探して、図鑑を増やそう！"
            },
            {
                title: "エンブレムと精霊",
                text: "発見を重ねるとエンブレムが手に入るよ。<br>「輝いている…」を見つけたら触れてみよう。<br>精霊との新しい出会いや進化が待っているよ。"
            },
            {
                title: "外でも冒険を楽しもう",
                text: "ネットがない時は写真を発見ポーチへ。<br>オンラインになったら、ポーチから調べよう。<br>生き物を大切にして、安全な場所で遊んでね。"
            }
        ];

        const copy = dialog.querySelector("#openingCopy");
        const next = dialog.querySelector(".opening-next");
        const skip = dialog.querySelector(".opening-skip");

        let mode = "story";
        let index = 0;
        let timer;

        function hasPlayerName() {
            return Boolean(
                String(getSave().playerName ?? "").trim()
            );
        }

        function render() {
            clearTimeout(timer);

                        dialog.dataset.scene =
                mode === "story"
                    ? String(index)
                    : "guide";

            if (mode === "name") {
                copy.innerHTML = `
                    <small class="opening-count">
                        冒険者の名前
                    </small>
                    <h1>きみの名前を教えてね</h1>
                    <p>冒険で使うニックネームを入れよう。</p>

                    <label for="openingPlayerName">
                        ニックネーム（1〜12文字）
                    </label>

                    <input
                        id="openingPlayerName"
                        type="text"
                        maxlength="12"
                        autocomplete="nickname"
                        enterkeyhint="done"
                        placeholder="例：みやび"
                        aria-describedby="openingNameError"
                        style="
                            display:block;
                            box-sizing:border-box;
                            width:100%;
                            margin:12px auto;
                            padding:14px;
                            border:2px solid #e6bb58;
                            border-radius:16px;
                            background:#fffaf0;
                            color:#244532;
                            font-size:18px;
                            text-align:center;
                        "
                    >

                    <p
                        id="openingNameError"
                        role="alert"
                        style="color:#ffe6a0;font-size:14px;"
                    ></p>
                `;

                next.textContent = "この名前で冒険する";
                skip.hidden = true;

                const input =
                    copy.querySelector("#openingPlayerName");

                input.addEventListener("keydown", event => {
                    if (
                        event.key === "Enter" &&
                        !event.isComposing
                    ) {
                        event.preventDefault();
                        advance();
                    }
                });

                return;
            }

            const pages = mode === "story" ? story : guide;
            const page = pages[index];

            copy.innerHTML = `
                <small class="opening-count">
                    ${
                        mode === "story"
                            ? "冒険のはじまり"
                            : `遊び方 ${index + 1} / ${guide.length}`
                    }
                </small>
                <h1>${page.title}</h1>
                <p>${page.text}</p>
            `;

            copy.getAnimations().forEach(
                animation => animation.cancel()
            );

            copy.animate(
                [{ opacity: 0 }, { opacity: 1 }],
                {
                    duration: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches ? 0 : 800
                }
            );

            next.textContent =
                mode === "story"
                    ? "次へ"
                    : index === guide.length - 1
                        ? "冒険をはじめる"
                        : "次へ";

            skip.hidden = mode !== "story";

            if (mode === "story") {
                timer = setTimeout(advance, 5000);
            }
        }

        function startGuide() {
            mode = hasPlayerName() ? "guide" : "name";
            index = 0;
            render();
        }

        function finish() {
            if (!hasPlayerName()) {
                mode = "name";
                render();
                return;
            }

            clearTimeout(timer);

            try {
                localStorage.setItem(OPENING_KEY, "true");
            } catch (error) {
                console.warn(
                    "初回表示の記録に失敗しました。",
                    error
                );
            }

            dialog.close();
            dialog.remove();
            previousFocus?.focus?.();
            resolve();
        }

        function advance() {
            if (mode === "name") {
                const input =
                    copy.querySelector("#openingPlayerName");

                const errorText =
                    copy.querySelector("#openingNameError");

                const playerName = input.value.trim();

                if (
                    !playerName ||
                    Array.from(playerName).length > 12
                ) {
                    errorText.textContent =
                        "名前を1〜12文字で入れてね。";

                    input.focus();
                    return;
                }

                try {
                    update({ playerName });
                } catch (error) {
                    console.error("名前の保存失敗", error);

                    errorText.textContent =
                        "名前を保存できなかったよ。もう一度試してね。";

                    return;
                }

                mode = "guide";
                index = 0;
                render();
                next.focus();
                return;
            }

            const pages = mode === "story" ? story : guide;

            if (index < pages.length - 1) {
                index += 1;
                render();
            } else if (mode === "story") {
                startGuide();
            } else {
                finish();
            }
        }

        next.addEventListener("click", advance);
        skip.addEventListener("click", startGuide);

        dialog.addEventListener("cancel", event => {
            event.preventDefault();

            if (mode === "story") {
                startGuide();
            } else if (mode === "guide") {
                finish();
            }
        });

        document.body.appendChild(dialog);
        dialog.showModal();
        render();
        next.focus();
    });
}