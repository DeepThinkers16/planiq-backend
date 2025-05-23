import { useEffect, useState } from 'react';
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function TodayPlanDemo() {
  const [plan, setPlan] = useState([]);
  const [dday, setDday] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        alert("로그인이 필요합니다.");
        navigate("/");
        return;
      }

      setUser(u); // 인증된 유저 저장

      try {
        const planRes = await fetch(`http://localhost:8000/today_plan/${u.uid}`);
        const planData = await planRes.json();
        setPlan(planData.todo || []);

        const ddayRes = await fetch(`http://localhost:8000/dday/${u.uid}`);
        const ddayData = await ddayRes.json();
        setDday(ddayData.d_day);
      } catch (err) {
        console.error("불러오기 실패", err);
      }
    });

  }, []);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">오늘의 학습 계획</h2>
      {dday !== null && (
        <p className="text-lg font-semibold mb-2">시험일까지 D-{dday}</p>
      )}
      <ul className="space-y-2">
        {plan.map((item, idx) => (
          <li key={idx} className="border p-2 rounded bg-white shadow">
            {item.subject} - {item.hours}시간
          </li>
        ))}
      </ul>
    </div>
  );
}
