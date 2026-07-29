"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  readProfile,
  readSavedWork,
  removeSavedWork,
  type SavedProject,
  type SavedWork,
  writeProfile,
  writeSavedWork,
} from "../../lib/account/saved-work";

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function SavedWorkClient() {
  const [displayName, setDisplayName] = useState("");
  const [items, setItems] = useState<SavedWork[]>([]);
  const [projectName, setProjectName] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    setDisplayName(readProfile(window.localStorage).displayName);
    setItems(readSavedWork(window.localStorage));
  }, []);

  function saveProfile() {
    writeProfile(window.localStorage, { displayName });
    setDisplayName(displayName.trim().slice(0, 40));
    setStatus("이 브라우저에서 사용할 이름을 저장했어요.");
  }

  function addProject() {
    const title = projectName.trim();
    if (!title) {
      setStatus("프로젝트 이름을 입력해주세요.");
      return;
    }
    const project: SavedProject = {
      id: createId("project"),
      kind: "project",
      title: title.slice(0, 60),
      createdAt: new Date().toISOString(),
      href: "/pro",
    };
    const next = [project, ...items].slice(0, 50);
    writeSavedWork(window.localStorage, next);
    setItems(next);
    setProjectName("");
    setStatus("새 전문가 프로젝트를 저장했어요.");
  }

  function remove(id: string) {
    const next = removeSavedWork(items, id);
    writeSavedWork(window.localStorage, next);
    setItems(next);
    setStatus("저장 항목을 삭제했어요.");
  }

  return (
    <div className="accountGrid">
      <section className="accountCard" aria-labelledby="profile-title">
        <p className="accountKicker">공유 프로필</p>
        <h2 id="profile-title">계산과 전문가 작업에 같은 이름을 사용해요</h2>
        <p>현재 단계에서는 로그인 서버 없이 이 브라우저에만 저장됩니다. 연락처나 상세 주소는 저장하지 않아요.</p>
        <label className="accountField">
          <span>표시 이름</span>
          <input value={displayName} maxLength={40} onChange={(event) => setDisplayName(event.target.value)} placeholder="예: 김태양" />
        </label>
        <button className="accountPrimary" type="button" onClick={saveProfile}>프로필 저장</button>
      </section>

      <section className="accountCard" aria-labelledby="new-project-title">
        <p className="accountKicker">전문가 프로젝트</p>
        <h2 id="new-project-title">다음 분석을 위한 프로젝트를 만들어두세요</h2>
        <p>프로젝트를 열면 `/pro`에서 위치와 시스템 조건을 입력해 새 분석을 시작합니다.</p>
        <label className="accountField">
          <span>프로젝트 이름</span>
          <input value={projectName} maxLength={60} onChange={(event) => setProjectName(event.target.value)} placeholder="예: 화성 공장 지붕 검토" />
        </label>
        <button className="accountPrimary" type="button" onClick={addProject}>프로젝트 저장</button>
      </section>

      <section className="savedSection" aria-labelledby="saved-title">
        <div className="savedHeader">
          <div><p className="accountKicker">저장한 작업</p><h2 id="saved-title">계산과 프로젝트를 한곳에서 이어가세요</h2></div>
          <span>{items.length}개</span>
        </div>
        {status && <p className="accountStatus" role="status">{status}</p>}
        {items.length === 0 ? (
          <div className="savedEmpty"><strong>아직 저장한 작업이 없어요.</strong><p>계산 결과에서 저장하거나 새 전문가 프로젝트를 만들어보세요.</p><Link href="/#calculator">설치 가능 용량 계산하기 →</Link></div>
        ) : (
          <ul className="savedList">
            {items.map((item) => (
              <li key={item.id}>
                <div>
                  <span>{item.kind === "calculation" ? "일반 계산" : "전문가 프로젝트"}</span>
                  <h3>{item.title}</h3>
                  {item.kind === "calculation" ? <p>{item.capacityKw.toLocaleString("ko-KR")}kW · 연간 {item.annualGenerationKwh.toLocaleString("ko-KR")}kWh · {item.goal === "save" ? "절감" : "발전 수익"}</p> : <p>전문가 워크스페이스에서 조건을 입력해 분석을 시작하세요.</p>}
                  <small>{new Date(item.createdAt).toLocaleString("ko-KR")}</small>
                </div>
                <div className="savedActions"><Link href={item.href}>열기</Link><button type="button" onClick={() => remove(item.id)} aria-label={`${item.title} 삭제`}>삭제</button></div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
