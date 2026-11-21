/* V95-A public Unit 6 scaffold navigation.
 * No account, storage, network, analytics, marks or Firebase access.
 * All stage links and revision details work without JavaScript.
 */
(function(){
 'use strict';
 const chooser=document.getElementById('topic-select');
 const links=Array.from(document.querySelectorAll('[data-topic-nav]'));
 const known=new Set(links.map(link=>link.dataset.topicNav));
 if(!chooser||links.length!==7)return;
 function sync(){
  const id=decodeURIComponent(location.hash.slice(1));
  const value=known.has(id)?id:'';
  chooser.value=value;
  for(const link of links){
   if(link.dataset.topicNav===value)link.setAttribute('aria-current','location');
   else link.removeAttribute('aria-current');
  }
 }
 chooser.addEventListener('change',()=>{
  const id=chooser.value;
  if(!known.has(id))return;
  location.hash=id;
  const target=document.getElementById(id);
  if(target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true});}
 });
 addEventListener('hashchange',sync);
 sync();
})();
