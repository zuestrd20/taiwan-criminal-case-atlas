from pathlib import Path
from html.parser import HTMLParser
import json,re
root=Path(__file__).resolve().parent.parent
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.refs=[];self.scripts=[]
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if 'id' in d:self.ids.append(d['id'])
  for a in ('src','href'):
   if a in d:self.refs.append(d[a])
  if tag=='script':self.scripts.append(d.get('src',''))
p=Parser();p.feed((root/'index.html').read_text());assert len(p.ids)==len(set(p.ids))
for ref in p.refs:
 if ref.startswith('#'):assert ref[1:] in p.ids,ref
 elif not ref.startswith(('http:','https:','data:')):assert (root/ref).exists(),ref
for src in p.scripts:assert not src.startswith(('http:','https:'))
data=json.loads((root/'data/cases.json').read_text());wrapped=(root/'data/cases.js').read_text();assert json.loads(wrapped.removeprefix('window.CASE_DATA=').strip().removesuffix(';'))==data
assert len(data['cases'])==20
assert not re.search(r'<iframe|googletagmanager|google-analytics|facebook.net', (root/'index.html').read_text())
assert 'prefers-reduced-motion' in (root/'style.css').read_text()
assert 'lang="zh-Hant"' in (root/'index.html').read_text()
print('PASS: static references, unique IDs, no external scripts, JSON/JS parity, no tracking embeds, zh-Hant, reduced motion')
