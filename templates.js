const templates = {
  // RELANCE 1 - J+3 (Email)
  relance_1_email: {
    canal: 'email',
    delai: 'J+3 après démo',
    sujet: '[NOM_CABINET] - Suite à notre échange',
    corps: `Bonjour [PRENOM],

Merci pour le temps accordé lors de notre démo le [DATE_DEMO].

J'espère que notre présentation de la solution DIV Protocol a répondu à vos besoins en matière de cloud souverain pour [NOM_CABINET].

Pour rappel, nos 3 avantages clés pour votre cabinet :
• Conformité RGPD garantie (hébergement France)
• Sécurité renforcée (chiffrement bout-en-bout)
• Souveraineté numérique (aucune clause Cloud Act)

Je reste disponible pour toute question ou pour planifier un point technique avec votre DSI/DPO.

Souhaitez-vous que je vous envoie une proposition commerciale détaillée ?

Bien cordialement,
Gaspard Bonnot
CEO - DIV Protocol
[EMAIL] | [TEL]`,
    notes_appel: null
  },

  // RELANCE 2 - J+7 (LinkedIn)
  relance_2_linkedin: {
    canal: 'linkedin',
    delai: 'J+7 après démo',
    sujet: null,
    corps: `Bonjour [PRENOM],

Suite à notre démo du [DATE_DEMO], je voulais savoir si vous aviez eu l'occasion d'en discuter en interne ?

Beaucoup de cabinets d'avocats nous rejoignent actuellement pour sécuriser leurs données clients face aux risques du Cloud Act américain.

Je serais ravi d'échanger 10 minutes au téléphone pour répondre à vos éventuelles questions.

Vous êtes disponible cette semaine ?

Gaspard`,
    notes_appel: null
  },

  // RELANCE 3 - J+14 (Email - proposition commerciale)
  relance_3_email: {
    canal: 'email',
    delai: 'J+14 après démo',
    sujet: '[NOM_CABINET] - Proposition commerciale DIV Protocol',
    corps: `Bonjour [PRENOM],

Je reviens vers vous concernant notre solution de cloud souverain pour [NOM_CABINET].

Comme convenu lors de notre démo, vous trouverez ci-joint notre proposition commerciale détaillée incluant :
• Tarification adaptée à votre cabinet ([TAILLE] avocats)
• Timeline de déploiement (2-4 semaines)
• Accompagnement formation inclus
• Support dédié 24/7

**Offre de lancement :** -20% si signature avant fin de mois.

Je reste à votre disposition pour en discuter. Êtes-vous disponible pour un point téléphonique cette semaine ?

Bien cordialement,
Gaspard Bonnot
CEO - DIV Protocol
[EMAIL] | [TEL]`,
    notes_appel: null
  },

  // RELANCE 4 - J+21 (Appel téléphonique)
  relance_4_tel: {
    canal: 'tel',
    delai: 'J+21 après démo',
    sujet: null,
    corps: null,
    notes_appel: `**Script appel téléphonique Relance 4 (J+21)**

1. **Accroche** (10 sec)
   "Bonjour [PRENOM], Gaspard de DIV Protocol. Je vous ai envoyé notre proposition commerciale il y a une semaine. Vous avez 2 minutes ?"

2. **Objectif** : Identifier le blocage / relancer la décision

3. **Questions clés** :
   - "Avez-vous pu consulter notre proposition ?"
   - "Qu'en pense votre direction / associés ?"
   - "Y a-t-il des points à clarifier côté technique ou budget ?"
   - "Quel est votre timing de décision ?"

4. **Objections courantes** :
   - "Budget" → Mentionner offre -20% fin de mois + étalement paiement possible
   - "Pas le temps" → Proposer démo express 15 min pour la direction
   - "On réfléchit encore" → "OK, puis-je vous rappeler dans 7 jours ?"

5. **Closing** :
   - Si intéressé : fixer RDV signature ou démo complémentaire
   - Si hésitant : date de rappel précise (J+7)
   - Si refus : demander feedback pour amélioration

6. **Notes post-appel** :
   - Résultat : [Positif / Neutre / Négatif]
   - Prochaine action : [...]
   - Date rappel : [...]`
  },

  // RELANCE 5 - J+30 (Email - dernière tentative)
  relance_5_email: {
    canal: 'email',
    delai: 'J+30 après démo',
    sujet: '[NOM_CABINET] - Dernière relance DIV Protocol',
    corps: `Bonjour [PRENOM],

Je n'ai pas eu de retour suite à mes derniers messages concernant notre solution de cloud souverain pour [NOM_CABINET].

Je comprends que vous soyez occupé ou que le projet ne soit pas prioritaire actuellement.

**Deux options :**

1️⃣ Si le sujet vous intéresse toujours : répondez simplement "OUI" et je vous recontacte au moment qui vous convient.

2️⃣ Si ce n'est pas d'actualité : un simple "NON" me permettra de ne plus vous solliciter (et je garde votre contact pour l'avenir).

Dans tous les cas, merci pour votre temps et votre considération.

Excellente journée,
Gaspard Bonnot
CEO - DIV Protocol
[EMAIL] | [TEL]`,
    notes_appel: null
  },

  // TEMPLATES SMS/WHATSAPP (courts)
  sms_relance_rapide: {
    canal: 'sms',
    corps: `Bonjour [PRENOM], Gaspard (DIV Protocol). Suite à notre démo du [DATE_DEMO], avez-vous des questions ? Je reste dispo. 📞 [TEL]`
  },

  whatsapp_relance_rapide: {
    canal: 'whatsapp',
    corps: `Bonjour [PRENOM] 👋

Suite à notre démo DIV Protocol, j'espère que tout va bien chez [NOM_CABINET].

Avez-vous eu l'occasion d'en discuter en interne ?

Je reste à votre écoute pour toute question.

Gaspard`
  }
};

function remplirTemplate(templateKey, variables) {
  const template = templates[templateKey];
  if (!template) return null;

  let contenu = template.corps || template.notes_appel || '';
  
  // Remplacer variables
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`\\[${key}\\]`, 'g');
    contenu = contenu.replace(regex, variables[key] || '');
  });

  return {
    ...template,
    corps: template.corps ? contenu : null,
    notes_appel: template.notes_appel ? contenu : null
  };
}

module.exports = { templates, remplirTemplate };
