(() => {
  "use strict";

  const guides = [
    {id:"01",title:"まず、近づかせない",subtitle:"ゼルダの基本距離と勝ち筋",core:"道を作ってから動く。単体で無理に差し込まない。",summary:"設置技と空中技で相手の進路を限定し、有利な中距離を維持する。",diagram:["自分","設置技","相手"],sections:[["基本の順番","設置技で進路を限定","ジャンプには対空","ガードにはつかみ","触ったら距離を戻す"],["維持したい距離","通常技がすぐ届かない","安全に準備できる","飛びを見て迎撃できる"],["やりがちなミス","自分から飛び込む","近距離で長く殴る","設置後の次手がない"],["次の行動","飛ぶなら対空","止まるなら前進","引くならライン上げ"]]},
    {id:"02",title:"ファントムで道を作る",subtitle:"下Bは攻撃ではなく行動制限",core:"撃つのではなく、ファントムと一緒に攻める。",summary:"相手のジャンプ・ガード・回避を限定し、本体が安全に動く壁として使う。",diagram:["ジャンプ","ガード","回避"],sections:[["相手の反応を見る","飛ぶなら空中技","守るならつかみ","回避には着地点狩り"],["強い置き方","接近前に準備","逃げ道の少ない場所","完成と同時に前へ"],["弱い使い方","密着で生成","毎回最大まで溜める","発射後に何もしない"],["次の行動","ヒットなら追撃","ガードならライン上げ","回避なら着地狩り"]]},
    {id:"03",title:"空振りだけを取りに行く",subtitle:"無理に触らず、後隙を狙う",core:"先に振らせる。見てから触る。触ったら戻る。",summary:"攻撃が届かない位置を保ち、空振りや着地の隙へ短く差し返す。",diagram:["待機位置","相手の攻撃範囲","差し返し"],sections:[["主な差し返し","下強で着地隙","DAで遠い後隙","空前・空後は先端"],["見るポイント","着地する位置","ガードか暴れか","反撃後に離れられるか"],["やりがちなミス","振る前に飛び込む","届かないDA","差し返し後に追いすぎる"],["次の行動","崖へ運ぶ","距離を戻す","着地点へ上強"]]},
    {id:"04",title:"飛んだ相手を落とす",subtitle:"頭上と斜め前を使い分ける",core:"飛ばせてから落とす。先に相手のジャンプを作る。",summary:"地上ルートを塞ぎ、上強・上スマ・空上・空Nで飛ぶ位置を狩る。",diagram:["近い頭上","真上・台上","高い位置"],sections:[["技の使い分け","上強は近い頭上","上スマは真上と台","空上は高い位置"],["対空の準備","地上ルートを塞ぐ","飛ぶ方向へ先回り","技より着地位置を見る"],["やりがちなミス","飛ぶ前に上スマ","真上に空前","対空後を継続しない"],["次の行動","空上で追撃","着地点へ設置","崖方向へ追い込む"]]},
    {id:"05",title:"近距離は短く終える",subtitle:"暴れて、離れて、作り直す",core:"勝とうとしない。まず密着を終わらせる。",summary:"弱・空N・通常必殺・上Bで追い払い、得意な中距離へ戻す。",diagram:["密着","切り返し","中距離へ戻る"],sections:[["主な切り返し","弱は小さな隙","空Nは周囲を守る","上Bは反撃と離脱"],["守った後","相手から距離を取る","設置技を準備","中央へ戻る"],["やりがちなミス","通常必殺を連打","密着でスマッシュ","反撃後もその場に残る"],["判断基準","隙が小さいなら弱","重ねには通常必殺","確定反撃なら上B"]]},
    {id:"06",title:"ガードしたら上B",subtitle:"距離と隙で反撃を選ぶ",core:"届くなら上B。近いなら空N。無理なら離れる。",summary:"正面・めくり・頭上・距離を確認し、反撃技を自動化しすぎない。",diagram:["正面","めくり","頭上・台上"],sections:[["反撃の選び方","上Bは正面の大きな隙","空Nは密着・めくり","上スマは頭上"],["確認すること","正面か背後か","深く当たったか","本当に届く距離か"],["やりがちなミス","何でも上B","逆方向へ出す","確定しないのに押す"],["反撃できない時","ジャンプで離れる","回避で入れ替える","ガード継続"]]},
    {id:"07",title:"崖を上がらせない",subtitle:"時間差と持続で択を減らす",core:"一つを読むより、複数の上がり方をまとめて縛る。",summary:"設置技を先に置き、崖上がりの複数択を同時に制限する。",diagram:["その場上がり","回避上がり","ジャンプ上がり"],sections:[["基本セット","設置技を崖上に置く","ジャンプへ空中技","回避へ持続技"],["立ち位置","回避上がりを取れる距離","崖際へ近づきすぎない","本体と設置で挟む"],["やりがちなミス","毎回同じタイミング","崖際で大技連打","逃げられて追いすぎる"],["成功後","もう一度崖外へ","着地狩りへ移行","撃墜圏なら締める"]]},
    {id:"08",title:"場外は無理に追わない",subtitle:"飛び道具でルートを限定する",core:"倒し切れなくてもいい。復帰ルートを一つ減らす。",summary:"深く追わず、遠距離から復帰ルートへ圧をかけて崖展開へつなぐ。",diagram:["高い復帰","水平復帰","低い復帰"],sections:[["ルート別の対応","遠い相手は飛び道具","崖付近は空中技","低い復帰は崖準備"],["安全な考え方","戻れる範囲だけ追う","ジャンプと復帰技を見る","当たらずとも進路変更"],["やりがちなミス","溜めすぎる","深追いして戻れない","崖準備が遅れる"],["次の行動","設置技を崖に準備","回避位置へ移動","ジャンプへ空中技"]]},
    {id:"09",title:"着地点を先に取る",subtitle:"技ではなく逃げ先を見る",core:"真下へ追わない。着地する場所へ先に行く。",summary:"相手を追い回さず、中央・台・崖の着地候補へ先回りする。",diagram:["中央着地","台上着地","崖へ逃げる"],sections:[["主な着地狩り","近い位置は持続技","真上・台は上方向技","着地先へ時間差設置"],["見るポイント","空中ジャンプの有無","回避を使ったか","台か崖か"],["やりがちなミス","真下で大技連打","左右へ走りすぎる","一回で終わる"],["次の行動","再度浮かせる","崖へ追い込む","高％なら上撃墜"]]},
    {id:"10",title:"撃墜技を直接振らない",subtitle:"当たる状況を先に作る",core:"強い技を振る回数ではなく、確定する場面を増やす。",summary:"崖・着地・ガード反撃・投げから、撃墜技が当たる流れを作る。",diagram:["崖展開","着地狩り","ガード・投げ"],sections:[["主な撃墜ルート","崖から空中撃墜","反撃から高リターン","防御には投げ"],["考え方","中央より崖展開","先端距離を作る","防御択を減らす"],["やりがちなミス","高火力技を連打","大技を生で振る","焦ってラインを失う"],["撃墜できない時","ダメージを増やす","投げ圏まで待つ","崖展開を繰り返す"]]},
    {id:"11",title:"先端だけを当てる",subtitle:"空前・空後の狙い方",core:"追いかけて当てない。入ってくる場所へ先端を置く。",summary:"強い空中技は飛び込むより、相手が入る位置へ先端を置く。",diagram:["先端・安全","根本・危険","引きながら置く"],sections:[["当てやすい場面","ジャンプ接近への迎撃","崖上がりへの置き","着地先への先回り"],["前後の使い分け","前方への差し返し","後ろ技は引きと好相性","先端距離を保つ"],["やりがちなミス","深く飛び込む","根本をガードさせる","外して連打する"],["練習ポイント","小ジャンプ先端確認","引き置きを反復","設置技と同時に当てる"]]},
    {id:"12",title:"不利になったら逃げる",subtitle:"反撃より帰還を優先する",core:"反撃より帰還。まず中央と地面を取り戻す。",summary:"不利状況では反撃を急がず、安全な着地と復帰を最優先する。",diagram:["中央へ着地","崖へ逃げる","復帰位置を変える"],sections:[["着地の選択肢","左右へ位置をずらす","空中技で追い払う","無理なら崖へ"],["復帰の選択肢","距離と方向を変える","高く戻るか崖か","追撃を見て選ぶ"],["やりがちなミス","毎回同じ位置","不利で大技","回避を早く使いすぎる"],["戻った後","すぐ攻めず距離を作る","設置技で仕切り直す","中央を取る"]]}
  ];

  const drawer = document.querySelector("#guideDrawer");
  const carousel = document.querySelector("#guideCarousel");
  const stage = document.querySelector("#guideOpen");
  const loader = document.querySelector("#guideLoader");
  const title = document.querySelector("#guideTitle");
  const counter = document.querySelector("#guideCounter");
  const dots = document.querySelector("#guideDots");
  const previous = document.querySelector("#guidePrevious");
  const next = document.querySelector("#guideNext");
  const dialog = document.querySelector("#guideDialog");
  const dialogCaption = document.querySelector("#guideDialogCaption");
  const dialogClose = document.querySelector("#guideDialogClose");

  if (!drawer || !carousel || !stage || !dots) return;

  const legacyImage = document.querySelector("#guideImage");
  const legacyDialogImage = document.querySelector("#guideDialogImage");
  if (legacyImage) legacyImage.hidden = true;
  if (legacyDialogImage) legacyDialogImage.hidden = true;

  const canvas = document.createElement("div");
  canvas.className = "guide-render-shell";
  canvas.id = "guideCanvas";
  canvas.setAttribute("aria-hidden", "true");
  stage.appendChild(canvas);

  const dialogStage = document.createElement("div");
  dialogStage.className = "guide-dialog-stage";
  const dialogCanvas = document.createElement("div");
  dialogCanvas.className = "guide-render-shell guide-render-shell-dialog";
  dialogCanvas.id = "guideDialogCanvas";
  dialogStage.appendChild(dialogCanvas);
  dialog.insertBefore(dialogStage, dialogCaption);

  let current = Math.max(0, Math.min(guides.length - 1, Number(localStorage.getItem("zelda-guide-index")) || 0));
  let pointerStart = null;

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));

  function sectionMarkup(section, index) {
    return `<section class="guide-card guide-card-${index}">
      <h3><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(section[0])}</h3>
      <ul>${section.slice(1).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </section>`;
  }

  function guideMarkup(guide) {
    return `<article class="guide-page">
      <header class="guide-page-header">
        <div class="guide-page-number">${guide.id}</div>
        <div><p>VISUAL GAME PLAN</p><h2>${escapeHtml(guide.title)}</h2><strong>${escapeHtml(guide.subtitle)}</strong></div>
      </header>
      <div class="guide-page-intro">
        <section><span>SUMMARY</span><p>${escapeHtml(guide.summary)}</p></section>
        <section class="is-core"><span>CORE MESSAGE</span><p>${escapeHtml(guide.core)}</p></section>
      </div>
      <section class="guide-page-diagram">
        <small>状況を3段階で整理</small>
        <div>${guide.diagram.map((item, index) => `<div class="guide-diagram-node"><i>${index + 1}</i><b>${escapeHtml(item)}</b></div>${index < guide.diagram.length - 1 ? '<span class="guide-diagram-arrow">→</span>' : ''}`).join("")}</div>
      </section>
      <p class="guide-page-core">${escapeHtml(guide.core)}</p>
      <div class="guide-page-grid">${guide.sections.map(sectionMarkup).join("")}</div>
      <footer>立ち回りは、技を振る前の「状況作り」で決まる。</footer>
    </article>`;
  }

  function resizeShell(host, shell) {
    const width = host.clientWidth;
    if (!width) return;
    shell.style.setProperty("--guide-scale", String(width / 800));
  }

  function renderInto(shell, guide) {
    shell.innerHTML = guideMarkup(guide);
  }

  function updateDots() {
    [...dots.children].forEach((dot, index) => {
      const active = index === current;
      dot.setAttribute("aria-selected", String(active));
      dot.tabIndex = active ? 0 : -1;
      if (active) dot.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
  }

  function render() {
    const guide = guides[current];
    localStorage.setItem("zelda-guide-index", String(current));
    counter.textContent = `${guide.id} / ${String(guides.length).padStart(2, "0")}`;
    title.textContent = guide.title;
    stage.setAttribute("aria-label", `${guide.title}を拡大表示`);
    updateDots();
    renderInto(canvas, guide);
    loader.hidden = true;
    requestAnimationFrame(() => resizeShell(stage, canvas));
  }

  function move(delta) {
    current = (current + delta + guides.length) % guides.length;
    render();
  }

  dots.innerHTML = guides.map((guide, index) => `<button class="guide-dot" type="button" role="tab" aria-label="${guide.id} ${escapeHtml(guide.title)}" aria-selected="${index === current}" data-guide-index="${index}">${guide.id}</button>`).join("");

  drawer.addEventListener("toggle", () => { if (drawer.open) render(); });
  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  dots.addEventListener("click", (event) => {
    const dot = event.target.closest("[data-guide-index]");
    if (!dot) return;
    current = Number(dot.dataset.guideIndex);
    render();
  });
  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
  });
  stage.addEventListener("pointerdown", (event) => { pointerStart = { x: event.clientX, y: event.clientY }; });
  stage.addEventListener("pointerup", (event) => {
    if (!pointerStart) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
  });
  stage.addEventListener("pointercancel", () => { pointerStart = null; });
  stage.addEventListener("click", () => {
    const guide = guides[current];
    renderInto(dialogCanvas, guide);
    dialogCaption.textContent = `${guide.id} / 12　${guide.title}`;
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
      requestAnimationFrame(() => resizeShell(dialogStage, dialogCanvas));
    }
  });
  dialogClose.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && dialog.open) dialog.close(); });
  window.addEventListener("resize", () => {
    if (drawer.open) resizeShell(stage, canvas);
    if (dialog.open) resizeShell(dialogStage, dialogCanvas);
  });
  document.querySelectorAll('a[href="#visual-guides"]').forEach((link) => {
    link.addEventListener("click", () => { drawer.open = true; render(); });
  });
})();
