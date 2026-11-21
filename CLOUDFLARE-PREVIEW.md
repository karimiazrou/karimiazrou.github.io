# DR MULTISERVICES — Cloudflare Pages (PRÉVISUALISATION UNIQUEMENT)

Date : 21 novembre 2026

## Périmètre
Ce dépôt contient un aperçu statique V4. Cette branche doit rester séparée de la branche `main`, actuellement associée au domaine `dr-multiservices.com` via `CNAME`. Ne pas modifier le DNS, le domaine, le site en production ou `main`.

## Cloudflare Pages (plan Free)
- Source : GitHub — `karimiazrou/karimiazrou.github.io`
- Branche de **production Cloudflare (pour le projet de TEST uniquement)** : `cloudflare-premium-preview-2026-11-21`
- Framework preset : None ; commande de build : laisser vide
- Répertoire de sortie : `/` (racine du dépôt, si l'interface accepte `/`; sinon choisir le mode de déploiement statique sans build conformément à l'interface)
- Nom du projet : `dr-multiservices-v4-preview` (sous réserve de disponibilité)
- Domaine personnalisé : **ne pas ajouter** ; conserver `*.pages.dev`.
- Ne pas transférer les variables d'environnement, secrets ni données clients.
- Le fichier `_headers` de cette branche désactive l'indexation de la PRÉVISUALISATION ; le retirer ou adapter avant toute mise en production du site définitif.

## Contrôles avant validation
1. Vérifier que le compte Cloudflare est bien connecté et sur le plan gratuit avant de créer un projet.
2. Vérifier que les liens, images, polices, pages de services et navigation mobile fonctionnent sur `pages.dev`.
3. Vérifier que le formulaire fonctionne uniquement comme brouillon WhatsApp, sans prétendre à un serveur de réception.
4. Vérifier les en-têtes de sécurité et l'en-tête X-Robots-Tag sur l'URL de prévisualisation.
5. Vérifier qu'aucune donnée sensible, clé API ou fichier de client n'est exposé.
6. Ne PAS créer de lien DNS ni changer la configuration de GitHub Pages.

## Limites et suites
- Les fonctions PHP, les backends Node et le bot Telegram ne s'exécutent pas dans un site statique Pages : migrer séparément vers Workers ou un hébergement serveur après audit.
- La branche reste une proposition technique et n'est pas une migration de production.
- Avant de lancer la production, valider explicitement le contenu commercial, l'indexation, le comportement des formulaires, le logo original et les changements DNS.

## Retour arrière
Le site actuel et la branche `main` restent inchangés. Supprimer le projet Cloudflare de TEST, si autorisé, n'affecte pas le site GitHub Pages. Conserver cette branche pour l'historique jusqu'à validation.
