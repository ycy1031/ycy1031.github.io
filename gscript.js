document.addEventListener("DOMContentLoaded", () => {
  const gSection = document.getElementById("gSection");
  if (!gSection) return;

  const canvas     = gSection.querySelector("#gCanvas");
  const mainImg    = gSection.querySelector(".g-main-img");
  const descBox    = gSection.querySelector("#gDescBox");
  const pieces     = gSection.querySelectorAll(".g-piece");
  const board      = gSection.querySelector(".g-board");
  const inlineText = gSection.querySelector(".g-inline-text");

  const totalPieces = pieces.length;
  let placedCount = 0;

  // 퍼즐 슬롯 좌표 (캔버스 비율 기준)
  const slots = {
    "1": { x: 0.45,  y: 0.4   },
    "2": { x: 0.35,  y: 0.25  },
    "3": { x: 0.62,  y: 0.34  },
    "4": { x: 0.189, y: 0.395 },
    "5": { x: 0.25,  y: 0.75  },
    "6": { x: 0.743, y: 0.705 },
    "7": { x: 0.34,  y: 0.816 },
    "8": { x: 0.519, y: 0.587 }
  };

  const SNAP_DIST = 80;

  const boardRect = board.getBoundingClientRect();

  pieces.forEach((piece) => {
    const rect = piece.getBoundingClientRect();
    const initLeft = rect.left - boardRect.left;
    const initTop  = rect.top  - boardRect.top;
    piece.dataset.initLeft = initLeft;
    piece.dataset.initTop  = initTop;
    piece.style.left = initLeft + "px";
    piece.style.top  = initTop  + "px";
  });

  // 슬롯 시각화 (개발용 도움선)
//   Object.entries(slots).forEach(([id, slot]) => {
//     const helper = document.createElement("div");
//     helper.className = "g-slot-helper";
//     helper.textContent = id;
//     helper.dataset.id = id;
//     helper.style.left = (slot.x * 100) + "%";
//     helper.style.top  = (slot.y * 100) + "%";
//     canvas.appendChild(helper);
//   });

  let dragging = null;
  let startMouseX = 0;
  let startMouseY = 0;
  let startLeft   = 0;
  let startTop    = 0;

  function onMouseMove(e) {
    if (!dragging) return;
    const dx = e.clientX - startMouseX;
    const dy = e.clientY - startMouseY;
    dragging.style.left = startLeft + dx + "px";
    dragging.style.top  = startTop  + dy + "px";
  }

  function isInCanvas(piece) {
    const canvasRect = canvas.getBoundingClientRect();
    const pieceRect  = piece.getBoundingClientRect();
    const centerX = pieceRect.left + pieceRect.width / 2;
    const centerY = pieceRect.top  + pieceRect.height / 2;

    return (
      centerX >= canvasRect.left &&
      centerX <= canvasRect.right &&
      centerY >= canvasRect.top &&
      centerY <= canvasRect.bottom
    );
  }

  function snapToSlot(piece) {
    const id   = piece.dataset.id;
    const slot = slots[id];
    if (!slot) return false;

    const canvasRect = canvas.getBoundingClientRect();
    const pieceRect  = piece.getBoundingClientRect();

    const centerX = pieceRect.left + pieceRect.width / 2;
    const centerY = pieceRect.top  + pieceRect.height / 2;

    const targetX = canvasRect.left + slot.x * canvasRect.width;
    const targetY = canvasRect.top  + slot.y * canvasRect.height;

    const dx   = centerX - targetX;
    const dy   = centerY - targetY;
    const dist = Math.hypot(dx, dy);

    if (dist > SNAP_DIST) return false;

    canvas.appendChild(piece);
    piece.classList.add("placed");

    const newLeft = slot.x * canvasRect.width - pieceRect.width / 2;
    const newTop  = slot.y * canvasRect.height - pieceRect.height / 2;

    piece.style.position = "absolute";
    piece.style.left = newLeft + "px";
    piece.style.top  = newTop  + "px";

    return true;
  }

  function resetPiece(piece) {
    const initLeft = parseFloat(piece.dataset.initLeft);
    const initTop  = parseFloat(piece.dataset.initTop);
    board.appendChild(piece);
    piece.classList.remove("placed");
    piece.style.position = "absolute";
    piece.style.left = initLeft + "px";
    piece.style.top  = initTop  + "px";
    piece.style.zIndex = "";
  }

  function onMouseUp() {
    if (!dragging) return;

    if (isInCanvas(dragging) && !dragging.classList.contains("placed")) {
      const snapped = snapToSlot(dragging);

      if (snapped) {
        placedCount += 1;

        if (placedCount >= totalPieces && !gSection.classList.contains("done")) {
          gSection.classList.add("done");

          if (inlineText) {
            inlineText.style.opacity = "0";
          }

          if (mainImg) {
            mainImg.classList.add("is-zoomed");
          }

          setTimeout(() => {
            if (descBox) {
              descBox.classList.add("is-visible");
            }
          }, 950);
        }
      } else {
        resetPiece(dragging);
      }
    } else if (!dragging.classList.contains("placed")) {
      resetPiece(dragging);
    }

    dragging = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }

  pieces.forEach((piece) => {
    piece.addEventListener("mousedown", (e) => {
      if (piece.classList.contains("placed")) return;

      dragging = piece;

      const style = getComputedStyle(piece);
      startLeft   = parseFloat(style.left);
      startTop    = parseFloat(style.top);
      startMouseX = e.clientX;
      startMouseY = e.clientY;

      piece.style.zIndex = "50";

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    });
  });
});
