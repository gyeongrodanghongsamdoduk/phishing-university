const verdicts = [
 ['suspicious', '피싱 의심', '피싱으로 볼 수 있는 명확한 위험 신호가 있어요'],
 ['normal', '정상 안내', '공식 경로에서 같은 내용을 확인했어요']
];

const caseFiles = [
 {stage:1,title:'주문하지 않은 택배 문자',sender:'택배 배송 안내',context:'최근 인터넷에서 주문한 물건이 없는데 택배 문자가 왔어요.',body:'[배송안내] 주소가 정확하지 않아 배송이 보류되었습니다.\n아래 링크에서 주소를 수정하세요.\nhttps://parcel-check.example',verdict:'suspicious',hint:'실제로 주문한 물건이 있는지, 문자 속 링크에서 개인정보 수정을 요구하는지 확인해 보세요.',evidence:[['최근 주문한 물건이 없는데 배송 문제라고 한다.',true],['문자 속 링크를 눌러 주소를 수정하라고 한다.',true],['문자에 대괄호가 사용되어 있다.',false],['메시지가 세 줄로 작성되어 있다.',false]],explain:'최근 주문한 물건이 없는데 배송 문제를 주장하고, 문자 속 링크에서 주소 수정을 요구하고 있습니다. 이 두 가지가 피싱을 의심할 명확한 근거입니다. 문장 형식이나 줄 수는 피싱 여부와 관계가 없습니다.'},
 {stage:1,title:'신청한 학교 행사 안내',sender:'학교 과학부',context:'어제 학교 홈페이지에서 과학 체험 행사에 직접 신청했고, 오늘 학교 홈페이지의 공지사항을 다시 열어 확인했어요.',body:'[과학 체험 행사 안내]\n신청한 학생은 금요일 오후 4시까지 과학실로 오세요.\n준비물: 필기도구',verdict:'normal',hint:'실제로 신청한 행사인지, 메시지와 별개의 공식 경로에서도 같은 내용을 확인했는지 보세요.',evidence:[['어제 내가 직접 해당 행사에 신청했다.',true],['학교 홈페이지 공지에서 같은 시간과 장소를 다시 확인했다.',true],['메시지에 준비물이 적혀 있다.',false],['발신자 이름에 “학교”가 들어 있다.',false]],explain:'내가 실제로 신청한 행사이고, 메시지와 별개로 직접 접속한 학교 공식 홈페이지에서 같은 내용을 확인했습니다. 이 두 사실이 정상 안내라고 판단할 수 있는 근거입니다. 발신자 이름이나 준비물 표기만으로는 안전을 판단할 수 없습니다.'},

];

// 정답 방향이 한쪽으로 몰리지 않도록 의도적으로 순서를 섞었습니다.
const siteQuizCases = [
 {title:'쇼핑몰 화면', image:'assets/site-quiz-01.png', answer:'right', explain:'오른쪽 주소는 coupang-sale.com으로, 왼쪽의 공식 주소 www.coupang.com과 다릅니다. 실제 피싱은 익숙한 화면을 그대로 흉내 내면서 비슷한 도메인을 사용하는 경우가 있으므로 주소창의 도메인을 먼저 확인해야 합니다.'},
 {title:'공연 예매 화면', image:'assets/site-quiz-05.png', answer:'left', explain:'교육용 비교 화면에서 왼쪽은 “전석 100% 무료예매”, “전석 0원”, “지금 무료로 예매하기”처럼 비정상적으로 큰 혜택을 반복해 클릭을 유도하도록 구성되어 있습니다. 실제 상황에서는 혜택 문구만으로 피싱을 확정하지 말고, 공식 앱이나 직접 입력한 공식 주소에서 이벤트가 실제로 존재하는지 확인해야 합니다.'},
 {title:'포털 화면', image:'assets/site-quiz-02.png', answer:'right', explain:'오른쪽은 주소가 www.naver-login.com이고 HTTP 경고 표시가 보입니다. 정상 화면의 www.naver.com과 도메인이 다르므로 오른쪽을 피싱으로 판단할 수 있습니다.'},
 {title:'은행 화면', image:'assets/site-quiz-06.png', answer:'left', explain:'왼쪽은 “추가 프로그램을 지금 바로 설치”하지 않으면 서비스 이용이 제한될 수 있다고 압박합니다. 보안·업데이트를 이유로 즉시 프로그램 설치를 요구하는 방식은 피싱·악성코드 유도의 대표적인 위험 신호이므로, 은행 공식 앱이나 고객센터를 통해 별도로 확인해야 합니다.'},
 {title:'AI 서비스 화면', image:'assets/site-quiz-03.png', answer:'right', explain:'오른쪽 주소는 chatgpt-ai.com이며 브라우저에 주의 표시가 나타납니다. 왼쪽의 chatgpt.com과 다른 도메인이고, 하단 운영 주체와 연락처 정보도 서로 달라 오른쪽이 피싱 화면으로 설정되어 있습니다.'}
]

