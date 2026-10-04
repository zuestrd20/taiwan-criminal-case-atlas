(function(root){'use strict';
const normalize=v=>String(v??'').normalize('NFKC').toLocaleLowerCase('zh-TW').trim();
const searchable=c=>normalize([c.title,c.year,c.category,c.summary,c.event?.text,c.status?.text,...(c.impact||[]).map(x=>x.text),...(c.timeline||[]).map(x=>`${x.title} ${x.text}`)].join(' '));
function filterCases(cases,{query='',decade='all',category='all'}={}){const terms=normalize(query).split(/\s+/).filter(Boolean);return cases.filter(c=>(decade==='all'||Math.floor(c.year/10)*10===Number(decade))&&(category==='all'||c.category===category)&&terms.every(t=>searchable(c).includes(t)));}
const escapeHTML=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const sourceKey=s=>`${s.publisher}｜${s.type}`;
const caseHash=c=>`#case/${encodeURIComponent(c.slug||c.id)}`;
function fromHash(cases,hash){let value;try{value=decodeURIComponent(hash.replace(/^#(?:case\/)?/,''));}catch{return null;}return cases.find(c=>c.id===value||c.slug===value)||null;}
const api={normalize,filterCases,escapeHTML,sourceKey,caseHash,fromHash};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.CaseAtlas=api;
})(typeof globalThis!=='undefined'?globalThis:this);
