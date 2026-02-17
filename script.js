import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* =========================
   Firebase 설정
========================= */

const firebaseConfig = {
  apiKey: "AIzaSyClbO21LSFjD2airEVxUQoahH9cxlO1U4g",
  authDomain: "msdigitalnamecard.firebaseapp.com",
  projectId: "msdigitalnamecard",
  storageBucket: "msdigitalnamecard.firebasestorage.app",
  messagingSenderId: "80716464511",
  appId: "1:80716464511:web:826376ab3ec8dd5dcfda4a",
  measurementId: "G-HWTHFY2M3H"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* =========================
   명함 불러오기
========================= */

async function loadCard() {
  const docRef = doc(db, "card", "main");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    if (document.getElementById("name")) document.getElementById("name").innerText = data.name || "";
    if (document.getElementById("intro")) document.getElementById("intro").innerText = data.intro || "";
    if (document.getElementById("career")) document.getElementById("career").innerText = data.career || "";
    if (document.getElementById("instagram")) document.getElementById("instagram").href = data.instagram || "#";
    if (document.getElementById("kakao")) document.getElementById("kakao").href = data.kakao || "#";
    if (document.getElementById("profileImage")) document.getElementById("profileImage").src = data.image || "";
  }
}

/* =========================
   관리자 저장
========================= */

window.saveAdmin = async function () {
  const file = document.getElementById("editImage")?.files[0];
  let imageBase64 = null;

  if (file) {
    const reader = new FileReader();
    reader.onload = async function (e) {
      imageBase64 = e.target.result;
      await saveCardData(imageBase64);
    };
    reader.readAsDataURL(file);
  } else {
    await saveCardData(null);
  }
};

async function saveCardData(imageBase64) {
  const docRef = doc(db, "card", "main");

  const data = {
    name: document.getElementById("editName")?.value || "",
    intro: document.getElementById("editIntro")?.value || "",
    career: document.getElementById("editCareer")?.value || "",
    instagram: document.getElementById("editInstagram")?.value || "",
    kakao: document.getElementById("editKakao")?.value || ""
  };

  if (imageBase64) data.image = imageBase64;

  await setDoc(docRef, data, { merge: true });

  alert("저장 완료");
  location.reload();
}

/* =========================
   이미지 저장
========================= */

window.downloadImage = function () {
  const card = document.getElementById("card");
  if (!card) return;

  html2canvas(card).then((canvas) => {
    const link = document.createElement("a");
    link.download = "digital_card.png";
    link.href = canvas.toDataURL();
    link.click();
  });
};

/* =========================
   게시판
========================= */

window.addPost = async function () {
  const writer = document.getElementById("writer")?.value;
  const content = document.getElementById("content")?.value;

  if (!writer || !content) {
    alert("작성자와 내용을 입력하세요.");
    return;
  }

  await addDoc(collection(db, "posts"), {
    writer,
    content,
    date: new Date(),
    replies: []
  });

  document.getElementById("content").value = "";
};

window.addReply = async function (postId) {
  const replyInput = document.getElementById("reply-" + postId);
  if (!replyInput.value) return;

  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);

  if (postSnap.exists()) {
    const postData = postSnap.data();
    const updatedReplies = postData.replies || [];

    updatedReplies.push({
      writer: "익명",
      content: replyInput.value,
      date: new Date()
    });

    await updateDoc(postRef, { replies: updatedReplies });
  }
};

function loadPosts() {
  const postList = document.getElementById("postList");
  if (!postList) return;

  const q = query(collection(db, "posts"), orderBy("date", "desc"));

  onSnapshot(q, (snapshot) => {
    postList.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const postId = docSnap.id;

      const div = document.createElement("div");
      div.className = "post";

      div.innerHTML = `
        <strong>${data.writer}</strong>
        <p>${data.content}</p>
        <small>${data.date?.seconds ? new Date(data.date.seconds * 1000).toLocaleString() : ""}</small>
        <br><br>
        <input type="text" id="reply-${postId}" placeholder="답글 작성">
        <button onclick="addReply('${postId}')">답글</button>
        <div id="replies-${postId}"></div>
      `;

      postList.appendChild(div);

      const replyBox = document.getElementById("replies-" + postId);
      (data.replies || []).forEach((reply) => {
        const p = document.createElement("p");
        p.innerHTML = `↳ <b>${reply.writer}</b> : ${reply.content}`;
        replyBox.appendChild(p);
      });
    });
  });
}

/* =========================
   관리자 단축키
========================= */

let adminOpened = false;
let shiftPressed = false;
let onePressed = false;
let twoPressed = false;

document.addEventListener("keydown", (event) => {
  if (event.key === "Shift") shiftPressed = true;
  if (event.key === "!") onePressed = true;
  if (event.key === "@") twoPressed = true;

  if (shiftPressed && onePressed && twoPressed && !adminOpened) {
    const panel = document.getElementById("adminPanel");
    if (panel) {
      panel.style.display = "block";
      adminOpened = true;
    }
  }

  if (event.key === "Escape") closeAdmin();
});

document.addEventListener("keyup", (event) => {
  if (event.key === "Shift") shiftPressed = false;
  if (event.key === "!") onePressed = false;
  if (event.key === "@") twoPressed = false;
});

window.closeAdmin = function () {
  const panel = document.getElementById("adminPanel");
  if (panel) {
    panel.style.display = "none";
    adminOpened = false;
  }
};

/* ========================= */

window.addEventListener("DOMContentLoaded", () => {
  loadCard();
  loadPosts();
});
