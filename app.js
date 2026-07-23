"use strict";
const creatures = window.IKIMONO_DATA;
const config = window.IKIMONO_CONFIG || {};
const STORAGE_KEY = "ikimonoMasterV1";

const STAGES = [
  { key: "spirit", label: "スピリット", min: 0, icon: "✨" },
  { key: "child", label: "のこ", min: 10, icon: "🌱" },
  { key: "nushi", label: "のぬし", min: 30, icon: "🌿" },
  { key: "fairy", label: "の精霊", min: 60, icon: "🦋" },
  { key: "king", label: "の精霊王", min: 100, icon: "👑" },
  { key: "divine", label: "の神獣", min: 150, icon: "🐉" }
];
const ATTRIBUTES = {
  insect: { name: "昆虫", icon: "🪲", groups: ["昆虫"] },
  sky: { name: "空", icon: "🦅", groups: ["鳥"] },
  water: { name: "水", icon: "🌊", groups: ["魚", "両生", "水生"] },
  earth: { name: "大地", icon: "🦊", groups: ["哺乳", "爬虫"] },
  rock: { name: "岩", icon: "💎", groups: ["貝", "甲殻"] },
  forest: { name: "森", icon: "🌳", groups: ["植物", "樹木", "花"] },
  mushroom: { name: "キノコ", icon: "🍄", groups: ["キノコ", "菌"] }
};
const STAGE_ICONS = {
  insect: ["✨", "🐛", "🪲", "🧚", "👑", "🐉"], sky: ["✨", "🐣", "🦅", "🕊️", "👑", "⚡"],
  water: ["✨", "🐟", "🐬", "🧜", "👑", "🐲"], earth: ["✨", "🦊", "🐺", "🦌", "👑", "🦁"],
  rock: ["✨", "🪨", "💎", "🦏", "👑", "🐲"], forest: ["✨", "🌱", "🦌", "🌳", "👑", "🦌"],
  mushroom: ["✨", "🍄", "🍄", "🧚", "👑", "🍄"]
};
let state = loadState();
let selectedPhoto = null;
let selectedPhotoMimeType = "image/jpeg";
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function initialState() { return { owned: {}, records: {}, spiritName: "モリル", lastStage: "spirit" }; }
function loadState() { try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); return { ...initialState(), ...saved, owned: saved.owned || {}, records: saved.records || {} }; } catch { return initialState(); } }
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); renderStatus(); }
function ownedCount() { return Object.keys(state.owned).length; }
function getStage(count = ownedCount()) { return [...STAGES].reverse().find(s => count >= s.min) || STAGES[0]; }
function nextStage(count = ownedCount()) { return STAGES.find(s => s.min > count) || null; }
function getAttributeCounts() { const counts = {}; Object.keys(ATTRIBUTES).forEach(k => counts[k] = 0); Object.keys(state.owned).forEach(no => { const c = creatures.find(x => x.no === Number(no)); if (!c) return; const text = `${c.category} ${c.name}`; for (const [key, a] of Object.entries(ATTRIBUTES)) { if (a.groups.some(g => text.includes(g))) counts[key]++; } }); return counts; }
function getAttribute() { const counts = getAttributeCounts(); const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]; return top && top[1] > 0 ? { key: top[0], ...ATTRIBUTES[top[0]], count: top[1] } : { key: "none", name: "無属性", icon: "✨", count: 0 }; }
function spiritTitle(stage = getStage(), attr = getAttribute()) { if (stage.key === "spirit" || attr.key === "none") return "スピリット"; return `${attr.name}${stage.label}`; }
function spiritIcon(stage = getStage(), attr = getAttribute()) { if (attr.key === "none") return "✨"; return STAGE_ICONS[attr.key][STAGES.indexOf(stage)] || attr.icon; }
function renderStatus() {
  const count = ownedCount(), stage = getStage(count), next = nextStage(count), attr = getAttribute(), title = spiritTitle(stage, attr), icon = spiritIcon(stage, attr), total = creatures.length;
  $("#ownedCount").textContent = count; $("#totalCount").textContent = total;
  ["#homeSpiritEmoji", "#spiritEmoji"].forEach(id => $(id).textContent = icon);
  $("#homeSpiritName").textContent = state.spiritName; $("#spiritNameInput").value = state.spiritName;
  $("#homeSpiritTitle").textContent = title; $("#spiritTitle").textContent = title;
  $("#homeAttribute").textContent = attr.name; $("#spiritAttribute").textContent = `属性：${attr.name}`;
  const rate = Math.round(count / total * 100); $("#homeRate").textContent = `${rate}%`; $("#collectionRate").textContent = `${rate}%`; $("#collectionBar").style.width = `${rate}%`;
  if (next) { const remaining = next.min - count, prev = stage.min, p = Math.min(100, (count - prev) / (next.min - prev) * 100); $("#nextEvolutionText").textContent = `あと${remaining}種類で「${attr.key === "none" ? "新しい姿" : attr.name + next.label}」へ`; $("#homeRemaining").textContent = `あと${remaining}種類`; $("#spiritMessage").textContent = `新しい生き物をあと${remaining}種類発見すると進化します。`; $("#evolutionBar").style.width = `${p}%`; $("#spiritBar").style.width = `${p}%`; } else { $("#nextEvolutionText").textContent = "神獣へ到達！"; $("#homeRemaining").textContent = "最高段階"; $("#spiritMessage").textContent = "最高の姿・神獣へ到達しました。"; $("#evolutionBar").style.width = "100%"; $("#spiritBar").style.width = "100%"; }
  renderTitleRoad(); renderDivineGrid();
}
function renderTitleRoad() { const count = ownedCount(), attr = getAttribute(); $("#titleRoad").innerHTML = STAGES.map(s => { const unlocked = count >= s.min; const label = s.key === "spirit" ? "スピリット" : `${attr.key === "none" ? "？？" : attr.name}${s.label}`; return `<div class="title-step ${unlocked ? "unlocked" : "locked-title"}"><span>${unlocked ? spiritIcon(s, attr) : "？"}</span><div><b>${label}</b><small>${s.min}種類で進化</small></div></div>`; }).join(""); }
function renderDivineGrid() { const counts = getAttributeCounts(); $("#divineGrid").innerHTML = Object.entries(ATTRIBUTES).map(([k, a]) => { const unlocked = counts[k] >= 150; return `<div class="divine-card ${unlocked ? "unlocked" : ""}"><div>${unlocked ? STAGE_ICONS[k][5] : "？"}</div><b>${a.name}の神獣</b><small>${counts[k]} / 150種類</small></div>`; }).join(""); }
function showScreen(id) { $$('.screen').forEach(s => s.classList.remove('active')); $(`#${id}`).classList.add('active'); if (id === 'book') renderBook(); if (id === 'spirit' || id === 'home' || id === 'divine') renderStatus(); scrollTo(0, 0); }
function getCreatureEmoji(c) { if (/カブト|クワガタ/.test(c.name)) return "🪲"; if (/チョウ|ガ/.test(c.name)) return "🦋"; if (/カエル/.test(c.name)) return "🐸"; if (/ヘビ/.test(c.name)) return "🐍"; if (c.category.includes("鳥")) return "🐦"; if (c.category.includes("魚")) return "🐟"; if (/キノコ|シイタケ|エリンギ|エノキ|シメジ|マツタケ/.test(c.name)) return "🍄"; if (c.category.includes("植物")) return "🌿"; return "🌱"; }
function cardHtml(c, force = false) { const owned = force || state.owned[c.no]; return `<div class="card ${c.rarity} ${owned ? "" : "locked"}" data-no="${c.no}"><div class="inner"><div class="top"><span>No.${String(c.no).padStart(3, "0")}</span><span>${c.rarity}</span></div><div class="art">${getCreatureEmoji(c)}</div><div class="name">${owned ? c.name : "？？？"}</div><div class="species">${owned ? c.category : "未発見"}</div></div></div>`; }
function renderBook() { const q = $("#search").value, f = $("#filter").value; const list = creatures.filter(c => (!q || c.name.includes(q) || String(c.no).includes(q)) && (f === 'all' || (f === 'owned' && state.owned[c.no]) || (f === 'locked' && !state.owned[c.no]) || (f === 'rare' && ['SS', 'S', 'A'].includes(c.rarity)))); $("#grid").innerHTML = list.map(c => cardHtml(c)).join(''); $$('#grid .card').forEach(x => x.onclick = () => detail(Number(x.dataset.no))); renderStatus(); }
function detail(no) { if (!state.owned[no]) return; const c = creatures.find(x => x.no === no), r = state.records[no] || { count: 1, first: new Date().toLocaleDateString('ja-JP'), memo: '' }; $("#detailBody").innerHTML = `${cardHtml(c, true)}<div class="panel"><h3>📖 基本情報</h3><p>${c.description}</p><p>📍 ${c.habitat}</p><p>🌸 ${c.season}</p><p>📏 ${c.size}</p><p>🍽️ ${c.food}</p><h3>📸 発見記録</h3><p>初発見：${r.first}<br>発見回数：${r.count}回</p><textarea id="memo" class="memo-input">${r.memo || ''}</textarea><button id="saveMemo">メモを保存</button></div>`; $("#saveMemo").onclick = () => { r.memo = $("#memo").value; state.records[no] = r; saveState(); toast("メモを保存しました"); }; showScreen('detail'); }
function fillPicker() { $("#pick").innerHTML = creatures.filter(c => !c.name.startsWith('未設定')).map(c => `<option value="${c.no}">No.${String(c.no).padStart(3, '0')} ${c.name}</option>`).join(''); }
function resizeImage(file, max = 1280, q = .82) { return new Promise((res, rej) => { const r = new FileReader(); r.onerror = () => rej(new Error('写真を読み込めません')); r.onload = () => { const i = new Image(); i.onerror = () => rej(new Error('写真を表示できません')); i.onload = () => { const s = Math.min(1, max / Math.max(i.width, i.height)), cv = document.createElement('canvas'); cv.width = Math.round(i.width * s); cv.height = Math.round(i.height * s); cv.getContext('2d').drawImage(i, 0, 0, cv.width, cv.height); res(cv.toDataURL('image/jpeg', q)); }; i.src = r.result; }; r.readAsDataURL(file); }); }
async function photoSelected(e) { const f = e.target.files[0]; if (!f) return; setStatus('写真を準備しています…', 'working'); try { selectedPhoto = await resizeImage(f); $("#preview").style.backgroundImage = `url(${selectedPhoto})`; $("#preview").textContent = ''; $("#identify").disabled = false; setStatus('準備できました。AI判定を押してください。'); } catch (err) { setStatus(err.message, 'error'); } }
function setStatus(m, k = '') { const el = $("#aiStatus"); el.textContent = m; el.className = `ai-status ${k}`.trim(); }
function findBest(r) { if (Number.isFinite(Number(r.no))) { const c = creatures.find(x => x.no === Number(r.no)); if (c) return c; } const n = String(r.name || '').trim(); return creatures.find(x => x.name === n) || creatures.find(x => n.includes(x.name) || x.name.includes(n)); }
async function identify() { if (!selectedPhoto) return; if (!config.aiWorkerUrl) { setStatus('AIの接続先が未設定です。手動登録を使ってください。', 'error'); return; } $("#identify").disabled = true; setStatus('🔍 AIが写真を調べています…', 'working'); try { const res = await fetch(config.aiWorkerUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageBase64: selectedPhoto.split(',')[1], mimeType: selectedPhotoMimeType, candidates: creatures.filter(x => !x.name.startsWith('未設定')).map(x => ({ no: x.no, name: x.name, category: x.category })) }) }); const p = await res.json().catch(() => ({})); if (!res.ok) throw new Error(p.error || `AI判定失敗（${res.status}）`); const c = findBest(p); if (!c) { setStatus(`「${p.name || '不明'}」は図鑑にありません。手動で選んでください。`, 'error'); return; } setStatus(`判定結果：${c.name}`); register(c.no, p.note || 'AI判定で発見'); } catch (e) { setStatus(`${e.message} 手動登録も使えます。`, 'error'); } finally { $("#identify").disabled = false; } }
function register(no, memo = '') { const before = getStage(); const c = creatures.find(x => x.no === Number(no)); if (!c) return; const isNew = !state.owned[c.no], r = state.records[c.no] || { count: 0, first: new Date().toLocaleDateString('ja-JP'), memo: '' }; state.owned[c.no] = true; r.count++; if (memo && !r.memo) r.memo = memo; state.records[c.no] = r; saveState(); const after = getStage(); showGet(c, isNew); if (after.key !== before.key) setTimeout(() => showEvolution(after), 900); }
function showGet(c, isNew) { $("#getScene").className = `get-scene rarity-${c.rarity}`; $("#rareBurst").textContent = ['SS', 'S', 'A'].includes(c.rarity) ? '✨ ✨ ✨' : '✨'; $("#getTitle").textContent = c.rarity === 'SS' ? '超レア発見！！' : isNew ? 'NEW CARD GET!!' : 'CARD GET!!'; $("#getReward").textContent = isNew ? '新しい生き物が図鑑に登録され、精霊の力が高まりました。' : '発見記録を更新しました。'; $("#getCard").innerHTML = cardHtml(c, true); $("#overlay").classList.remove('hidden'); }
function showEvolution(stage) { const attr = getAttribute(); $("#evolutionEmoji").textContent = spiritIcon(stage, attr); $("#evolutionTitle").textContent = spiritTitle(stage, attr); $("#evolutionAttribute").textContent = `${attr.name}の力を宿した新しい姿`; $("#evolutionOverlay").classList.remove('hidden'); state.lastStage = stage.key; saveState(); }
function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.remove('hidden'); clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.add('hidden'), 2200); }
function reset() { if (!confirm('発見データと精霊の成長を全部消しますか？')) return; state = initialState(); saveState(); toast('初期化しました'); }
function events() { $$('[data-go]').forEach(b => b.onclick = () => showScreen(b.dataset.go)); $("#search").oninput = renderBook; $("#filter").onchange = renderBook; $("#photo").onchange = photoSelected; $("#identify").onclick = identify; $("#manualRegister").onclick = () => register(Number($("#pick").value), '手動で登録'); $("#closeGet").onclick = () => { $("#overlay").classList.add('hidden'); showScreen('book'); }; $("#closeEvolution").onclick = () => { $("#evolutionOverlay").classList.add('hidden'); showScreen('spirit'); }; $("#saveSpiritName").onclick = () => { const n = $("#spiritNameInput").value.trim(); if (n) { state.spiritName = n; saveState(); toast('精霊の名前を保存しました'); } }; $("#reset").onclick = reset; }
function start() { fillPicker(); events(); renderStatus(); if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(console.error); }
start();
