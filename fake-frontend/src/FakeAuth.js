import React, { useState } from 'react';
import { auth } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  deleteUser,
  signOut,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { db } from './firebase';
import { doc, setDoc, getDocs, query, collection, where, deleteDoc } from 'firebase/firestore';

export default function FakeAuth() {
  // 회원가입 상태
  const [signupId, setSignupId] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupBirth, setSignupBirth] = useState('');
  const [signupPhone, setSignupPhone] = useState('');

  // 로그인 상태
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // 아이디 찾기 상태
  const [findIdName, setFindIdName] = useState('');
  const [foundId, setFoundId] = useState('');

  // 비밀번호 재설정 상태
  const [resetId, setResetId] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  // 로그아웃/탈퇴 상태
  const [deletePassword, setDeletePassword] = useState('');

  const handleSignup = async () => {
    if (signupPassword !== signupConfirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const idCheck = await getDocs(query(collection(db, 'users'), where('userId', '==', signupId)));
    if (!idCheck.empty) {
      alert('이미 존재하는 아이디입니다.');
      return;
    }

    const emailCheck = await getDocs(query(collection(db, 'users'), where('email', '==', signupEmail)));
    if (!emailCheck.empty) {
      alert('이미 사용 중인 이메일입니다.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      const uid = userCredential.user.uid;
      await setDoc(doc(db, 'users', uid), {
        userId: signupId,
        name: signupName,
        birth: signupBirth,
        phone: signupPhone,
        email: signupEmail
      });
      alert("회원가입 성공!");
    } catch (error) {
      alert(`회원가입 실패: ${error.message}`);
    }
  };

  const handleLogin = async () => {
    try {
      const q = query(collection(db, 'users'), where('userId', '==', loginId));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        alert("해당 아이디로 가입된 계정이 없습니다.");
        return;
      }
      const userDoc = querySnapshot.docs[0].data();
      await signInWithEmailAndPassword(auth, userDoc.email, loginPassword);
      alert("로그인 성공!");
    } catch (error) {
      alert(`로그인 실패: ${error.message}`);
    }
  };

  const handlePasswordReset = async () => {
    try {
      const q = query(collection(db, 'users'), where('userId', '==', resetId), where('email', '==', resetEmail));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        alert('아이디와 이메일이 일치하는 사용자를 찾을 수 없습니다.');
        return;
      }
      await sendPasswordResetEmail(auth, resetEmail);
      alert("비밀번호 재설정 이메일이 전송되었습니다.");
    } catch (error) {
      alert(`재설정 실패: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("로그아웃 되었습니다.");
    } catch (error) {
      alert(`로그아웃 실패: ${error.message}`);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("로그인이 필요합니다.");
        return;
      }

      const email = user.email;
      const credential = EmailAuthProvider.credential(email, deletePassword);
      await reauthenticateWithCredential(user, credential);

      await deleteDoc(doc(db, 'users', user.uid));
      await deleteUser(user);
      alert("회원 탈퇴가 완료되었습니다.");
    } catch (error) {
      alert(`회원 탈퇴 실패: ${error.message}`);
    }
  };

  const handleFindId = async () => {
    try {
      const q = query(collection(db, 'users'), where('name', '==', findIdName));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setFoundId('해당 이름으로 등록된 계정이 없습니다.');
        return;
      }
      const userDoc = querySnapshot.docs[0].data();
      setFoundId(userDoc.userId);
    } catch (error) {
      alert(`아이디 찾기 실패: ${error.message}`);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-8">
      {/* 회원가입 */}
      <div className="border p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-2">1. 회원가입</h2>
        <input type="text" placeholder="아이디" value={signupId} onChange={(e) => setSignupId(e.target.value)} className="border p-2 w-full mb-2 rounded" />
        <input type="text" placeholder="이름" value={signupName} onChange={(e) => setSignupName(e.target.value)} className="border p-2 w-full mb-2 rounded" />
        <input type="text" placeholder="생년월일 (YYYY-MM-DD)" value={signupBirth} onChange={(e) => setSignupBirth(e.target.value)} className="border p-2 w-full mb-2 rounded" />
        <input type="text" placeholder="휴대폰 번호" value={signupPhone} onChange={(e) => setSignupPhone(e.target.value)} className="border p-2 w-full mb-2 rounded" />
        <input type="email" placeholder="이메일" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} className="border p-2 w-full mb-2 rounded" />
        <input type="password" placeholder="비밀번호" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} className="border p-2 w-full mb-2 rounded" />
        <input type="password" placeholder="비밀번호 확인" value={signupConfirmPassword} onChange={(e) => setSignupConfirmPassword(e.target.value)} className="border p-2 w-full mb-2 rounded" />
        <button onClick={handleSignup} className="bg-purple-500 text-white p-2 rounded w-full">
          가입하기
        </button>
      </div>

      {/* 로그인 */}
      <div className="border p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-2">2. 로그인</h2>
        <input type="text" placeholder="아이디" value={loginId} onChange={(e) => setLoginId(e.target.value)} className="border p-2 w-full mb-2 rounded" />
        <input type="password" placeholder="비밀번호" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="border p-2 w-full mb-2 rounded" />
        <button onClick={handleLogin} className="bg-green-600 text-white p-2 rounded w-full">
          로그인
        </button>
      </div>

      {/* 아이디 찾기 */}
      <div className="border p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-2">3. 아이디 찾기 (이름 기준)</h2>
        <input
          type="text"
          placeholder="이름 입력"
          value={findIdName}
          onChange={(e) => setFindIdName(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />
        <button onClick={handleFindId} className="bg-yellow-500 text-white p-2 rounded w-full">
          아이디 찾기
        </button>
        {foundId && <p className="mt-2">찾은 아이디: <strong>{foundId}</strong></p>}
      </div>

      {/* 비밀번호 재설정 */}
      <div className="border p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-2">4. 비밀번호 재설정 (아이디 + 이메일)</h2>
        <input type="text" placeholder="아이디 입력" value={resetId} onChange={(e) => setResetId(e.target.value)} className="border p-2 w-full mb-2 rounded" />
        <input type="email" placeholder="이메일 입력" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="border p-2 w-full mb-2 rounded" />
        <button onClick={handlePasswordReset} className="bg-blue-500 text-white p-2 rounded w-full mb-2">
          재설정 이메일 보내기
        </button>
      </div>

      {/* 로그아웃 */}
      <div className="border p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-2">5. 로그아웃</h2>
        <button onClick={handleLogout} className="bg-gray-600 text-white p-2 rounded w-full">
          로그아웃
        </button>
      </div>

      {/* 회원 탈퇴 */}
      <div className="border p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-2">6. 회원 탈퇴</h2>
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={deletePassword}
          onChange={(e) => setDeletePassword(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />
        <button onClick={handleDeleteAccount} className="bg-red-600 text-white p-2 rounded w-full">
          회원 탈퇴하기
        </button>
      </div>
    </div>
  );
}
