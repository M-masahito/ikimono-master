/* ===========================
   いきものマスター Ver10
=========================== */

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:"Yu Gothic UI",sans-serif;
}

body{

    background:#111;

    color:white;

}

/* ---------- タイトル ---------- */

.header{

    background:#1b1b1b;

    color:gold;

    text-align:center;

    padding:20px;

    font-size:28px;

    font-weight:bold;

    border-bottom:3px solid gold;

}

/* ---------- メニュー ---------- */

.menu{

    display:flex;

    justify-content:space-around;

    padding:15px;

    background:#222;

    border-bottom:2px solid #333;

}

.menu button{

    width:90px;

    height:50px;

    border:none;

    border-radius:12px;

    background:#333;

    color:white;

    cursor:pointer;

    font-size:15px;

    transition:.2s;

}

.menu button:hover{

    background:gold;

    color:black;

}

/* ---------- 共通画面 ---------- */

.screen{

    padding:20px;

}

/* ---------- 精霊カード ---------- */

.spirit-card{

    width:320px;

    margin:30px auto;

    padding:20px;

    background:#222;

    border:3px solid gold;

    border-radius:18px;

    text-align:center;

    box-shadow:0 0 20px rgba(255,215,0,.3);

}

.spirit-card img{

    width:160px;

    height:160px;

    object-fit:contain;

}

.spirit-card h2{

    margin-top:15px;

    font-size:28px;

}

.spirit-card p{

    margin-top:8px;

    color:#ffd54f;

}

/* ---------- 発見数 ---------- */

.progress{

    margin-top:25px;

    text-align:center;

    font-size:22px;

}

/* ---------- AI画面 ---------- */

#photo{

    display:block;

    margin:20px auto;

}

#preview{

    width:320px;

    height:320px;

    margin:auto;

    border:2px dashed #666;

    border-radius:15px;

    display:flex;

    align-items:center;

    justify-content:center;

    overflow:hidden;

    background:#1b1b1b;

}

#preview img{

    width:100%;

    height:100%;

    object-fit:cover;

}

#identify{

    display:block;

    width:260px;

    margin:25px auto;

    padding:15px;

    border:none;

    border-radius:12px;

    background:gold;

    color:black;

    font-size:20px;

    font-weight:bold;

    cursor:pointer;

}

#identify:hover{

    opacity:.9;

}

#aiStatus{

    margin-top:15px;

    text-align:center;

    color:#ddd;

}

/* ---------- 図鑑 ---------- */

#catalogGrid{

    display:grid;

    grid-template-columns:repeat(auto-fill,minmax(170px,1fr));

    gap:18px;

}

/* ---------- カード ---------- */

.card{

    background:#222;

    border:2px solid gold;

    border-radius:14px;

    padding:10px;

    text-align:center;

    transition:.2s;

}

.card:hover{

    transform:scale(1.05);

    box-shadow:0 0 15px gold;

}

/* ---------- スマホ ---------- */

@media(max-width:700px){

    .menu{

        flex-wrap:wrap;

        gap:10px;

    }

    .menu button{

        width:45%;

    }

    .spirit-card{

        width:95%;

    }

    #preview{

        width:95%;

        height:300px;

    }

}