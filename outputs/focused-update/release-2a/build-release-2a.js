const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', '..', '..');
const indexPath = path.join(root, 'index.html');
const ready = path.join(root, 'outputs', 'focused-update', 'site-ready', 'lesson9-topics');
const preview = path.join(__dirname, 'release-2a-preview.html');
let html = fs.readFileSync(indexPath, 'utf8');
function read(name){const m=html.match(new RegExp(`const ${name} = (.*);$`,'m'));if(!m)throw Error(name);return JSON.parse(m[1]);}
function replace(name,v){const r=new RegExp(`const ${name} = (.*);$`,'m');html=html.replace(r,`const ${name} = ${JSON.stringify(v)};`);}
function safe(s){return s.replace(/\r/g,'').split('\n').filter(x=>!/(CASE SOURCE VALIDATION REQUIRED|SECTION NUMBER UNVERIFIED|תוכן מפורט|מהו הצעד הבא|נוכל להמשיך)/.test(x)).join('\n').replace(/[*`]/g,'').trim();}
function md(s){return safe(s).split('\n').map(x=>x.trim()).filter(Boolean).map(x=>{if(/^#+ /.test(x))return `<h4>${x.replace(/^#+ /,'')}</h4>`;if(/^[-*] /.test(x))return `<li>${x.replace(/^[-*] /,'')}</li>`;return `<p>${x}</p>`;}).join('');}
function body(file){return md(fs.readFileSync(path.join(ready,file),'utf8'));}
const E=read('EXPANSIONS');
const maps={
  '01_appeal_court_powers_section_216.md':['appeals'],
  '02_appeal_sentencing_cross_appeal.md':['appeals'],
  '03_arrest_search_legality_principle.md':['arrest-basics','search-seizure'],
  '04_pretrial_detention_time_limits_morozova.md':['arrest-pending'],
  '05_exclusionary_rule_issacharov.md':['packer'],
  '06_detainee_prisoner_detention_delay.md':['arrest-basics'],
  '07_police_delay_powers_time_records.md':['arrest-basics'],
  '08_special_delay_powers.md':['arrest-basics'],
  '09_limited_body_search_of_detainee.md':['body-search-identification'],
  '10_delay_to_arrest_illegal_arrest_resistance.md':['arrest-nowarrant'],
  '11_arrest_start_end_types.md':['arrest-basics'],
  '12_police_arrest_without_warrant.md':['arrest-nowarrant']
};
for(const [file,ids] of Object.entries(maps)){const add=`<section class="release-2a-addition"><h3>הרחבת שיעור 9 — ${file.replace(/^\d+_/,'').replace(/\.md$/,'').replace(/_/g,' ')}</h3>${body(file)}</section>`;for(const id of ids){if(E[id])E[id].html += add;}}
replace('EXPANSIONS',E);
if(/CASE SOURCE VALIDATION REQUIRED|SECTION NUMBER UNVERIFIED/.test(html))throw Error('validation marker remains');
fs.writeFileSync(indexPath,html,'utf8');fs.writeFileSync(preview,html,'utf8');
console.log(JSON.stringify({expanded:Object.keys(maps).length,production:indexPath,preview},null,2));
