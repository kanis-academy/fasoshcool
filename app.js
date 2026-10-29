const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const PROFILE_KEY = 'fasoshcool_profile_v1';
const STATE_KEY = 'fasoshcool_state_v1';
const defaultState = {dark:false, motion:true, completed:0, best:0, last:0, lessons:[], progress:0};
let state = loadState();
let profile = loadProfile();
let currentPage = 'dashboard';
let activeQuestion = 0, selectedAnswer = null, answered = false;
const questions = [
  {q:'Combien font 7 × 8 ?', opts:['54','56','48','64'], answer:1, explain:'7 × 8 = 56. Tu peux aussi penser à 7 groupes de 8.'},
  {q:'Dans « Les élèves travaillent », quel est le sujet ?', opts:['travaillent','Les élèves','Les','élèves travaillent'], answer:1, explain:'« Les élèves » est le groupe nominal qui fait l’action de travailler.'},
  {q:'Quel organe permet principalement de respirer ?', opts:['Le cœur','L’estomac','Les poumons','Le foie'], answer:2, explain:'Les poumons permettent les échanges gazeux entre l’air et le sang.'},
  {q:'Quelle est la capitale du Burkina Faso ?', opts:['Bobo-Dioulasso','Koudougou','Ouahigouya','Ouagadougou'], answer:3, explain:'Ouagadougou est la capitale du Burkina Faso.'}
];
const courses = [
 {title:'Les nombres entiers',subject:'Mathématiques',level:'6e',desc:'Lire, comparer et effectuer des opérations sur les nombres entiers.',icon:'π',bg:'#e4f3ff',color:'#397eb8',chapters:4},
 {title:'Fractions et décimaux',subject:'Mathématiques',level:'5e',desc:'Comprendre les fractions et les nombres décimaux.',icon:'½',bg:'#e4f3ff',color:'#397eb8',chapters:5},
 {title:'Équations simples',subject:'Mathématiques',level:'4e',desc:'Découvrir les inconnues et résoudre des équations.',icon:'x²',bg:'#e4f3ff',color:'#397eb8',chapters:4},
 {title:'Calcul littéral',subject:'Mathématiques',level:'3e',desc:'Développer, réduire et factoriser des expressions.',icon:'ƒx',bg:'#e4f3ff',color:'#397eb8',chapters:6},
 {title:'Nature des mots',subject:'Français',level:'6e',desc:'Reconnaître le nom, le verbe, l’adjectif et les déterminants.',icon:'Aa',bg:'#fff0e5',color:'#c46c37',chapters:4},
 {title:'Conjugaison',subject:'Français',level:'5e',desc:'Réviser les temps courants de l’indicatif.',icon:'✎',bg:'#fff0e5',color:'#c46c37',chapters:5},
 {title:'La phrase complexe',subject:'Français',level:'4e',desc:'Identifier propositions principales et subordonnées.',icon:'¶',bg:'#fff0e5',color:'#c46c37',chapters:4},
 {title:'Préparer la rédaction',subject:'Français',level:'3e',desc:'Organiser ses idées et améliorer son expression écrite.',icon:'✍',bg:'#fff0e5',color:'#c46c37',chapters:6},
 {title:'Le vivant et son milieu',subject:'SVT',level:'6e',desc:'Découvrir les êtres vivants et leur environnement.',icon:'♧',bg:'#e6f7eb',color:'#27875a',chapters:3},
 {title:'Le corps humain',subject:'SVT',level:'5e',desc:'Explorer les fonctions principales de l’organisme.',icon:'♡',bg:'#e6f7eb',color:'#27875a',chapters:4},
 {title:'Électricité',subject:'Physique-Chimie',level:'4e',desc:'Découvrir les circuits et les grandeurs électriques.',icon:'ϟ',bg:'#fff4d9',color:'#b78321',chapters:4},
 {title:'Révisions BEPC',subject:'Préparation BEPC',level:'3e',desc:'S’entraîner avec des questions de révision par matière.',icon:'★',bg:'#f0ebff',color:'#8065ce',chapters:8}
];
const lessonContent = {
 'Les nombres entiers': {intro:'Un nombre entier naturel sert à compter : 0, 1, 2, 3, 4… Les entiers relatifs comprennent aussi les nombres négatifs : … −3, −2, −1, 0, 1, 2, 3…',points:['Sur une droite graduée, les nombres augmentent vers la droite.','Pour comparer deux nombres, celui qui est le plus à droite est le plus grand.','Dans une addition, on regroupe les quantités ; dans une multiplication, on peut compter des groupes égaux.'],example:'Exemple : 245 + 138 = 383. On additionne les unités, puis les dizaines et les centaines en tenant compte des retenues.',exercise:'Range dans l’ordre croissant : 18 ; 5 ; 32 ; 12.',answer:'5 < 12 < 18 < 32.'},
 'Fractions et décimaux': {intro:'Une fraction a/b représente a parts lorsque l’unité est partagée en b parts égales (b ne doit pas être nul).',points:['Le dénominateur indique le nombre de parts égales.','Le numérateur indique le nombre de parts considérées.','Pour additionner des fractions de même dénominateur, on additionne les numérateurs et on garde le dénominateur.'],example:'2/7 + 3/7 = 5/7. Pour convertir 1/2 en nombre décimal, on calcule 1 ÷ 2 = 0,5.',exercise:'Calcule 3/8 + 2/8.',answer:'3/8 + 2/8 = 5/8.'},
 'Équations simples': {intro:'Une équation est une égalité contenant une inconnue, souvent représentée par x. Résoudre l’équation, c’est trouver la valeur qui rend l’égalité vraie.',points:['On effectue la même opération des deux côtés de l’égalité.','Pour isoler x dans x + a = b, on soustrait a des deux côtés.','On vérifie la réponse en la remplaçant dans l’équation de départ.'],example:'3x + 5 = 20. On soustrait 5 : 3x = 15. On divise par 3 : x = 5. Vérification : 3 × 5 + 5 = 20.',exercise:'Résous : 2x + 4 = 14.',answer:'2x = 14 − 4 = 10, donc x = 10 ÷ 2 = 5. Vérification : 2 × 5 + 4 = 14.'},
 'Calcul littéral': {intro:'Le calcul littéral utilise des lettres pour représenter des nombres. Il permet d’écrire des règles générales et de transformer des expressions.',points:['3x signifie 3 multiplié par x.','Réduire : 2x + 5x = 7x.','Développer : a(b + c) = ab + ac.','Factoriser consiste à mettre un facteur commun en évidence.'],example:'2(x + 4) = 2x + 8.',exercise:'Réduis : 4x + 3x − 2.',answer:'4x + 3x − 2 = 7x − 2.'},
 'Nature des mots': {intro:'Les mots ont différentes natures grammaticales. La nature d’un mot est sa catégorie grammaticale.',points:['Le nom désigne une personne, un animal, une chose ou une idée.','Le déterminant accompagne généralement le nom : le, la, un, des…','L’adjectif précise le nom.','Le verbe exprime une action ou un état.'],example:'Dans « Les petits élèves lisent », « élèves » est un nom, « petits » un adjectif, « Les » un déterminant et « lisent » un verbe.',exercise:'Dans « Aïcha écrit une lettre », quel est le verbe ?',answer:'Le verbe est « écrit » : il indique l’action réalisée par Aïcha.'},
 'Conjugaison': {intro:'Conjuguer un verbe, c’est le faire varier selon la personne, le nombre, le temps et le mode.',points:['Au présent, « je parle », « tu parles », « nous parlons ».','Le sujet commande l’accord du verbe.','Pour trouver le sujet, on peut demander « qui est-ce qui ? » avant le verbe.'],example:'« Les enfants jouent dans la cour. » Le sujet « Les enfants » est au pluriel, donc le verbe prend -ent.',exercise:'Complète : « Nous (aller) à l’école. » au présent.',answer:'Nous allons à l’école.'},
 'La phrase complexe': {intro:'Une phrase complexe contient plusieurs propositions, généralement organisées autour de plusieurs verbes conjugués.',points:['Une proposition contient un verbe conjugué.','Une proposition indépendante peut fonctionner seule.','Une subordonnée dépend d’une autre proposition.'],example:'« Je rentre parce qu’il pleut. » « Je rentre » est la principale ; « parce qu’il pleut » est une subordonnée circonstancielle de cause.',exercise:'Combien de verbes conjugués dans « Quand il arrive, nous commençons » ?',answer:'Il y a deux verbes conjugués : « arrive » et « commençons », donc deux propositions.'},
 'Le vivant et son milieu': {intro:'Un milieu de vie est l’endroit où vivent des êtres vivants. Il comprend des éléments vivants et non vivants.',points:['Les êtres vivants naissent, se développent et ont besoin de ressources.','L’eau, la lumière, l’air et la température sont des facteurs du milieu.','Les êtres vivants peuvent dépendre les uns des autres.'],example:'Dans un champ, les herbes, les insectes, les oiseaux et le sol font partie d’un même milieu.',exercise:'Cite deux éléments non vivants d’un milieu.',answer:'Exemples : l’eau, l’air, la lumière, le sol ou la température.'},
 'Le corps humain': {intro:'Le corps humain possède plusieurs appareils qui travaillent ensemble pour assurer le fonctionnement de l’organisme.',points:['L’appareil respiratoire assure les échanges gazeux.','L’appareil digestif transforme les aliments en nutriments.','Le cœur propulse le sang dans les vaisseaux.'],example:'Lors d’un effort, la respiration et le rythme cardiaque augmentent généralement pour répondre aux besoins du corps.',exercise:'Quel organe propulse le sang ?',answer:'Le cœur propulse le sang dans les vaisseaux sanguins.'},
 'Électricité': {intro:'Un circuit électrique simple comprend une source d’énergie, des fils conducteurs et un récepteur. Le courant circule lorsque le circuit est fermé.',points:['Un interrupteur ouvert coupe le circuit.','Un interrupteur fermé permet au courant de circuler dans un circuit adapté.','La pile est un générateur et la lampe un récepteur.'],example:'Si une lampe ne s’allume pas, vérifie la pile, les connexions et la fermeture de l’interrupteur.',exercise:'Une lampe est-elle allumée si le circuit est ouvert ?',answer:'Non. Un circuit ouvert interrompt le passage du courant.'},
 'Préparer la rédaction': {intro:'Une rédaction réussie répond au sujet, organise les idées et utilise une langue correcte.',points:['Lis le sujet et repère les consignes.','Prépare un plan simple : introduction, développement, conclusion.','Relis pour corriger les accords, la ponctuation et l’orthographe.'],example:'Avant de raconter une sortie, note le lieu, les personnes présentes, les événements dans l’ordre et ce que tu as ressenti.',exercise:'À quoi sert le brouillon ?',answer:'Le brouillon sert à organiser ses idées et à améliorer son texte avant la version finale.'},
 'Révisions BEPC': {intro:'Les révisions du BEPC se construisent progressivement à partir des notions étudiées en classe et des sujets d’entraînement.',points:['Révise une matière à la fois.','Fais des exercices sans regarder la correction.','Note les erreurs et refais les exercices quelques jours plus tard.'],example:'Pour un exercice de mathématiques, écris les données, la méthode, les calculs et une phrase de réponse.',exercise:'Que faut-il faire après avoir corrigé un exercice ?',answer:'Comprendre l’erreur, noter la bonne méthode puis refaire un exercice similaire sans regarder la correction.'}
};
function loadState(){try{return {...defaultState,...JSON.parse(localStorage.getItem(STATE_KEY)||'{}')}}catch{return {...defaultState}}}
function saveState(){localStorage.setItem(STATE_KEY,JSON.stringify(state)); updateProgressUI()}
function loadProfile(){try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||'null')}catch{return null}}
function saveProfile(){localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));}
function escapeHTML(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function firstName(){return profile?.prenom?.trim()||'élève'}
function initials(){return (profile?.prenom?.[0]||'É').toUpperCase()}
function showToast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>el.classList.remove('show'),2800)}
function renderProfile(){
 const name=profile?`${profile.prenom} ${profile.nom}`.trim():'Élève';
 $('#topName').textContent=name;$('#topClass').textContent=profile?.classe?`Classe de ${profile.classe}`:'Classe à définir';
 $('#topAvatar').textContent=initials();$('#settingsAvatar').textContent=initials();$('#welcomeName').textContent=firstName();
 $('#classPill').textContent=profile?.classe?`Classe de ${profile.classe}`:'Classe non définie';
 $('#prefClass').textContent=profile?.classe||'Non définie';
 ['nom','prenom','email','telephone','age','classe'].forEach(k=>{const el=$('#'+k);if(el)el.value=profile?.[k]??''});
 $('#courseLevel').value=profile?.classe||'all';
}
function openAuth(){ $('#authModal').classList.remove('hidden');document.body.style.overflow='hidden';}
function closeAuth(){ $('#authModal').classList.add('hidden');document.body.style.overflow='';}
function saveProfileFromForm(prefix='signup'){
 const get=id=>$('#'+prefix+id);
 return {nom:get('Nom')?.value.trim()||$('#nom')?.value.trim()||'',prenom:get('Prenom')?.value.trim()||$('#prenom')?.value.trim()||'',email:get('Email')?.value.trim()||$('#email')?.value.trim()||'',telephone:get('Phone')?.value.trim()||$('#telephone')?.value.trim()||'',age:get('Age')?.value||$('#age')?.value||'',classe:get('Class')?.value||$('#classe')?.value||''};
}
function navigate(page){
 if(!$('#page-'+page))page='dashboard';currentPage=page;
 $$('.page').forEach(p=>p.classList.toggle('active',p.id==='page-'+page));
 $$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
 const names={dashboard:'Tableau de bord',courses:'Mes cours',exercises:'Exercices & quiz',progress:'Ma progression',settings:'Paramètres'};
 $('#pageCrumb').textContent=names[page]||'Accueil';
 $('#sidebar').classList.remove('open');
 if(page==='settings')renderProfile();
 if(page==='courses')renderCourses();
 if(page==='progress')updateProgressUI();
 window.scrollTo({top:0,behavior:state.motion?'smooth':'auto'});
}
function renderCourses(){
 const search=($('#courseSearch')?.value||'').toLowerCase().trim();
 const level=$('#courseLevel')?.value||profile?.classe||'all';
 const visible=courses.filter(c=>(level==='all'||c.level===level)&&(`${c.title} ${c.subject} ${c.desc} ${c.level}`).toLowerCase().includes(search));
 $('#courseGrid').innerHTML=visible.length?visible.map((c,i)=>`<article class="course-card"><div class="course-cover" style="background:${c.bg};color:${c.color}"><span>${escapeHTML(c.subject)}</span><span>${escapeHTML(c.icon)}</span></div><div class="course-card-body"><span class="course-tag">${escapeHTML(c.level)} · ${escapeHTML(c.subject.toUpperCase())}</span><h3>${escapeHTML(c.title)}</h3><p>${escapeHTML(c.desc)}</p><div class="course-meta"><span>▤ ${c.chapters} chapitres</span><button data-course="${escapeHTML(c.title)}">Découvrir →</button></div></div></article>`).join(''):'<div class="empty-state">Aucun cours trouvé. Essaie une autre recherche ou une autre classe.</div>';
 $$('[data-course]').forEach(b=>b.addEventListener('click',()=>openCourse(b.dataset.course)));
}
function openCourse(title){
 const c=courses.find(x=>x.title===title);if(!c)return;
 state.lessons=[...new Set([...state.lessons,title])];saveState();
 showToast('Leçon ouverte : '+title);
 const existing=$('#lessonModal');if(existing)existing.remove();
 const modal=document.createElement('div');modal.className='modal-backdrop';modal.id='lessonModal';
 const lesson=lessonContent[c.title];
 modal.innerHTML=`<div class="auth-card lesson-card"><button class="lesson-close" style="float:right;border:0;background:#edf6f0;border-radius:8px;padding:7px 11px;color:#087c54" aria-label="Fermer">✕</button><span class="eyebrow">${escapeHTML(c.level)} · ${escapeHTML(c.subject)}</span><h1 style="text-align:left;margin:12px 0">${escapeHTML(c.title)}</h1><p class="muted">${escapeHTML(c.desc)}</p><h3>📖 La leçon</h3><p style="font-size:13px;line-height:1.8">${escapeHTML(lesson?.intro||c.desc)}</p><h3>À retenir</h3><ul style="line-height:1.9;color:var(--muted);font-size:12px">${(lesson?.points||['Lis la leçon et note les mots importants.','Essaie de reformuler la notion avec tes propres mots.']).map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul><div class="privacy-box"><b>Exemple expliqué</b><p>${escapeHTML(lesson?.example||'Relis la définition puis cherche un exemple dans ton cahier.')}</p></div><h3>✏️ À toi de jouer</h3><p style="font-size:12px;line-height:1.7">${escapeHTML(lesson?.exercise||'Écris une phrase qui résume la notion.')}</p><details style="margin:12px 0;color:var(--muted);font-size:12px"><summary style="cursor:pointer;font-weight:800;color:var(--green)">Afficher la correction</summary><p style="line-height:1.8">${escapeHTML(lesson?.answer||'Compare ta réponse avec la leçon et vérifie chaque étape.')}</p></details><p style="font-size:10px;color:var(--muted);line-height:1.6">Leçon de révision pour commencer. Les contenus et leur progression doivent être vérifiés avec les curricula officiels par classe avant de considérer ce site comme une couverture complète du programme.</p><button class="primary-button full" id="lessonToQuiz">Passer aux quiz →</button></div>`;
 document.body.appendChild(modal);modal.querySelector('.lesson-close').onclick=()=>modal.remove();modal.onclick=e=>{if(e.target===modal)modal.remove()};modal.querySelector('#lessonToQuiz').onclick=()=>{modal.remove();navigate('exercises')};
}
function renderQuestion(){
 const q=questions[activeQuestion];selectedAnswer=null;answered=false;
 $('#quizCount').textContent=`Question ${activeQuestion+1} / ${questions.length}`;
 $('#quizProgress').style.width=`${(activeQuestion/questions.length)*100}%`;
 $('#quizQuestion').textContent=q.q;$('#quizFeedback').hidden=true;$('#quizFeedback').textContent='';
 $('#nextQuestion').disabled=true;$('#nextQuestion').textContent=activeQuestion===questions.length-1?'Terminer le quiz ✓':'Valider / Suivant →';
 $('#quizOptions').innerHTML=q.opts.map((o,i)=>`<button class="quiz-option" data-answer="${i}"><span class="option-letter">${'ABCD'[i]}</span><span>${escapeHTML(o)}</span></button>`).join('');
 $$('.quiz-option').forEach(b=>b.addEventListener('click',()=>{if(answered)return;selectedAnswer=Number(b.dataset.answer);$$('.quiz-option').forEach(x=>x.classList.toggle('selected',x===b));$('#nextQuestion').disabled=false;$('#nextQuestion').textContent='Valider la réponse'}));
}
function submitAnswer(){
 if(selectedAnswer===null)return;
 if(!answered){answered=true;const q=questions[activeQuestion];$$('.quiz-option').forEach((b,i)=>{b.disabled=true;if(i===q.answer)b.classList.add('correct');else if(i===selectedAnswer)b.classList.add('wrong')});$('#quizFeedback').hidden=false;$('#quizFeedback').textContent=(selectedAnswer===q.answer?'Bien joué ! ':'Pas tout à fait. ')+q.explain;$('#quizProgress').style.width=`${((activeQuestion+1)/questions.length)*100}%`;$('#nextQuestion').textContent=activeQuestion===questions.length-1?'Voir mon résultat →':'Question suivante →';return}
 if(activeQuestion<questions.length-1){activeQuestion++;renderQuestion()}else finishQuiz();
}
function finishQuiz(){
 const score=Number($('#quizFeedback').textContent.startsWith('Bien joué'));// replaced by actual count below
 // Count correct selections from marked buttons for current quiz session.
 const results=window.quizResults||[];const finalScore=Math.round((results.filter(Boolean).length/questions.length)*100);
 state.completed+=1;state.last=finalScore;state.best=Math.max(state.best,finalScore);state.progress=Math.min(100,Math.round(state.completed*10));saveState();
 $('#quizQuestion').textContent=`Quiz terminé : ${finalScore}%`;
 $('#quizOptions').innerHTML=`<div class="privacy-box"><b>${finalScore>=75?'Bravo, belle performance !':'Continue tes efforts !'}</b><p>Tu as obtenu ${results.filter(Boolean).length} bonne(s) réponse(s) sur ${questions.length}. Recommence pour t'améliorer.</p></div>`;
 $('#quizFeedback').hidden=true;$('#quizProgress').style.width='100%';$('#quizCount').textContent='Résultat final';$('#nextQuestion').disabled=true;$('#nextQuestion').textContent='Quiz terminé';
 $('#bestScore').textContent=state.best+'%';$('#lastScore').textContent=state.last+'%';updateProgressUI();window.quizResults=[];
}
function updateProgressUI(){
 $('#progressStat').textContent=(state.progress||0)+'%';$('#goalPercent').textContent=(state.progress||0)+'%';$('.goal-ring').style.background=`conic-gradient(var(--green) ${(state.progress||0)*3.6}deg,#e8f2ec 0deg)`;
 $('#completedQuizzes').textContent=state.completed||0;$('#progressBest').textContent=state.completed?state.best+'%':'—';$('#lessonsRead').textContent=state.lessons?.length||0;$('#progressLabel').textContent=(state.progress||0)+'%';$('#progressBar').style.width=(state.progress||0)+'%';
 $('#bestScore').textContent=state.completed?state.best+'%':'—';$('#lastScore').textContent=state.completed?state.last+'%':'—';
}
function setDark(on){state.dark=on;document.body.classList.toggle('dark',on);$('#themeBtn').textContent=on?'☀':'☾';$('#settingsTheme')?.classList.toggle('on',on);$('#settingsTheme')?.setAttribute('aria-checked',String(on));saveState()}
function explainStudentExercise(raw){
 const input=raw.trim(); if(!input)return 'Écris d’abord l’énoncé et ta réponse dans la zone ci-dessus.';
 const normalized=input.toLowerCase().replace(/\s+/g,' ');
 if(/3\s*x\s*\+\s*5\s*=\s*20/.test(normalized)||/3x\+5=20/.test(normalized)){
  const correct=/x\s*=\s*5(?:\D|$)/.test(normalized);
  return (correct?'Bravo, ta réponse x = 5 est correcte !':'On va le faire ensemble. La réponse correcte est x = 5.')+'\n\nÉtape 1 : 3x + 5 = 20. On soustrait 5 des deux côtés : 3x = 20 − 5 = 15.\nÉtape 2 : on divise les deux côtés par 3 : x = 15 ÷ 3 = 5.\nVérification : 3 × 5 + 5 = 15 + 5 = 20. L’égalité est vraie.\n\nÀ toi : essaie maintenant 2x + 4 = 14.';
 }
 if(/2\s*x\s*\+\s*4\s*=\s*14/.test(normalized)||/2x\+4=14/.test(normalized))return 'Correction guidée : 2x + 4 = 14.\n1. Soustrais 4 des deux côtés : 2x = 10.\n2. Divise par 2 : x = 5.\n3. Vérifie : 2 × 5 + 4 = 14. Donc x = 5.';
 const arithmetic=input.match(/(-?\d+(?:[.,]\d+)?)\s*([+*×x÷/\-])\s*(-?\d+(?:[.,]\d+)?)/);
 if(arithmetic){const a=Number(arithmetic[1].replace(',','.')),op=arithmetic[2],b=Number(arithmetic[3].replace(',','.'));let result,sign=op;if(op==='+' )result=a+b;else if(op==='-')result=a-b;else if(op==='*'||op==='×'||op.toLowerCase()==='x')result=a*b;else if(op==='/'||op==='÷'){if(b===0)return 'Attention : on ne peut pas diviser par zéro. Révise cette règle puis réessaie.';result=a/b;}if(result!==undefined)return `Voyons le calcul ${a} ${sign} ${b}.\nLe résultat est ${Number(result.toFixed(8))}.\nMéthode : identifie l’opération, applique la règle correspondante, puis vérifie le résultat en refaisant le calcul.`;}
 if(/nature du mot|verbe|sujet/.test(normalized))return 'Méthode de français : cherche d’abord le verbe conjugué en demandant ce que fait la personne ou la chose. Pour trouver le sujet, pose « qui est-ce qui + verbe ? ». Pour la nature d’un mot, demande-toi s’il désigne (nom), accompagne un nom (déterminant), précise un nom (adjectif) ou exprime une action/état (verbe). Recopie la phrase complète pour une correction plus précise.';
 return 'Je suis Prof Faso, ton professeur de révision. Pour l’instant, cette version sait expliquer quelques exercices de calcul et de grammaire.\n\nPour t’aider au mieux :\n1. Recopie l’énoncé complet.\n2. Ajoute ta réponse ou les étapes que tu as faites.\n3. Indique ta classe et la matière.\n\nLa correction automatique de n’importe quel exercice nécessite encore la connexion d’un véritable service d’IA ; cette version ne prétend pas être connectée à ce service.';
}
$('#showMyExercise').addEventListener('click',()=>{const out=$('#tutorAnswer');out.textContent=explainStudentExercise($('#studentExercise').value);out.hidden=false;out.scrollIntoView({behavior:'smooth',block:'nearest'});});
$('#tryExample').addEventListener('click',()=>{$('#studentExercise').value='Résous : 3x + 5 = 20. J’ai trouvé x = 5. Explique-moi les étapes.';$('#tutorAnswer').hidden=true;$('#studentExercise').focus();});
$('#signupForm').addEventListener('submit',e=>{
 e.preventDefault();if(!$('#consent').checked)return;
 profile={nom:$('#signupNom').value.trim(),prenom:$('#signupPrenom').value.trim(),email:$('#signupEmail').value.trim(),telephone:$('#signupPhone').value.trim(),age:$('#signupAge').value,classe:$('#signupClass').value};
 saveProfile();renderProfile();closeAuth();navigate('dashboard');showToast('Bienvenue sur FasoShcool, '+profile.prenom+' !');
});
$('#profileForm').addEventListener('submit',e=>{e.preventDefault();profile=saveProfileFromForm('profile');saveProfile();renderProfile();$('#profileMessage').textContent='Modifications enregistrées ✓';showToast('Ton profil a été mis à jour.');setTimeout(()=>$('#profileMessage').textContent='',3000)});
$$('[data-page]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.page)));
$$('[data-subject]').forEach(b=>b.addEventListener('click',()=>{navigate('courses');$('#courseSearch').value=b.dataset.subject;renderCourses()}));
$$('.settings-tab').forEach(b=>b.addEventListener('click',()=>{$$('.settings-tab').forEach(x=>x.classList.toggle('active',x===b));$$('.settings-section').forEach(x=>x.classList.toggle('active',x.id==='setting-'+b.dataset.setting))}));
$('#themeBtn').addEventListener('click',()=>setDark(!state.dark));
$('#settingsTheme').addEventListener('click',()=>setDark(!state.dark));
$('#motionToggle').addEventListener('click',()=>{state.motion=!state.motion;$('#motionToggle').classList.toggle('on',state.motion);$('#motionToggle').setAttribute('aria-checked',String(state.motion));saveState()});
$('#courseSearch').addEventListener('input',renderCourses);$('#courseLevel').addEventListener('change',renderCourses);
$('#nextQuestion').addEventListener('click',()=>{if(!answered){submitAnswer()}else{if(!window.quizResults)window.quizResults=[];
if(activeQuestion===questions.length-1){window.quizResults[activeQuestion]=selectedAnswer===questions[activeQuestion].answer;finishQuiz()}
else{window.quizResults[activeQuestion]=selectedAnswer===questions[activeQuestion].answer;activeQuestion++;renderQuestion()}}});
$('#restartQuiz').addEventListener('click',()=>{activeQuestion=0;window.quizResults=[];renderQuestion()});
$('#menuBtn').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
$('#logoutBtn').addEventListener('click',()=>{if(confirm('Veux-tu te déconnecter de cette démonstration ? Ton profil local sera conservé sur cet appareil.')){profile=null;openAuth()}});
$('#deleteData').addEventListener('click',()=>{if(confirm('Effacer le profil et la progression enregistrés sur cet appareil ?')){localStorage.removeItem(PROFILE_KEY);localStorage.removeItem(STATE_KEY);profile=null;state={...defaultState};setDark(false);renderProfile();openAuth();showToast('Données locales effacées.')}});
$('#profileTop').addEventListener('click',()=>navigate('settings'));
$('#authModal').addEventListener('click',e=>{if(e.target===$('#authModal')&&profile)closeAuth()});
if(state.dark)document.body.classList.add('dark');$('#themeBtn').textContent=state.dark?'☀':'☾';$('#settingsTheme').classList.toggle('on',state.dark);$('#motionToggle').classList.toggle('on',state.motion);
renderProfile();renderCourses();renderQuestion();updateProgressUI();
if(!profile)openAuth();
