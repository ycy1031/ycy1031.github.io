const wrap   = document.getElementById("scratchWrap");
const img    = document.getElementById("scratchImage");
const canvas = document.getElementById("scratchCanvas");
const ctx    = canvas.getContext("2d");

let isDrawing = false;

const overlayImg = new Image();
overlayImg.src = "img/m1.png";

overlayImg.addEventListener("load", () => {
  resizeCanvasToImage();
});

function resizeCanvasToImage() {
  const imgRect  = img.getBoundingClientRect();
  const wrapRect = wrap.getBoundingClientRect();
  const dpr      = window.devicePixelRatio || 1;

  if (imgRect.width === 0 || imgRect.height === 0) return;

  canvas.width  = imgRect.width * dpr;
  canvas.height = imgRect.height * dpr;

  canvas.style.width  = imgRect.width + "px";
  canvas.style.height = imgRect.height + "px";

  canvas.style.left = (imgRect.left - wrapRect.left) + "px";
  canvas.style.top  = (imgRect.top  - wrapRect.top)  + "px";

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  // ==============================
  // 🔥 처음엔 m1.png를 캔버스에 꽉 차게 덮기
  // ==============================
  ctx.globalCompositeOperation = "source-over";

  if (overlayImg.complete && overlayImg.naturalWidth) {
    ctx.drawImage(overlayImg, 0, 0, imgRect.width, imgRect.height);
  }

  ctx.globalCompositeOperation = "destination-out";
}

img.addEventListener("load", resizeCanvasToImage);
window.addEventListener("resize", resizeCanvasToImage);

if (img.complete) {
  resizeCanvasToImage();
}

