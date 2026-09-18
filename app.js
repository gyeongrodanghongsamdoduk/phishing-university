const app = document.querySelector('#app');
let level = 'elementary', stage = 0, choice = null, attempts = 0, firstTry = 0;

function renderHome(){
 stage=0; resetInvestigation();
 app.innerHTML=`<section class="hero"><div><div class="eyebrow">보고, 비교하고, 한 번 더 확인하기</div><h1>피싱 사이트,<br><em>구별할 수 있을까?</em></h1><p class="intro">문자와 사이트에서 위험 신호를 찾고,<br>실제 화면 비교 퀴즈로 피싱 구별법을 익혀 보세요.</p><div class="tags"><span class="tag">초·중학생 누구나</span><span class="tag">◷ 약 5–7분</span><span class="tag">총 3단계 퀴즈</span></div><p class="level-label">난이도를 선택하세요</p><div class="levels" role="group" aria-label="교육 난이도"><button class="level ${level==='elementary'?'selected':''}" data-level="elementary" aria-pressed="${level==='elementary'}">초등 <small>힌트 제공</small></button><button class="level ${level==='middle'?'selected':''}" data-level="middle" aria-pressed="${level==='middle'}">중등 <small>힌트 없이</small></button></div><button class="primary start" id="start">퀴즈 시작하기 <span class="arrow">↗</span></button><p class="fine">가입 없이 바로 시작 · 실제 개인정보를 입력하지 않습니다.</p></div><div class="illustration quiz-illustration"><img src="assets/logo-pishing-university.png" alt="피싱대학 로고" class="hero-logo"><div class="quiz-callout"><b>PHISHING UNIVERSITY</b><span>피싱을 구별하는 가장 좋은 습관은<br>화면보다 <strong>주소와 요구 내용</strong>을 확인하는 것.</span></div></div></section><section class="overview"><div class="section-heading"><h2>퀴즈 구성</h2><span>쉬운 문제부터 실제 화면 비교까지</span></div><div class="mission-cards"><article class="mission-card"><span class="card-icon">1</span><div><small>STEP 01</small><h3>문자·안내 판단</h3><p>피싱 의심 / 정상 안내를 고르고<br>핵심 근거 2개를 선택합니다.</p></div></article><article class="mission-card"><span class="card-icon">2</span><div><small>STEP 02</small><h3>사이트 화면 비교</h3><p>5쌍의 화면을 확대해 보며<br>어느 쪽이 피싱인지 고릅니다.</p></div></article><article class="mission-card"><span class="card-icon">3</span><div><small>STEP 03</small><h3>안전한 대처 방법</h3><p>피싱을 만났을 때 해야 할<br>안전한 행동을 선택합니다.</p></div></article></div></section><div class="notice"><b>ⓘ</b> 비교 화면은 교육용으로 만든 예시입니다. 실제 상황에서는 공식 앱·공식 주소에서 별도로 확인하세요.</div>`;
 app.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{level=b.dataset.level;renderHome()});
 document.querySelector('#start').onclick=()=>{stage=1;firstTry=0;renderMission();goTop()};
}

function shell(content){return `<section class="workspace"><div class="topline"><span class="eyebrow">${level==='elementary'?'초등':'중등'} 난이도 · ${stage<4?'퀴즈 진행 중':'완료'}</span><button class="text-button" id="exit">처음으로</button></div><div class="progress" aria-label="총 3단계 중 ${Math.min(stage,3)}단계"><span class="on"></span><span class="${stage>=2?'on':''}"></span><span class="${stage>=3?'on':''}"></span></div>${content}</section>`}
function bindExit(){document.querySelector('#exit').onclick=()=>{if(stage===4||window.confirm('퀴즈를 종료하고 처음으로 돌아갈까요? 현재 진행은 초기화됩니다.')){renderHome();goTop()}}}
function goTop(){window.scrollTo({top:0,behavior:'instant'});const title=app.querySelector('h1');if(title){title.tabIndex=-1;title.focus({preventScroll:true})}}

