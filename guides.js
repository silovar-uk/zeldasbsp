(() => {
  "use strict";

  const guides = [
    { id: "01", title: "まず、近づかせない", group: "01-06" },
    { id: "02", title: "ファントムで道を作る", group: "01-06" },
    { id: "03", title: "空振りだけを取りに行く", group: "01-06" },
    { id: "04", title: "飛んだ相手を落とす", group: "01-06" },
    { id: "05", title: "近距離は短く終える", group: "01-06" },
    { id: "06", title: "ガードしたら上B", group: "01-06" },
    { id: "07", title: "崖を上がらせない", group: "07-12" },
    { id: "08", title: "場外は無理に追わない", group: "07-12" },
    { id: "09", title: "着地点を先に取る", group: "07-12" },
    { id: "10", title: "撃墜技を直接振らない", group: "07-12" },
    { id: "11", title: "先端だけを当てる", group: "07-12" },
    { id: "12", title: "不利になったら逃げる", group: "07-12" }
  ];

  const drawer = document.querySelector("#guideDrawer");
  const carousel = document.querySelector("#guideCarousel");
  const image = document.querySelector("#guideImage");
  const loader = document.querySelector("#guideLoader");
  const title = document.querySelector("#guideTitle");
  const counter = document.querySelector("#guideCounter");
  const dots = document.querySelector("#guideDots");
  const previous = document.querySelector("#guidePrevious");
  const next = document.querySelector("#guideNext");
  const stage = document.querySelector("#guideOpen");
  const dialog = document.querySelector("#guideDialog");
  const dialogImage = document.querySelector("#guideDialogImage");
  const dialogCaption = document.querySelector("#guideDialogCaption");
  const dialogClose = document.querySelector("#guideDialogClose");

  if (!drawer || !carousel || !image || !dots) return;

  let current = Math.max(0, Math.min(guides.length - 1, Number(localStorage.getItem("zelda-guide-index")) || 0));
  let pointerStart = null;
  const groupPromises = new Map();
  window.ZELDA_GUIDE_IMAGES = window.ZELDA_GUIDE_IMAGES || {};

  function groupPath(group) {
    return `./guides/images-${group}.json`;
  }

  function ensureGroup(group) {
    if (guides.filter((guide) => guide.group === group).every((guide) => window.ZELDA_GUIDE_IMAGES[guide.id])) {
      return Promise.resolve();
    }
    if (groupPromises.has(group)) return groupPromises.get(group);

    const promise = fetch(groupPath(group), { credentials: "same-origin" })
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load guide group ${group}`);
        return response.json();
      })
      .then((images) => {
        Object.assign(window.ZELDA_GUIDE_IMAGES, images);
      });
    groupPromises.set(group, promise);
    return promise;
  }

  function setLoading(message = "画像を読み込んでいます…", isError = false) {
    loader.textContent = message;
    loader.classList.toggle("is-error", isError);
    loader.hidden = false;
    image.hidden = true;
  }

  function updateDots() {
    [...dots.children].forEach((dot, index) => {
      const active = index === current;
      dot.setAttribute("aria-selected", String(active));
      dot.tabIndex = active ? 0 : -1;
      if (active) dot.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
  }

  function preload(index) {
    const normalized = (index + guides.length) % guides.length;
    const guide = guides[normalized];
    ensureGroup(guide.group).then(() => {
      const source = window.ZELDA_GUIDE_IMAGES[guide.id];
      if (source) new Image().src = source;
    }).catch(() => {});
  }

  async function render() {
    const guide = guides[current];
    localStorage.setItem("zelda-guide-index", String(current));
    counter.textContent = `${guide.id} / ${String(guides.length).padStart(2, "0")}`;
    title.textContent = guide.title;
    image.alt = `立ち回り画像ガイド ${guide.id}「${guide.title}」`;
    stage.setAttribute("aria-label", `${guide.title}を拡大表示`);
    updateDots();
    setLoading();

    try {
      await ensureGroup(guide.group);
      const source = window.ZELDA_GUIDE_IMAGES[guide.id];
      if (!source) throw new Error("Image data missing");
      image.onload = () => {
        loader.hidden = true;
        image.hidden = false;
      };
      image.src = source;
      preload(current - 1);
      preload(current + 1);
    } catch (error) {
      setLoading("画像を読み込めませんでした。通信環境を確認してください。", true);
    }
  }

  function move(delta) {
    current = (current + delta + guides.length) % guides.length;
    render();
  }

  dots.innerHTML = guides.map((guide, index) => `
    <button class="guide-dot" type="button" role="tab" aria-label="${guide.id} ${guide.title}" aria-selected="${index === current}" data-guide-index="${index}">${guide.id}</button>
  `).join("");

  drawer.addEventListener("toggle", () => {
    if (drawer.open) render();
  });

  previous.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));

  dots.addEventListener("click", (event) => {
    const dot = event.target.closest("[data-guide-index]");
    if (!dot) return;
    current = Number(dot.dataset.guideIndex);
    render();
  });

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    }
  });

  stage.addEventListener("pointerdown", (event) => {
    pointerStart = { x: event.clientX, y: event.clientY };
  });

  stage.addEventListener("pointerup", (event) => {
    if (!pointerStart) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
  });

  stage.addEventListener("pointercancel", () => { pointerStart = null; });

  stage.addEventListener("click", () => {
    if (image.hidden || !image.src) return;
    const guide = guides[current];
    dialogImage.src = image.src;
    dialogImage.alt = image.alt;
    dialogCaption.textContent = `${guide.id} / 12　${guide.title}`;
    if (typeof dialog.showModal === "function") dialog.showModal();
  });

  dialogClose.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  document.querySelectorAll('a[href="#visual-guides"]').forEach((link) => {
    link.addEventListener("click", () => {
      drawer.open = true;
      render();
    });
  });
})();
