document.addEventListener("DOMContentLoaded", () => {
  /*
   *検索
   */
  const form = document.getElementById("searchForm");
  const input = document.getElementById("searchInput");

  async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  if (form && input) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const key = input.value.trim().normalize("NFKC");
      if (!key) return;

      const keyHash = await sha256Hex(key);

      const hit =
        typeof members !== "undefined" &&
        Array.isArray(members) &&
        members.find(
          (member) =>
            Array.isArray(member.hashes) && member.hashes.includes(keyHash)
        );

      if (hit && hit.link) {
        location.href = hit.link;
      } else {
        alert("…検索ワードに合うものが見つかりませんでした");
      }
    });
  }

  /*
   * こする（スクラッチ）
   */
  const space = document.getElementById("mystery-space");
  const message = document.getElementById("secret-message");

  if (space && message) {
    let scratchDistance = 0;
    let lastX = 0;
    let lastY = 0;
    let isScrubbing = false;

    const threshold = 5000; // こする量
    let revealed = false;

    function reveal() {
      if (revealed) return;
      revealed = true;
      message.style.opacity = "1";
      space.classList.add("revealed");
    }

    function handleMove(e) {
      if (!isScrubbing) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (lastX !== 0 && lastY !== 0) {
        const dx = clientX - lastX;
        const dy = clientY - lastY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        scratchDistance += dist;

        if (scratchDistance > threshold) reveal();
      }

      lastX = clientX;
      lastY = clientY;
    }

    const startScrub = () => {
      isScrubbing = true;
    };
    const stopScrub = () => {
      isScrubbing = false;
      lastX = 0;
      lastY = 0;
    };

    // PC
    space.addEventListener("mousedown", startScrub);
    window.addEventListener("mouseup", stopScrub);
    space.addEventListener("mousemove", handleMove);

    // スマホ
    space.addEventListener(
      "touchstart",
      (e) => {
        if (e.cancelable) e.preventDefault();
        startScrub();
      },
      { passive: false }
    );

    space.addEventListener("touchend", stopScrub);

    space.addEventListener(
      "touchmove",
      (e) => {
        if (e.cancelable) e.preventDefault();
        handleMove(e);
      },
      { passive: false }
    );
  }

  /* 
   * 画像を5回クリック → secret.txt を読み込んで表示
   */
  const image = document.getElementById("clickable-image");
  const secretText = document.getElementById("secret-text");

  if (image && secretText) {
    let clickCount = 0;
    let loaded = false;

    
    const SECRET_URL = "/サークルサイト/js/secret.txt";


    image.addEventListener("click", async () => {
      clickCount++;

      if (clickCount !== 5 || loaded) return;
      loaded = true;

      try {
        const res = await fetch(SECRET_URL, { cache: "no-store" });
        if (!res.ok) throw new Error("fetch failed");

        const msg = (await res.text()).trim();
        secretText.textContent = msg || "（メッセージが空です）";
        secretText.classList.add("show");
      } catch (e) {
        loaded = false; 
        secretText.textContent =
          "読み込みに失敗しました。secret.txt の配置パスを確認してください。";
        secretText.classList.add("show");
      }
    });
  }
});
