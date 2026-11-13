/* DR MULTISERVICES V4 — no external dependencies, no client data collection. */
(()=>{
  "use strict";
  if(window.__DR_V4_INIT__) return;
  window.__DR_V4_INIT__ = true;
  const afterReady=(fn)=>document.readyState==="complete"?queueMicrotask(fn):window.addEventListener("load",fn,{once:true});
  const DATA={"climatisation":{"title":"Climatisation & ventilation","images":[["tech-clim.jpg","Contrôles frigorifiques et mesures sur circuit"],["chantier-clim.jpg","Groupe extérieur sur terrasse"],["climatisation-2.jpg","Système de climatisation intégré"]]},"chauffage":{"title":"Pompes à chaleur & chauffage","images":[["chauffage.jpg","Unité de pompe à chaleur en extérieur"],["chauffage-2.jpg","Équipement et confort intérieur"],["chantier-pac.jpg","Installation technique en bâtiment"]]},"electricite":{"title":"Électricité & tableaux","images":[["electricite.jpg","Équipements de protection et distribution"],["projet-tableau.jpg","Coffret de distribution électrique"],["electricite-2.jpg","Éclairage extérieur architectural"]]},"energies-renouvelables":{"title":"Énergie solaire","images":[["chantier-solaire.jpg","Panneaux photovoltaïques sur toiture"],["tech-solaire.jpg","Montage de modules photovoltaïques"],["energies-renouvelables-2.jpg","Installation solaire résidentielle"]]},"securite":{"title":"Vidéosurveillance & sécurité","images":[["securite.jpg","Caméra de surveillance en extérieur"],["securite-2.jpg","Surveillance d’un bâtiment"],["chantier-camera.jpg","Architecture avec équipements de sécurité"]]},"chambre-froide":{"title":"Chambres froides & régulation","images":[["chambre-froide.jpg","Zone de conservation frigorifique"],["chantier-froid.jpg","Équipement de froid commercial"],["chambre-froide-2.jpg","Espace de stockage à température contrôlée"]]},"renovation":{"title":"Rénovation & finitions","images":[["renovation.jpg","Artisan au travail sur un enduit"],["renovation-2.jpg","Travaux de finition et d’enduit"],["projet-riad.jpg","Architecture traditionnelle réhabilitée"]]},"cvc-intelligent":{"title":"CVC connecté & régulation","images":[["cvc-intelligent.jpg","Armoire de régulation technique"],["cvc-intelligent-2.jpg","Supervision d’installation technique"],["maintenance.jpg","Vérification de groupe de climatisation"]]},"plomberie":{"title":"Plomberie & sanitaires","images":[["plomberie.jpg","Raccordement hydraulique en cours"],["plomberie-2.jpg","Sanitaires et robinetterie"],["piscines-2.jpg","Salle d’eau aménagée"]]},"piscines":{"title":"Piscines & traitement de l’eau","images":[["piscines.jpg","Bassin et équipements extérieurs"],["piscines-2.jpg","Bassin intérieur et espace détente"],["projet-villa.jpg","Aménagement résidentiel avec extérieur"]]},"isolation":{"title":"Isolation & étanchéité","images":[["chantier-isolation.jpg","Travaux en toiture à Marrakech"],["isolation.jpg","Structure de toiture isolée"],["isolation-2.jpg","Finitions thermiques du bâtiment"]]}};
  const SEO={"climatisation-marrakech":"climatisation","electricite-marrakech":"electricite","panneaux-solaires-marrakech":"energies-renouvelables","videosurveillance-marrakech":"securite","chambre-froide-marrakech":"chambre-froide","chauffage-marrakech":"chauffage","domotique-marrakech":"cvc-intelligent","isolation-marrakech":"isolation","plomberie-marrakech":"plomberie","piscines-marrakech":"piscines"};
  const prefix="/images/";
  const path=()=>decodeURI(location.pathname).replace(/\/$/,"")||"/";
  function current(){
    const p=path();
    if(p==="/") return "home";
    if(p.startsWith("/services/")) return p.split("/")[2];
    return SEO[p.slice(1)]||null;
  }
  const reduceMotion=matchMedia("(prefers-reduced-motion: reduce)");
  function loaderOff(){ document.documentElement.classList.remove("dr-booting"); }
  // Never obstruct readers for a slow network, a blocked script or an animation preference.
  afterReady(()=>setTimeout(loaderOff,reduceMotion.matches?0:170));
  setTimeout(loaderOff,1400);
  const progress=document.createElement("div");
  progress.className="dr-nav-progress"; progress.setAttribute("aria-hidden","true");
  afterReady(()=>document.body.append(progress));
  let progressTimer;
  function navOn(){progress.dataset.active="1"; clearTimeout(progressTimer);progressTimer=setTimeout(navOff,1400);}
  function navOff(){progress.dataset.active="0";}
  document.addEventListener("click",(e)=>{
    if(e.defaultPrevented||e.metaKey||e.ctrlKey||e.altKey||e.shiftKey||e.button!==0) return;
    const a=e.target.closest?.("a[href]");if(!a||a.hasAttribute("download")||a.target==="_blank")return;
    try{const u=new URL(a.href);if(u.origin===location.origin&&u.pathname!==location.pathname)navOn();}catch{}
  },{capture:true});
  window.addEventListener("popstate",()=>{navOff();schedule();});
  const dialog=document.createElement("dialog");dialog.className="dr-photo-lightbox";
  dialog.setAttribute("aria-label","Agrandissement de la photographie");
  dialog.innerHTML='<div class="dr-lightbox-body"><button type="button" class="dr-lightbox-close" aria-label="Fermer la photographie">Fermer ×</button><img alt=""><p class="dr-lightbox-caption"></p></div>';
  afterReady(()=>document.body.append(dialog));
  dialog.querySelector(".dr-lightbox-close").addEventListener("click",()=>dialog.close());
  dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();});
  let lastRoute="";
  function render(){
    navOff();
    const service=current();
    const main=document.querySelector("main#contenu")||document.querySelector("main");
    if(!main)return;
    const galleries=main.querySelectorAll("[data-dr-gallery]");
    if(!DATA[service] || service==="home") {
      galleries.forEach(el=>{if(el.dataset.drEnhanced==='1')el.remove();});
      lastRoute=path();return;
    }
    const item=DATA[service];
    galleries.forEach(el=>{if(el.getAttribute("data-dr-gallery")!==service&&el.dataset.drEnhanced==='1')el.remove();});
    if(main.querySelector('[data-dr-gallery="'+service+'"]')){lastRoute=path();return;}
    const section=document.createElement("section");
    section.className="dr-photo-gallery";
    section.setAttribute("aria-label","Galerie visuelle — "+item.title);
    section.dataset.drGallery=service;section.dataset.drEnhanced="1";
    const heading=document.createElement("div");heading.className="dr-gallery-head";
    const left=document.createElement("div");
    const eyebrow=document.createElement("p");eyebrow.className="dr-gallery-eyebrow";eyebrow.textContent="Savoir-faire · En images";
    const h2=document.createElement("h2");h2.textContent=item.title;
    left.append(eyebrow,h2);
    const intro=document.createElement("p");intro.className="dr-gallery-subtitle";
    intro.textContent="Détails des équipements, installations et environnements de travail — sélection visuelle de nos domaines d’intervention.";
    heading.append(left,intro);section.append(heading);
    const grid=document.createElement("div");grid.className="dr-gallery-grid";
    item.images.forEach(([file,caption],index)=>{
      const button=document.createElement("button");button.type="button";button.className="dr-gallery-card";
      button.setAttribute("aria-label","Agrandir : "+caption);
      const img=document.createElement("img");img.src=prefix+file;img.alt=caption;img.loading="lazy";img.decoding="async";img.width=960;img.height=720;
      const count=document.createElement("span");count.className="dr-gallery-n";count.textContent=String(index+1).padStart(2,"0")+" / 03";
      const label=document.createElement("span");label.className="dr-gallery-caption";label.textContent=caption;
      button.append(img,count,label);
      button.addEventListener("click",()=>{
        dialog.querySelector("img").src=img.src;
        dialog.querySelector("img").alt=caption;
        dialog.querySelector(".dr-lightbox-caption").textContent=caption;
        if(dialog.showModal) dialog.showModal();else dialog.setAttribute("open","");
      });
      grid.append(button);
    });
    const note=document.createElement("p");note.className="dr-gallery-foot";
    note.textContent="Visuels illustratifs des prestations. Ils ne constituent pas une preuve de réalisation sur un chantier client particulier.";
    section.append(grid,note);
    // Insert after the route article, before the site footer. This stays independent of React rendering.
    main.append(section);lastRoute=path();
  }
  let scheduled;
  function schedule(){clearTimeout(scheduled);scheduled=setTimeout(render,280);}
  // Hydration and subsequent client-side route changes can replace the main contents.
  afterReady(()=>setTimeout(render,360));
  const observer=new MutationObserver(muts=>{
    if(muts.some(m=>[...m.addedNodes,...m.removedNodes].some(n=>n.nodeType===1&&
      (n.nodeName==="MAIN"||n.nodeName==="ARTICLE"||n.querySelector?.("main#contenu,article"))))) schedule();
  });
  observer.observe(document.body,{childList:true,subtree:true});
  document.addEventListener("click",e=>{if(e.target.closest?.("a[href]")&&!e.target.closest(".dr-photo-gallery"))setTimeout(schedule,450);});
})();