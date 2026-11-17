# DR MULTISERVICES V4 — proposition d’intégration PostHog

## État et sécurité

Projet PostHog **344284**, organisation **DR MULTISERVICES**, ingestion **https://eu.i.posthog.com**. Ce correctif est soumis sur une branche pour revue ; **aucune activation du site public, fusion, modification DNS ou collecte ne doit être déclenchée automatiquement**.

Les fichiers `assets/dr-posthog-config.js` (valeurs vides), `assets/dr-posthog-v4.js` (consentement + événements) et la modification de `assets/dr-enhancements-v4.js` préparent l'intégration pour les pages HTML statiques. Le fichier de configuration reste vide dans Git. Le token de projet PostHog (token public, **pas** une clé API personnelle) et `api_host` doivent être injectés dans le déploiement depuis la configuration sécurisée de l'environnement ; ne pas les committer en dur. La branche reste inactive tant que la configuration n'est pas renseignée.

## Événements autorisés

- `$pageview` : URL nettoyée (origine + chemin, sans requête ni fragment)
- `service_page_view` : consultation de pages prestations
- `quote_form_view` : formulaire de devis visible
- `quote_submit_attempt` : tentative, statut valide ou invalide (sans champs)
- `quote_submit_result` : **whatsapp_prepared**, seulement lorsque le navigateur prépare WhatsApp. Ce n'est **jamais** une preuve de devis envoyé ou de vente.
- `whatsapp_cta_click` et `call_cta_click` : interactions avec les liens de contact (sans numéros ni messages)

## Confidentialité par défaut

- Aucune requête vers PostHog avant consentement positif du visiteur.
- Aucune collecte lorsque le token ou l'hôte de déploiement manque.
- Refus enregistré dans le navigateur, contrôle de préférences accessible en pied de page.
- `autocapture: false`, `capture_pageview: false` (pageview manuelle), `capture_pageleave: false`, `disable_session_recording: true`, `person_profiles: 'never'`.
- Aucun contenu de formulaire, adresse e-mail, numéro de téléphone, nom, texte WhatsApp ou paramètre de requête n'est transmis par les événements personnalisés.
- Les événements peuvent rester soumis aux obligations marocaines de protection des données et aux conditions de consentement applicables ; faire valider la politique de confidentialité avant activation.

## Contrôle avant fusion / activation

1. Vérifier que chaque page export V4 charge `/assets/dr-enhancements-v4.js` (une fois). L'export GitHub Pages est la cible de cette proposition, pas le futur code source React non présent dans ce dépôt.
2. Générer `assets/dr-posthog-config.js` lors du déploiement de test à partir des variables d'environnement (valeurs non secrètes du SDK : `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`). Laisser ce fichier non renseigné dans le dépôt.
3. D'abord visiter la prévisualisation en navigation privée : **aucune** requête vers `eu.i.posthog.com` avant « Autoriser ». Vérifier qu'un refus ne déclenche aucune requête et qu'un retour en préférences permet d'autoriser.
4. Après consentement, parcourir une page de prestation, faire apparaître un formulaire et vérifier la vue des événements dans PostHog. Vérifier qu'il n'y a ni paramètres `?text=`, ni noms, ni téléphones, ni emails dans les propriétés collectées.
5. Tester la navigation SPA, le clic appel, le clic WhatsApp et la validation du formulaire ; ne jamais appeler une redirection WhatsApp une « demande envoyée ».
6. Valider séparément le code source React V4 avant une recompilation ; toute publication nécessite une validation manuelle explicite.

Docs officielles : https://posthog.com/docs/web-analytics/installation/html-snippet et https://posthog.com/docs/references/posthog-js/types/PostHogConfig