let siteQuizIndex=0, siteQuizChoice=null, siteQuizAttempts=0, siteQuizScore=0;
function resetSiteQuiz(){siteQuizIndex=0;siteQuizChoice=null;siteQuizAttempts=0;siteQuizScore=0}

function openSiteImage(src,alt){
 const modal=document.createElement('div');
 modal.className='image-modal';
 modal.innerHTML=`<button class="image-modal-close" aria-label="확대 이미지 닫기">×</button><img src="${src}" alt="${alt}"><p>이미지를 클릭하거나 ESC를 누르면 닫힙니다.</p>`;
 document.body.appendChild(modal);
 document.body.classList.add('modal-open');
 const close=()=>{modal.remove();document.body.classList.remove('modal-open');document.removeEventListener('keydown',onKey)};
 const onKey=e=>{if(e.key==='Escape')close()};
 modal.addEventListener('click',e=>{if(e.target===modal||e.target.tagName==='IMG'||e.target.classList.contains('image-modal-close'))close()});
 document.addEventListener('keydown',onKey);
 modal.querySelector('.image-modal-close').focus();
}

function renderSiteQuiz(){
 stage=2;
 const q=siteQuizCases[siteQuizIndex];
 const correct=siteQuizChoice===q.answer;
 const sideLabel=q.answer==='left'?'왼쪽':'오른쪽';
 app.innerHTML=shell(`<div class="eyebrow">화면 비교 퀴즈 · ${siteQuizIndex+1} / ${siteQuizCases.length}</div><h1 class="mission-title">어느 쪽이 피싱 사이트일까요?</h1><p class="subtitle">사진을 클릭하면 크게 볼 수 있습니다. 주소, 과도한 혜택, 로그인·설치 요구 등을 비교해 보세요.</p><section class="site-quiz-card"><div class="site-quiz-head"><div><b>${q.title}</b><span>${siteQuizIndex+1}번째 비교 화면</span></div><span class="pill">이미지 클릭 시 확대</span></div><button class="site-quiz-image-button" id="zoom-image" aria-label="${q.title} 비교 이미지 크게 보기"><div class="site-quiz-image-wrap"><img class="site-quiz-image" src="${q.image}" alt="${q.title}의 두 사이트 비교 화면"><div class="site-half-label left">왼쪽</div><div class="site-half-label right">오른쪽</div><span class="zoom-badge">↗ 크게 보기</span></div></button><div class="site-side-buttons" role="group" aria-label="피싱 사이트 위치 선택"><button class="site-side ${siteQuizChoice==='left'?'selected':''}" data-site-side="left" ${correct?'disabled':''}><b>왼쪽이 피싱</b><small>왼쪽 화면이 더 수상함</small></button><button class="site-side ${siteQuizChoice==='right'?'selected':''}" data-site-side="right" ${correct?'disabled':''}><b>오른쪽이 피싱</b><small>오른쪽 화면이 더 수상함</small></button></div>${siteQuizChoice!==null?`<div class="feedback ${correct?'success':''}" aria-live="polite"><b>${correct?'✓ 정답입니다. '+sideLabel+' 화면이 피싱입니다.':'다시 비교해 보세요.'}</b><br>${correct?q.explain:'주소창의 도메인, 비정상적으로 큰 혜택, 비밀번호·인증번호·설치 요구가 있는지 다시 확인해 보세요.'}</div>`:''}</section><div class="bottom-actions"><span class="count">${siteQuizIndex+1} / ${siteQuizCases.length} · 첫 시도 정답 ${siteQuizScore}개</span><button class="primary" id="site-next" ${correct?'':'disabled'}>${siteQuizIndex===siteQuizCases.length-1?'대처 방법 퀴즈':'다음 문제'} →</button></div>`);
 bindExit();
 document.querySelector('#zoom-image').onclick=()=>openSiteImage(q.image,`${q.title} 비교 화면 확대`);
 app.querySelectorAll('[data-site-side]').forEach(b=>b.onclick=()=>{if(correct)return;siteQuizChoice=b.dataset.siteSide;siteQuizAttempts++;if(siteQuizChoice===q.answer&&siteQuizAttempts===1)siteQuizScore++;renderSiteQuiz();});
 document.querySelector('#site-next').onclick=()=>{if(!correct)return;if(siteQuizIndex===siteQuizCases.length-1){stage=3;choice=null;attempts=0;renderAction()}else{siteQuizIndex++;siteQuizChoice=null;siteQuizAttempts=0;renderSiteQuiz()}goTop()};
}

