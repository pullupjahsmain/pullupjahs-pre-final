import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore();

async function login() {
  const id = document.getElementById("id").value.trim();
  const pw = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("error-message");

  if (!id || !pw) {
    errorMsg.textContent = "아이디와 비밀번호를 입력하세요.";
    return;
  }

  try {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      errorMsg.textContent = "존재하지 않는 아이디입니다.";
      return;
    }

    const userData = docSnap.data();

    if (userData.password !== pw) {
      errorMsg.textContent = "비밀번호가 틀렸습니다.";
      return;
    }

    // 로그인 성공 시 localStorage에 저장
    localStorage.setItem("loggedInUser", id);
    localStorage.setItem("role", userData.role);

    if (userData.role === "master") {
      window.location.href = "master.html";
    } else if (userData.role === "student") {
      window.location.href = "exam.html";
    } else {
      errorMsg.textContent = "알 수 없는 사용자 역할입니다.";
    }
  } catch (error) {
    console.error("로그인 중 오류 발생:", error);
    errorMsg.textContent = "로그인 중 오류가 발생했습니다. 다시 시도하세요.";
  }
}
