async function sha256Hex(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

const ANSWER_HASH =
  "9ac773aef734fd60db6f6a01b968e41cfc118d8f5859606578fda08a0cd1ef72"; //数字の「1」

document.getElementById("check").addEventListener("click", async () => {
  const input = document
    .getElementById("answer")
    .value.trim()
    .normalize("NFKC");

  if (!input) {
    document.getElementById("result").textContent = "答えを入力してください。";
    return;
  }

  const hash = await sha256Hex(input);

  if (hash === ANSWER_HASH) {
    // 正しい回答 → ページ遷移
    location.replace("end.html");
  } else {
    document.getElementById("result").textContent =
      "あなたは何かを見落としている";
  }
});
