const timePill=document.getElementById('timePill');
const modeToggle=document.getElementById('modeToggle');
const notesInput=document.getElementById('notesInput');
const factText=document.getElementById('factText');
const facts=["A black hole's gravity is so strong that even light cannot escape from it.",'A day on Venus is longer than a Venus year.','Jupiter is larger than all the other planets combined.','The Milky Way contains hundreds of billions of stars.'];
let factIndex=0;
function updateTime(){timePill.textContent=new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});}
function rotateFact(){factIndex=(factIndex+1)%facts.length;factText.textContent=facts[factIndex];}
const saved=localStorage.getItem('astro-notes');if(saved)notesInput.value=saved;
document.getElementById('saveNote').addEventListener('click',()=>localStorage.setItem('astro-notes',notesInput.value));
document.getElementById('nextFact').addEventListener('click',rotateFact);
modeToggle.addEventListener('click',()=>{const themes=['dreamy','dusk','aurora'];const current=document.body.dataset.theme||'dreamy';document.body.dataset.theme=themes[(themes.indexOf(current)+1)%themes.length];modeToggle.textContent=document.body.dataset.theme==='dusk'?'Velvet dusk':document.body.dataset.theme==='aurora'?'Aurora bloom':'Dawn mode';});
document.querySelectorAll('.dock button').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.dock button').forEach(item=>item.classList.remove('active'));button.classList.add('active');}));
updateTime();setInterval(updateTime,30000);
