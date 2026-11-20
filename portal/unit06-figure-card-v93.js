/* V93: only original V90 teaching illustrations, never scanned textbook art. */
(function(root){'use strict';
const figures={
'unit6-figure62':{file:'unit6-figure62-reference.svg',alt:'Immersed cylinder with downward F1 on top, upward F2 on bottom, cross-sectional area A and increasing liquid depth.',caption:'Figure 6.2, NBF printed p.90 · independent original teaching schematic'},
'unit6-figure63':{file:'unit6-figure63-reference.svg',alt:'Birds arranged in two diagonal lines behind a leading bird, making a V formation.',caption:'Figure 6.3, NBF printed p.92 · independent original teaching schematic'},
'unit6-figure65c':{file:'unit6-figure65c-reference.svg',alt:'Paratrooper downward speed-time graph: increasing speed to about 50 metres per second then steady until t 42 seconds, rapidly slowing after canopy opens and steady at about 8 metres per second.',caption:'Figure 6.5(c), NBF printed p.94 · approximate original teaching graph'},
'unit6-figure66':{file:'unit6-figure66-reference.svg',alt:'Two flow patterns in pipes. Panel a on left is smooth parallel paths, panel b on right irregular swirling paths.',caption:'Figure 6.6, NBF printed p.95 · independent original teaching schematic'}
};
function has(q){return Boolean(q&&q.unit===6&&Object.prototype.hasOwnProperty.call(figures,q.referenceFigureId));}
function append(parent,q,base){if(!has(q))return false;const f=figures[q.referenceFigureId],figure=document.createElement('figure');figure.className='unit6-source-figure';
 const img=document.createElement('img');img.src=base+f.file;img.alt=f.alt;img.loading='eager';img.decoding='async';
 const caption=document.createElement('figcaption');caption.textContent=f.caption;figure.append(img,caption);parent.append(figure);return true;}
function show(parent,q,base){parent.replaceChildren();let present=append(parent,q,base);parent.hidden=!present;return present;}
root.PSNUnit6FigureCardV93=Object.freeze({has,append,show});
})(window);