const situations=[
 {q:'선물 링크가 왔을 때 가장 안전한 행동은?',desc:'무료 게임 아이템을 준다는 문자를 받았습니다.',options:['문자 속 링크를 눌러 내용을 확인한다.','문자 링크는 누르지 않고 평소 사용하던 공식 앱에서 이벤트를 확인한다.','친구에게 링크를 보내 대신 눌러 달라고 한다.'],answer:1,why:'메시지 안의 링크가 아니라 내가 원래 알고 있던 공식 앱이나 공식 주소를 직접 이용해 확인하는 것이 안전합니다.',wrong:'문자 속 링크를 직접 누르거나 다른 사람에게 전달하지 말고, 메시지와 독립된 공식 경로로 확인하세요.'},
 {q:'가짜 사이트에 비밀번호를 입력했다면?',desc:'입력한 뒤에 피싱 사이트였다는 사실을 알게 되었습니다.',options:['아무에게도 말하지 않고 기다린다.','같은 사이트에 인증번호도 입력한다.','더 이상 입력하지 않고 공식 사이트에서 비밀번호를 바꾼 뒤 보호자·선생님에게 알린다.'],answer:2,why:'추가 정보 입력을 즉시 중단하고 공식 사이트나 앱에서 비밀번호를 바꾸는 것이 우선입니다. 같은 비밀번호를 쓰는 다른 계정도 함께 점검하세요.',wrong:'추가 인증정보를 제공하지 말고, 공식 경로에서 비밀번호를 변경하고 믿을 수 있는 어른에게 알려야 합니다.'},
 {q:'친구 계정에서 인증번호를 보내 달라고 하면?',desc:'친구가 “내 폰이 고장 났어. 네 폰에 오는 인증번호 좀 보내 줘”라고 메시지를 보냈습니다.',options:['친구 계정이므로 바로 보낸다.','인증번호를 보내지 않고 평소 알고 있던 전화번호로 친구에게 직접 확인한다.','메시지에 새로 적혀 있는 번호로만 연락한다.'],answer:1,why:'친구 계정이 탈취됐을 수도 있습니다. 인증번호는 공유하지 말고, 기존에 알고 있던 별도의 연락수단으로 본인 여부를 확인하세요.',wrong:'계정 이름과 프로필 사진만으로 본인이라고 확신할 수 없습니다. 인증번호는 공유하지 않는 것이 원칙입니다.'}
];

let questionIndex=0;
function renderAction(){if(choice===null&&attempts===0)questionIndex=0;drawAction()}
function drawAction(){const s=situations[questionIndex],correct=choice===s.answer;
 app.innerHTML=shell(`<div class="eyebrow">대처 방법 퀴즈 · ${questionIndex+1} / ${level==='middle'?3:2}</div><h1 class="mission-title">${s.q}</h1><p class="subtitle">${s.desc}</p><div class="choices">${s.options.map((x,i)=>`<button class="choice ${choice===i?'chosen':''}" data-choice="${i}" ${correct?'disabled':''}>${String.fromCharCode(65+i)}. ${x}</button>`).join('')}</div><div aria-live="polite">${choice!==null?`<div class="feedback ${correct?'success':''}"><b>${correct?'✓ 정답입니다.':'다시 생각해 보세요.'}</b><br>${correct?s.why:s.wrong}</div>`:''}</div><div class="bottom-actions"><span class="count">틀리면 다시 선택할 수 있습니다.</span><button class="primary" id="action-next" ${correct?'':'disabled'}>${questionIndex===(level==='middle'?2:1)?'결과 보기':'다음 문제'} →</button></div>`);bindExit();
 app.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{choice=Number(b.dataset.choice);attempts++;if(choice===s.answer&&attempts===1)firstTry++;drawAction()});
 document.querySelector('#action-next').onclick=()=>{if(!correct)return;if(questionIndex===(level==='middle'?2:1)){stage=4;renderResult()}else{questionIndex++;choice=null;attempts=0;drawAction()}goTop()};
}

function renderResult(){
 app.innerHTML=shell(`<div class="certificate"><img src="assets/logo-pishing-university.png" class="result-logo" alt="피싱대학 로고"><span class="tag">${level==='elementary'?'초등':'중등'} 난이도 완료</span><h1 class="mission-title">피싱 구별 퀴즈 완료!</h1><p>화면이 비슷해도 주소와 요구 내용을 확인하면<br>피싱의 위험 신호를 더 잘 찾을 수 있습니다.</p><div class="rules"><span>① 링크보다 주소 확인</span><span>② 비밀번호·인증번호 요구 주의</span><span>③ 공식 경로에서 재확인</span></div><p>기초 판단 ${caseFiles.length}문제 · 첫 제출 정답 ${investigationScore} / ${caseFiles.length}<br>화면 비교 ${siteQuizCases.length}문제 · 첫 시도 정답 ${siteQuizScore} / ${siteQuizCases.length}<br>대처 방법 · 첫 시도 정답 ${firstTry}개</p><p class="fine">${new Date().toLocaleDateString('ko-KR')} · 정보과학의 날</p></div><div class="result-actions"><button class="primary" id="print">결과 인쇄 / PDF 저장 ↗</button><button class="secondary" id="restart">처음부터 다시 하기 ↻</button></div><div class="help-box"><h3>실제로 피싱이 의심된다면</h3>링크를 더 누르거나 정보를 추가 입력하지 말고, 사용하던 공식 앱이나 직접 입력한 공식 주소에서 계정 상태를 확인하세요. 비밀번호를 입력했다면 공식 경로에서 즉시 변경하고 보호자나 선생님에게 알려 도움을 받으세요.</div>`);
 bindExit();document.querySelector('#print').onclick=()=>window.print();document.querySelector('#restart').onclick=()=>{choice=null;attempts=0;firstTry=0;renderHome();goTop()};
}
renderHome();
