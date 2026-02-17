import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
   명함 데이터 불러오기
========================= */

async function loadCard() {
    const querySnapshot = await getDocs(collection(db, "card"));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        document.getElementById("name").innerText = data.name;
        document.getElementById("intro").innerText = data.intro;
        document.getElementById("career").innerText = data.career;
        document.getElementById("instagram").href = data.instagram;
        document.getElementById("kakao").href = data.kakao;
        document.getElementById("profileImage").src = data.image;
    });
}

/* =========================
   관리자 저장
========================= */

window.saveAdmin = async function() {
    const file = document.getElementById("editImage").files[0];
    let imageBase64 = "";

    if(file){
        const reader = new FileReader();
        reader.onload = async function(e){
            imageBase64 = e.target.result;
            await setDoc(doc(db,"card","main"),{
                name: editName.value,
                intro: editIntro.value,
                career: editCareer.value,
                instagram: editInstagram.value,
                kakao: editKakao.value,
                image: imageBase64
            });
            alert("저장 완료");
            location.reload();
        }
        reader.readAsDataURL(file);
    }
}

/* =========================
   게시판
========================= */

window.addPost = async function(){
    await addDoc(collection(db,"posts"),{
        writer: writer.value,
        content: content.value,
        date: new Date()
    });
}

function loadPosts(){
    const postList = document.getElementById("postList");
    if(!postList) return;

    onSnapshot(collection(db,"posts"), snapshot=>{
        postList.innerHTML="";
        snapshot.forEach(doc=>{
            const data = doc.data();
            const div = document.createElement("div");
            div.className="post";
            div.innerHTML=`
                <strong>${data.writer}</strong>
                <p>${data.content}</p>
                <small>${new Date(data.date.seconds*1000).toLocaleString()}</small>
            `;
            postList.appendChild(div);
        });
    });
}

window.onload = ()=>{
    loadCard();
    loadPosts();
}