let caseIndex=0, selectedEvidence=new Set(), selectedVerdict=null, submitted=false, caseAttempts=0, casePassed=false, investigationScore=0, evidenceOrder=[];
function shuffleEvidence(){evidenceOrder=[0,1,2,3];for(let i=3;i>0;i--){const j=Math.floor(Math.random()*(i+1));[evidenceOrder[i],evidenceOrder[j]]=[evidenceOrder[j],evidenceOrder[i]]}}
function resetCase(){selectedEvidence=new Set();selectedVerdict=null;submitted=false;caseAttempts=0;casePassed=false;shuffleEvidence()}
function resetInvestigation(){caseIndex=0;investigationScore=0;resetCase();resetSiteQuiz()}
function renderMission(){
 const c=caseFiles[caseIndex];stage=c.stage;
 app.innerHTML=shell(`<div class="eyebrow">기초 판단 퀴즈 · ${caseIndex+1} / ${caseFiles.length}</div><h1 class="mission-title">${c.title}</h1><p class="subtitle">${c.context}</p><div class="exercise"><section class="simulation"><div class="sim-header"><b>${c.sender}</b><span class="pill">교육용 가상 상황</span></div><div class="case-message">${c.body}</div>${level==='elementary'?`<div class="case-hint">힌트 · ${c.hint}</div>`:''}</section><section class="explanation"><h3>1. 이 상황을 어떻게 판단하나요?</h3><div class="verdict-options" role="group" aria-label="상황 판별">${verdicts.map(([id,label,desc])=>`<button class="verdict ${selectedVerdict===id?'selected':''}" data-verdict="${id}" aria-pressed="${selectedVerdict===id}" ${submitted?'disabled':''}><b>${label}</b><small>${desc}</small></button>`).join('')}</div></section></div><section class="evidence-board"><div class="section-heading"><h2>2. 판단의 핵심 근거 2개를 고르세요</h2><span id="selection-count" role="status">${selectedEvidence.size} / 2 선택</span></div><p class="fine">정답과 직접 관련 있는 근거만 2개 선택하세요.</p><div class="evidence-options">${evidenceOrder.map(i=>`<button class="evidence-option ${selectedEvidence.has(i)?'selected':''}" data-evidence="${i}" aria-pressed="${selectedEvidence.has(i)}" ${submitted?'disabled':''}><span class="checkbox" aria-hidden="true">${selectedEvidence.has(i)?'✓':'+'}</span>${c.evidence[i][0]}</button>`).join('')}</div></section><p class="selection-alert" id="selection-alert" role="status"></p><div id="case-feedback" aria-live="polite">${submitted?`<div class="feedback ${casePassed?'success':''}"><b>${casePassed?'✓ 정답입니다!':'선택을 다시 확인해 보세요.'}</b><br>${casePassed?c.explain:`${selectedVerdict===c.verdict?'상황 판단은 맞았습니다.':'상황 판단부터 다시 확인해 보세요.'} ${[...selectedEvidence].every(i=>c.evidence[i][1])?'근거 2개는 맞았습니다.':'선택한 근거 중 직접적인 판단 근거가 아닌 항목이 있습니다.'}`}</div>`:''}</div><div class="bottom-actions"><span class="count">판단 1개 + 핵심 근거 2개를 모두 맞혀야 다음으로 넘어갑니다.</span>${submitted?`<button class="primary" id="case-continue">${casePassed?(caseIndex===caseFiles.length-1?'화면 비교 퀴즈':'다음 문제'):'다시 선택'} →</button>`:`<button class="primary" id="case-submit" ${selectedVerdict&&selectedEvidence.size===2?'':'disabled'}>정답 확인 →</button>`}</div>`);
 bindExit();
 function updateSelection(){app.querySelectorAll('[data-verdict]').forEach(b=>{const selected=b.dataset.verdict===selectedVerdict;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected))});app.querySelectorAll('[data-evidence]').forEach(b=>{const selected=selectedEvidence.has(Number(b.dataset.evidence));b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));b.querySelector('.checkbox').textContent=selected?'✓':'+'});document.querySelector('#selection-count').textContent=`${selectedEvidence.size} / 2 선택`;document.querySelector('#case-submit').disabled=!(selectedVerdict&&selectedEvidence.size===2)}
 app.querySelectorAll('[data-verdict]').forEach(b=>b.onclick=()=>{if(submitted)return;selectedVerdict=b.dataset.verdict;updateSelection()});
 app.querySelectorAll('[data-evidence]').forEach(b=>b.onclick=()=>{if(submitted)return;const id=Number(b.dataset.evidence);const alert=document.querySelector('#selection-alert');alert.textContent='';if(selectedEvidence.has(id))selectedEvidence.delete(id);else if(selectedEvidence.size<2)selectedEvidence.add(id);else alert.textContent='근거는 2개까지만 선택할 수 있습니다.';updateSelection()});
 const submit=document.querySelector('#case-submit');if(submit)submit.onclick=()=>{if(submitted||!selectedVerdict||selectedEvidence.size!==2)return;caseAttempts++;submitted=true;casePassed=selectedVerdict===c.verdict&&[...selectedEvidence].every(i=>c.evidence[i][1]);if(casePassed&&caseAttempts===1)investigationScore++;renderMission();document.querySelector('#case-feedback').scrollIntoView({block:'nearest'})};
 const next=document.querySelector('#case-continue');if(next)next.onclick=()=>{if(!casePassed){submitted=false;renderMission();return}caseIndex++;if(caseIndex<caseFiles.length){resetCase();renderMission()}else{resetSiteQuiz();renderSiteQuiz()}goTop()};
}
