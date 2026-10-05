(function(root){'use strict';
const normalize=v=>String(v??'').normalize('NFKC').toLocaleLowerCase('zh-TW').trim();
const searchable=c=>normalize([c.title,c.year,c.category,c.region,c.summary,c.event?.text,c.status?.text,...(c.event_natures||[]),...(c.impact||[]).map(x=>x.text),...(c.timeline||[]).map(x=>`${x.title} ${x.text}`),...(c.learning_questions||[]).map(x=>`${x.role} ${x.question}`)].join(' '));
function filterCases(cases,{query='',decade='all',category='all',life='all',nature='all'}={}){const terms=normalize(query).split(/\s+/).filter(Boolean);return cases.filter(c=>(decade==='all'||Math.floor(c.year/10)*10===Number(decade))&&(category==='all'||c.category===category)&&(life==='all'||c.life_focus===(life==='yes'))&&(nature==='all'||(c.event_natures||[]).includes(nature))&&terms.every(t=>searchable(c).includes(t)));}
const escapeHTML=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const sourceKey=s=>`${s.publisher}｜${s.type}`;
const caseHash=c=>`#case/${encodeURIComponent(c.slug||c.id)}`;
function fromHash(cases,hash){let value;try{value=decodeURIComponent(hash.replace(/^#(?:case\/)?/,''));}catch{return null;}return cases.find(c=>c.id===value||c.slug===value)||null;}
const api={normalize,filterCases,escapeHTML,sourceKey,caseHash,fromHash};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.CaseAtlas=api;
})(typeof globalThis!=='undefined'?globalThis:this);