function getCanvasPos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function eraseAt(x, y) {
  requestAnimationFrame(() => {
    ctx.beginPath();
    ctx.arc(x, y, 100, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  });
}

function createParticles(pageX, pageY) {
  const count = 8 + Math.floor(Math.random() * 5);

  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "scratch-particle";

    const hue = Math.floor(Math.random() * 360);
    p.style.background = `radial-gradient(circle, hsla(${hue}, 90%, 80%, 1), hsla(${hue}, 90%, 60%, 0.2))`;
    p.style.boxShadow  = `0 0 12px hsla(${hue}, 90%, 70%, 0.9)`;

    p.style.left = pageX + "px";
    p.style.top  = pageY + "px";

    document.body.appendChild(p);

    requestAnimationFrame(() => {
      const angle = Math.random() * Math.PI * 2;
      const dist  = 40 + Math.random() * 60;
      const dx    = Math.cos(angle) * dist;
      const dy    = Math.sin(angle) * dist * 0.7;
      const scale = 0.3 + Math.random() * 0.5;

      p.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`;
      p.style.opacity   = "0";
      p.style.filter    = "blur(3px)";
    });

    setTimeout(() => p.remove(), 900);
  }
}

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  const { x, y } = getCanvasPos(e);
  eraseAt(x, y);
  createParticles(e.clientX, e.clientY);
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;
  const { x, y } = getCanvasPos(e);
  eraseAt(x, y);
  createParticles(e.clientX, e.clientY);
});

window.addEventListener("mouseup", () => {
  isDrawing = false;
});
canvas.addEventListener("mouseleave", () => {
  isDrawing = false;
});


// =========================
// P 섹션 이미지 토글
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const pSection = document.getElementById("pSection");
  if (!pSection) return;

  const stepButtons = pSection.querySelectorAll(".p-step-btn");
  const stepImages  = pSection.querySelectorAll(".p-img");

  function showStep(step) {
    stepImages.forEach((img) => {
      const imgStep = img.getAttribute("data-img");
      img.classList.toggle("is-active", imgStep === step);
    });

    stepButtons.forEach((btn) => {
      btn.classList.toggle(
        "is-active",
        btn.getAttribute("data-step") === step
      );
    });
  }

  stepButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const step = btn.getAttribute("data-step");
      showStep(step);
    });
  });
});


// =========================
// R 섹션 레이어 토글
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const rSection = document.getElementById("rSection");
  if (!rSection) return;

  const toggleBtn = rSection.querySelector(".r-toggle-btn");
  const layers   = rSection.querySelectorAll(".r-layer");
  const finalImg = rSection.querySelector(".r-img-final");

  let merged = false;

  function updateLayers() {
    if (merged) {
      layers.forEach(layer => {
        layer.classList.add("align");
      });
      finalImg.style.opacity = "1";
      toggleBtn.classList.add("is-on");
    } else {
      layers.forEach(layer => {
        layer.classList.remove("align");
      });
      finalImg.style.opacity = "0";
      toggleBtn.classList.remove("is-on");
    }
  }

  toggleBtn.addEventListener("click", () => {
    merged = !merged;
    updateLayers();
  });

  updateLayers();
});

// =========================
// D 섹션: 드래그 슬라이더로 단계/줌 제어
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const dSection = document.getElementById("dSection");
  if (!dSection) return;

  const imgs   = dSection.querySelectorAll(".d-img");
  const track  = dSection.querySelector(".d-slider-track");
  const handle = document.getElementById("dSliderHandle");

  let dragging = false;
  let trackRect = null;

  function updateByProgress(p) {
    p = Math.min(1, Math.max(0, p));

    let step = 1;
    if (p > 0.66) step = 3;
    else if (p > 0.33) step = 2;

    imgs.forEach((img) => {
      const s = Number(img.dataset.step);
      img.classList.toggle("is-active", s === step);

      if (s === step) {
        const scale = 1 + p * 0.1;
        img.style.transform = `scale(${scale})`;
      } else {
        img.style.transform = "scale(1)";
      }
    });

    const handleY = p * trackRect.height;
    handle.style.top = handleY + "px";
  }

  function startDrag(e) {
    dragging = true;
    handle.classList.add("is-dragging");
    trackRect = track.getBoundingClientRect();
    moveDrag(e);
    window.addEventListener("mousemove", moveDrag);
    window.addEventListener("mouseup", endDrag);
  }

  function moveDrag(e) {
    if (!dragging) return;

    const y = e.clientY - trackRect.top;
    const p = y / trackRect.height;
    updateByProgress(p);
  }

  function endDrag() {
    dragging = false;
    handle.classList.remove("is-dragging");
    window.removeEventListener("mousemove", moveDrag);
    window.removeEventListener("mouseup", endDrag);
  }

  track.addEventListener("mousedown", (e) => {
    trackRect = track.getBoundingClientRect();
    startDrag(e);
  });

  handle.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    startDrag(e);
  });

  trackRect = track.getBoundingClientRect();
  updateByProgress(0);
});



// =====================================
// 돋보기 스크립트
// =====================================
document.addEventListener("DOMContentLoaded", () => {
  const zoomImages = document.querySelectorAll(".zoomable");

  const scratchWrap   = document.getElementById("scratchWrap");
  const scratchToggle = document.getElementById("scratchZoomToggle");
  let scratchZoomOn   = false;

  if (scratchWrap && scratchToggle) {
    scratchToggle.addEventListener("click", () => {
      scratchZoomOn = !scratchZoomOn;
      scratchWrap.classList.toggle("zoom-mode", scratchZoomOn);

      if (!scratchZoomOn) {
        const mags = scratchWrap.querySelectorAll(".magnifier");
        mags.forEach((m) => (m.style.opacity = 0));
        scratchWrap.classList.remove("zoom-cursor-hidden");
      }
    });
  }

  zoomImages.forEach((img) => {
    const magnifier = document.createElement("div");
    magnifier.className = "magnifier";

    const container = img.parentElement;
    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }
    container.appendChild(magnifier);

    const isScratchImg = img.id === "scratchImage";
    const isDImage     = img.classList.contains("d-img");

    magnifier.style.backgroundImage = `url(${img.src})`;

    if (isScratchImg) {
      magnifier.style.backgroundSize = "600%";
      magnifier.style.width  = "280px";
      magnifier.style.height = "280px";
    } else if (isDImage) {
      magnifier.style.backgroundSize = "450%";
      magnifier.style.width  = "260px";
      magnifier.style.height = "260px";
    } else {
      magnifier.style.backgroundSize = "350%";
    }

    img.addEventListener("mousemove", (e) => {
      if (isScratchImg && !scratchZoomOn) return;
      if (isDImage && !img.classList.contains("is-active")) return;

      const rect          = img.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;

      const magX = e.clientX - containerRect.left;
      const magY = e.clientY - containerRect.top;

      const magW = magnifier.offsetWidth || 260;
      const magH = magnifier.offsetHeight || 260;

      magnifier.style.left = `${magX - magW / 2}px`;
      magnifier.style.top  = `${magY - magH / 2}px`;

      magnifier.style.backgroundPosition = `${percentX}% ${percentY}%`;
      magnifier.style.opacity = 1;

      container.classList.add("zoom-cursor-hidden");
    });

    img.addEventListener("mouseleave", () => {
      magnifier.style.opacity = 0;
      container.classList.remove("zoom-cursor-hidden");
    });
  });
});

// =========================
// Scroll Reveal (공통)
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  const io = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
    }
  );

  revealEls.forEach((el) => io.observe(el));
});
