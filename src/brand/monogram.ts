/** Canonical vector geometry traced from the supplied SM brand mark. */
export const facets = [
  { id:'s-crown', d:'M196 446 587 230 587 390 335 525 196 597Z', fill:'navy' },
  { id:'s-cap', d:'M587 230 947 440 820 527 587 390Z', fill:'silver' },
  { id:'s-spine', d:'M196 446 744 763 587 835 196 597Z', fill:'deep' },
  { id:'s-return', d:'M744 763 744 907 449 1064 380 940 587 835Z', fill:'navy' },
  { id:'m-bridge', d:'M634 514 867 646 867 795 634 661Z', fill:'silver' },
  { id:'m-wing', d:'M867 646 1132 497 991 705 867 795Z', fill:'blue' },
  { id:'m-stem', d:'M1132 497 1132 949 991 1027 991 705Z', fill:'deep' },
] as const;
export function renderMonogram(prefix='sm', decorative=true, outline=false){
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="100 180 1080 950" class="sm-vector${outline?' sm-outline':''}" ${decorative?'aria-hidden="true"':'role="img" aria-labelledby="'+prefix+'-title"'} fill="none"><title id="${prefix}-title">Shemar Marks SM monogram</title><defs>
  <linearGradient id="${prefix}-navy" x1="190" y1="400" x2="750" y2="960" gradientUnits="userSpaceOnUse"><stop stop-color="#356caa"/><stop offset=".45" stop-color="#12325b"/><stop offset="1" stop-color="#071c38"/></linearGradient>
  <linearGradient id="${prefix}-silver" x1="570" y1="250" x2="900" y2="750" gradientUnits="userSpaceOnUse"><stop stop-color="#d6e4f6"/><stop offset=".5" stop-color="#91accf"/><stop offset="1" stop-color="#49698f"/></linearGradient>
  <linearGradient id="${prefix}-deep" x1="240" y1="400" x2="1160" y2="1050" gradientUnits="userSpaceOnUse"><stop stop-color="#123b70"/><stop offset=".5" stop-color="#0c254b"/><stop offset="1" stop-color="#163e78"/></linearGradient>
  <linearGradient id="${prefix}-blue" x1="880" y1="780" x2="1140" y2="500" gradientUnits="userSpaceOnUse"><stop stop-color="#245bc2"/><stop offset="1" stop-color="#17407c"/></linearGradient>
  <linearGradient id="${prefix}-orbit" x1="180" y1="1080" x2="1070" y2="290" gradientUnits="userSpaceOnUse"><stop stop-color="#2574ff"/><stop offset="1" stop-color="#55b2ff"/></linearGradient></defs>
  <g class="sm-facets">${facets.map((f,i)=>`<g data-sm-facet="${f.id}" style="--facet-order:${i}"><path d="${f.d}" fill="${outline?'none':`url(#${prefix}-${f.fill})`}" stroke="${outline?'#75acff':'#b3d5ff'}" stroke-opacity="${outline?'.8':'.09'}" stroke-width="${outline?'2':'1'}"/></g>`).join('')}</g>
  <g class="sm-orbits" stroke="url(#${prefix}-orbit)" stroke-width="21" stroke-linecap="round"><path data-sm-orbit="" d="M785 329Q862 303 935 317"/><path data-sm-orbit="" d="M1080 395Q1133 450 1093 531"/><path data-sm-orbit="" d="M270 681C126 832 113 941 231 978"/></g>
  <g fill="url(#${prefix}-orbit)"><circle data-sm-node="" cx="1010" cy="350" r="60"/><circle data-sm-node="" cx="315" cy="1000" r="60"/></g></svg>`;
}
