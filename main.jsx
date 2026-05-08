import { useState, useEffect } from "react";

(() => {
  if (document.getElementById("jf")) return;
  const l = document.createElement("link");
  l.id = "jf"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";
  document.head.appendChild(l);
})();

const T = {
  bg: "#F6F3EC", card: "#FFFFFF",
  text: "#111827", muted: "#6B7280", border: "#E5E0D5",
  green: "#15803D", greenBg: "#F0FDF4",
  redBg: "#FEF2F2", red: "#DC2626",
};
const serif = { fontFamily: "'Fraunces', serif" };
const sans = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

// ── localStorage helpers ──
function loadProgress() {
  try { const s = localStorage.getItem("juampe-v2"); return s ? JSON.parse(s) : {}; } catch { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem("juampe-v2", JSON.stringify(p)); } catch {}
}
function loadApiKey() {
  try { return localStorage.getItem("juampe-apikey") || ""; } catch { return ""; }
}
function saveApiKey(k) {
  try { localStorage.setItem("juampe-apikey", k); } catch {}
}

const PHASES_META = [
  { id: 1, name: "Bases sólidas", weeks: "Sem. 1–3", color: "#1B3464" },
  { id: 2, name: "Vida cotidiana", weeks: "Sem. 4–6", color: "#0F766E" },
  { id: 3, name: "El pasado", weeks: "Sem. 7–9", color: "#6D28D9" },
  { id: 4, name: "Gramática avanzada", weeks: "Sem. 10–11", color: "#B45309" },
  { id: 5, name: "Fluidez & conversación", weeks: "Sem. 12+", color: "#BE185D" },
];

const MODULES = [
  // ── FASE 1 ──
  { id:1, phase:1, color:"#1B3464", title:"Être", subtitle:"Ser / Estar", description:"El verbo más esencial del francés",
    exercises:[
      {type:"info", content:"ÊTRE (ser / estar)\n\nje suis      →  yo soy/estoy\ntu es        →  tú eres/estás\nil/elle est  →  él/ella es/está\nnous sommes  →  nosotros somos\nvous êtes    →  vosotros sois\nils/elles sont → ellos son"},
      {type:"fill_blank", q:"Je ___ espagnol. (soy)", answer:"suis", hint:"je → suis"},
      {type:"fill_blank", q:"Elle ___ médecin. (es)", answer:"est", hint:"il/elle → est"},
      {type:"fill_blank", q:"Nous ___ une famille. (somos)", answer:"sommes", hint:"nous → sommes"},
      {type:"multiple_choice", q:"¿Cómo se dice «vosotros sois»?", options:["vous avez","vous êtes","vous sommes","vous sont"], answer:"vous êtes"},
      {type:"translate", q:"Somos una familia española que vive en Francia.", answer:"Nous sommes une famille espagnole qui vit en France.", hint:"somos → nous sommes · española → espagnole"},
      {type:"oral", content:"Je suis espagnol. Je suis le mari de [prénom]. Nous sommes une famille.", guide:"je swi espan-yol. je swi le ma-RI de... nu som ün fa-mii."},
    ]},
  { id:2, phase:1, color:"#1B3464", title:"Avoir", subtitle:"Tener / Haber", description:"Para posesión y tiempos compuestos",
    exercises:[
      {type:"info", content:"AVOIR (tener / haber)\n\nj'ai        →  yo tengo\ntu as       →  tú tienes\nil/elle a   →  él/ella tiene\nnous avons  →  nosotros tenemos\nvous avez   →  vosotros tenéis\nils/elles ont → ellos tienen"},
      {type:"fill_blank", q:"J'___ faim. (tengo hambre)", answer:"ai", hint:"je → j'ai"},
      {type:"fill_blank", q:"Elle ___ une fille. (tiene)", answer:"a", hint:"il/elle → a"},
      {type:"multiple_choice", q:"¿Cómo se dice «tienes razón»?", options:["Tu as raison","Tu es raison","Tu avoir raison","Tu avez raison"], answer:"Tu as raison"},
      {type:"translate", q:"Tengo una hija que tiene cinco años.", answer:"J'ai une fille qui a cinq ans.", hint:"tengo → j'ai · hija → fille · tiene → a · años → ans"},
      {type:"oral", content:"J'ai une fille. Elle a [âge] ans. Nous avons une maison en Espagne.", guide:"j'é ün fii. el a ... aN. nu za-voN ün mE-zoN aN es-pan-ye."},
    ]},
  { id:3, phase:1, color:"#1B3464", title:"Verbos -ER", subtitle:"Parler, manger, habiter…", description:"El grupo de verbos más numeroso",
    exercises:[
      {type:"info", content:"PARLER — modelo verbos -ER\n\nje parle       →  yo hablo\ntu parles      →  tú hablas\nil/elle parle  →  él/ella habla\nnous parlons   →  hablamos\nvous parlez    →  habláis\nils parlent    →  ellos hablan"},
      {type:"multiple_choice", q:"¿Cómo se dice «tú hablas francés»?", options:["tu parle français","tu parles français","tu parlons français","tu parlez français"], answer:"tu parles français"},
      {type:"fill_blank", q:"Il ___ à Lyon. (vive — habiter)", answer:"habite", hint:"il → raíz sin cambio"},
      {type:"fill_blank", q:"Nous ___ ensemble. (comemos — manger)", answer:"mangeons", hint:"nous + manger → mangeons"},
      {type:"multiple_choice", q:"¿Cómo se dice «ellos trabajan»?", options:["ils travaillez","ils travaillons","ils travaillent","ils travaille"], answer:"ils travaillent"},
      {type:"translate", q:"Yo hablo un poco de francés pero ella habla muy bien.", answer:"Je parle un peu français mais elle parle très bien.", hint:"un poco → un peu · pero → mais · muy bien → très bien"},
      {type:"oral", content:"Je parle un peu français. Je travaille à [ville]. Ma femme parle français très bien.", guide:"je parl éN pé fraN-sé. je tra-vii a... ma fam parl fraN-sé tré byeN."},
    ]},
  { id:4, phase:1, color:"#1B3464", title:"Articles & Genre", subtitle:"Le, la, un, une…", description:"El género en francés — ¡ojo al español!",
    exercises:[
      {type:"info", content:"ARTÍCULOS\n\nDefinidos:   le · la · l' (vocal) · les\nIndefinidos: un · une · des\n\n⚠️ No siempre coincide con el español:\n  le problème (masc.) ≠ «el problema»\n  la voiture (fem.)   = «el coche»"},
      {type:"multiple_choice", q:"«maison» (casa) es femenino →", options:["le maison","la maison","un maison","les maison"], answer:"la maison"},
      {type:"fill_blank", q:"___ enfant est content. (el niño)", answer:"L'", hint:"Ante vocal → l'"},
      {type:"multiple_choice", q:"¿Cómo se dice «un coche»? (voiture = fem.)", options:["un voiture","le voiture","une voiture","des voiture"], answer:"une voiture"},
      {type:"multiple_choice", q:"¿Cómo se dice «los niños»?", options:["le enfants","la enfants","les enfants","des enfant"], answer:"les enfants"},
      {type:"translate", q:"Tengo un perro y una gata.", answer:"J'ai un chien et une chatte.", hint:"perro (masc.) → un chien · gata (fem.) → une chatte"},
      {type:"oral", content:"La maison est grande. Le jardin est beau. Les enfants jouent dans le jardin.", guide:"la mE-zoN é graNd. le jar-deN é bo. lE zaN-faN zhüü daN le jar-deN."},
    ]},
  { id:5, phase:1, color:"#1B3464", title:"La Négation", subtitle:"Ne…pas, ne…plus…", description:"Esencial para expresarte correctamente",
    exercises:[
      {type:"info", content:"NÉGATION\n\nne...pas    → no (general)\nne...plus   → ya no\nne...jamais → nunca\nne...rien   → nada\nne...personne → nadie\n\n⚠️ En oral informal el 'ne' desaparece:\n   «Je sais pas» = «Je ne sais pas»"},
      {type:"fill_blank", q:"Je ___ parle ___ anglais. (no hablo — dos palabras)", answer:"ne / pas", hint:"ne + verbo + pas"},
      {type:"multiple_choice", q:"¿Cómo se dice «ya no trabajo»?", options:["Je ne travaille pas","Je ne travaille plus","Je ne travaille jamais","Je travaille rien"], answer:"Je ne travaille plus"},
      {type:"multiple_choice", q:"¿Qué significa «Je ne comprends rien»?", options:["No comprendo nada","No comprendo nunca","No comprendo ya","No comprendo a nadie"], answer:"No comprendo nada"},
      {type:"translate", q:"Ella nunca come carne.", answer:"Elle ne mange jamais de viande.", hint:"nunca → ne...jamais · carne → viande"},
      {type:"oral", content:"Je ne parle pas bien français. Je ne comprends pas tout. Mais j'apprends!", guide:"je ne parl pa byeN fraN-sé. je ne kõ-praN pa tü. mé j'a-praN!"},
      {type:"reto", title:"🗣️ Reto oral", q:"Di en voz alta a tu hija algo que NO haces, en francés.", tip:"Ej: «Je ne mange pas d'oignons.» / «Je ne regarde pas la télé le matin.»"},
    ]},
  { id:6, phase:1, color:"#1B3464", title:"La Maison", subtitle:"Vocabulaire: la casa", description:"Hablar de tu casa y lo que hay en ella",
    exercises:[
      {type:"info", content:"LA MAISON\n\nla maison (la casa)      le salon (el salón)\nla cuisine (la cocina)   la chambre (el cuarto)\nla salle de bain (el baño)  les toilettes (el WC)\nle jardin (el jardín)    le balcon (el balcón)\nle couloir (el pasillo)  l'escalier (la escalera)\nla fenêtre (la ventana)  la porte (la puerta)"},
      {type:"multiple_choice", q:"¿Cómo se dice «la cocina»?", options:["le salon","la chambre","la cuisine","le couloir"], answer:"la cuisine"},
      {type:"multiple_choice", q:"¿Qué significa «la salle de bain»?", options:["la sala de estar","el baño","el comedor","el dormitorio"], answer:"el baño"},
      {type:"fill_blank", q:"Les enfants jouent dans le ___. (jardín)", answer:"jardin", hint:"jardín = jardin"},
      {type:"translate", q:"El salón es grande pero la cocina es pequeña.", answer:"Le salon est grand mais la cuisine est petite.", hint:"grande masc. → grand · pequeña → petite"},
      {type:"oral", content:"Chez moi, il y a un grand salon, une cuisine moderne et trois chambres.", guide:"shé mwa il i a éN graN sa-lõ, ün kwi-zin mo-dern e trwa shaMbr."},
      {type:"reto", title:"📝 Reto escrito", q:"Descríbele a tu hija vuestra casa en francés. Mínimo 3 frases.", tip:"Usa: il y a (hay) · c'est grand/petit · notre chambre est..."},
    ]},
  { id:7, phase:1, color:"#1B3464", title:"La Famille", subtitle:"Vocabulaire famille", description:"Para hablar de tu familia",
    exercises:[
      {type:"info", content:"LA FAMILLE\n\nle mari (marido)         la femme (esposa)\nle fils (hijo)            la fille (hija)\nle frère (hermano)       la sœur (hermana)\nles parents (padres)     les enfants (hijos)\nle grand-père (abuelo)   la grand-mère (abuela)\nle beau-père (suegro)    la belle-mère (suegra)\nle cousin (primo)        la cousine (prima)"},
      {type:"multiple_choice", q:"¿Cómo se dice «hija»?", options:["le fils","la fille","la sœur","la femme"], answer:"la fille"},
      {type:"fill_blank", q:"Ma ___ s'appelle [nombre]. (hija)", answer:"fille", hint:"hija = fille"},
      {type:"multiple_choice", q:"¿Cómo se dice «mi suegra»?", options:["ma belle-sœur","ma grand-mère","ma belle-mère","ma tante"], answer:"ma belle-mère"},
      {type:"translate", q:"Mi hija tiene tres años y tiene un primo en Francia.", answer:"Ma fille a trois ans et elle a un cousin en France.", hint:"primo → cousin · en Francia → en France"},
      {type:"oral", content:"Ma fille s'appelle [prénom]. Elle a [âge] ans. Mes beaux-parents habitent en France.", guide:"ma fii sa-pel... el a ... aN. mé bo-pa-raN za-bit aN fraNs."},
      {type:"reto", title:"📱 Reto: WhatsApp", q:"Escribe un mensaje a tu suegra para presentarte en francés.", tip:"Bonjour! Je suis [nombre], le mari de [prénom]. Je suis très content d'apprendre le français pour notre famille!"},
    ]},
  { id:8, phase:1, color:"#1B3464", title:"Salutations", subtitle:"Saludos & expresiones", description:"Frases del día a día",
    exercises:[
      {type:"info", content:"EXPRESIONES CLAVE\n\nBonjour / Bonsoir / Bonne nuit\nSalut (informal) · Au revoir · À bientôt\nMerci / Merci beaucoup\nDe rien / Je vous en prie\nS'il vous plaît / s'il te plaît\nExcusez-moi / Pardon\nÇa va? → Ça va bien, et toi?\nComment tu t'appelles? → Je m'appelle...\nD'où tu viens? → Je viens d'Espagne."},
      {type:"multiple_choice", q:"¿Cómo se dice «buenas tardes/noches»?", options:["Bonjour","Bonsoir","Bonne nuit","Salut"], answer:"Bonsoir"},
      {type:"fill_blank", q:"Je m'___ Carlos. (me llamo)", answer:"appelle", hint:"je m'appelle = me llamo"},
      {type:"multiple_choice", q:"¿Cómo responder a «Ça va?»", options:["Merci beaucoup","Ça va bien, et toi?","S'il vous plaît","De rien"], answer:"Ça va bien, et toi?"},
      {type:"translate", q:"Buenos días, ¿cómo estás? Yo estoy muy bien, gracias.", answer:"Bonjour, comment tu vas? Je vais très bien, merci.", hint:"¿cómo estás? → comment tu vas? · muy bien → très bien"},
      {type:"oral", content:"Bonjour! Je m'appelle [prénom]. Je suis espagnol. Enchanté de vous rencontrer!", guide:"bõ-zhür! je ma-pel... je swi espan-yol. aN-shaN-té de vu raN-koN-tré!"},
      {type:"reto", title:"🗣️ Reto con tu hija", q:"Esta tarde, cuando veas a tu hija por primera vez, salúdala completamente en francés.", tip:"Bonsoir ma chérie! Comment tu vas? Tu as passé une bonne journée?"},
    ]},

  // ── FASE 2 ──
  { id:9, phase:2, color:"#0F766E", title:"Aller + Lieu", subtitle:"Ir a / estar en", description:"Moverse y ubicarse en el espacio",
    exercises:[
      {type:"info", content:"ALLER (ir)\n\nje vais   tu vas   il/elle va\nnous allons · vous allez · ils vont\n\nPREPOSICIONES DE LUGAR\nà + ville: Je vais à Paris\nen + pays fém.: en France, en Espagne\nau + pays masc.: au Portugal\nchez + personne: chez ma belle-mère\n\ntout droit · à gauche · à droite · près/loin"},
      {type:"fill_blank", q:"Je ___ à l'école. (voy)", answer:"vais", hint:"je → vais"},
      {type:"fill_blank", q:"Nous ___ en France cet été. (vamos)", answer:"allons", hint:"nous → allons"},
      {type:"multiple_choice", q:"¿Cómo se dice «voy a casa de mis suegros»?", options:["Je vais à mes beaux-parents","Je vais chez mes beaux-parents","Je vais en mes beaux-parents","Je vais au mes beaux-parents"], answer:"Je vais chez mes beaux-parents"},
      {type:"translate", q:"Este verano vamos a Francia a ver a la familia.", answer:"Cet été nous allons en France voir la famille.", hint:"este verano → cet été · a ver → voir"},
      {type:"oral", content:"Je vais au travail le matin. Le week-end, on va chez la famille de ma femme.", guide:"je vé o tra-vii le ma-teN. le wik-end, oN va shé la fa-mii de ma fam."},
    ]},
  { id:10, phase:2, color:"#0F766E", title:"Faire", subtitle:"Hacer / actividades", description:"Faire du sport, les courses…",
    exercises:[
      {type:"info", content:"FAIRE (hacer)\n\nje fais · tu fais · il/elle fait\nnous faisons · vous faites · ils font\n\nfaire du sport · faire les courses\nfaire la cuisine · faire une promenade\nfaire la sieste · faire le ménage"},
      {type:"fill_blank", q:"Elle ___ la cuisine tous les soirs. (hace)", answer:"fait", hint:"elle → fait"},
      {type:"multiple_choice", q:"¿Qué significa «faire les courses»?", options:["correr","hacer la compra","hacer deporte","hacer un viaje"], answer:"hacer la compra"},
      {type:"fill_blank", q:"Nous ___ du vélo le dimanche. (hacemos)", answer:"faisons", hint:"nous → faisons"},
      {type:"translate", q:"Los domingos hago deporte y ella cocina.", answer:"Le dimanche je fais du sport et elle fait la cuisine.", hint:"el domingo → le dimanche · deporte → du sport"},
      {type:"oral", content:"Le matin je fais du café. Le week-end on fait des promenades avec notre fille.", guide:"le ma-teN je fé dü ka-fé. le wik-end oN fé dé pro-mnad a-vek notr fii."},
      {type:"reto", title:"🗣️ Reto familiar", q:"Dile a tu hija qué vais a hacer este fin de semana.", tip:"Ce week-end, on va faire... / On va aller... / On va manger..."},
    ]},
  { id:11, phase:2, color:"#0F766E", title:"Vouloir · Pouvoir · Devoir", subtitle:"Verbos modales", description:"Querer, poder y deber",
    exercises:[
      {type:"info", content:"VOULOIR: je veux · tu veux · il veut · nous voulons · vous voulez · ils veulent\n\nPOUVOIR: je peux · tu peux · il peut · nous pouvons · vous pouvez · ils peuvent\n\nDEVOIR: je dois · tu dois · il doit · nous devons · vous devez · ils doivent"},
      {type:"fill_blank", q:"Je ___ apprendre le français. (quiero)", answer:"veux", hint:"je → veux"},
      {type:"fill_blank", q:"Tu ___ m'aider? (puedes)", answer:"peux", hint:"tu → peux"},
      {type:"multiple_choice", q:"¿Cómo se dice «ella tiene que trabajar»?", options:["Elle veut travailler","Elle peut travailler","Elle doit travailler","Elle vouloir travailler"], answer:"Elle doit travailler"},
      {type:"translate", q:"Quiero hablar francés con mi hija. Tengo que practicar cada día.", answer:"Je veux parler français avec ma fille. Je dois pratiquer chaque jour.", hint:"quiero → je veux · tengo que → je dois · cada día → chaque jour"},
      {type:"oral", content:"Je veux parler français. Je peux comprendre un peu. Je dois pratiquer tous les jours.", guide:"je vé parl fraN-sé. je pé koN-praNdr éN pé. je dwa pra-ti-ké tü lé zhür."},
    ]},
  { id:12, phase:2, color:"#0F766E", title:"Les Partitifs", subtitle:"Du, de la, de l', des", description:"Hablar de cantidades no definidas",
    exercises:[
      {type:"info", content:"ARTÍCULOS PARTITIVOS\n\ndu   + masc. → du pain, du café\nde la + fém. → de la viande\nde l' + vocal → de l'eau, de l'huile\ndes  + plural → des fruits, des légumes\n\n⚠️ En negativo → siempre «de/d'»:\nJe ne mange pas DE viande."},
      {type:"multiple_choice", q:"¿Cómo se dice «quiero agua»? (eau = fém.)", options:["Je veux du eau","Je veux de l'eau","Je veux de la eau","Je veux des eaux"], answer:"Je veux de l'eau"},
      {type:"fill_blank", q:"Je mange ___ pain le matin. (pan = masc.)", answer:"du", hint:"masc. → du"},
      {type:"multiple_choice", q:"¿Cómo se dice «no quiero carne»?", options:["Je ne veux pas de la viande","Je ne veux pas du viande","Je ne veux pas de viande","Je ne veux pas des viande"], answer:"Je ne veux pas de viande"},
      {type:"translate", q:"Como fruta y bebo agua. No bebo alcohol.", answer:"Je mange des fruits et je bois de l'eau. Je ne bois pas d'alcool.", hint:"fruta → des fruits · agua → de l'eau · alcohol → d'alcool (negativo)"},
      {type:"oral", content:"Le matin, je prends du café et du pain. Je ne mange pas de sucre.", guide:"le ma-teN, je praN dü ka-fé e dü peN. je ne maNzh pa de sü-kr."},
    ]},
  { id:13, phase:2, color:"#0F766E", title:"La Nourriture", subtitle:"Vocabulaire: la comida", description:"Vocabulario esencial para la mesa",
    exercises:[
      {type:"info", content:"LA NOURRITURE\n\nle pain · le fromage · la viande · le poulet\nle poisson · les légumes · les fruits · le riz\nles pâtes · la soupe · les œufs · le beurre\nle lait · le sucre · l'huile · le sel\n\nle petit-déjeuner · le déjeuner · le dîner"},
      {type:"multiple_choice", q:"¿Cómo se dice «el queso»?", options:["le pain","le fromage","le poulet","le poisson"], answer:"le fromage"},
      {type:"fill_blank", q:"J'aime beaucoup ___ pâtes.", answer:"les", hint:"plural → les"},
      {type:"multiple_choice", q:"¿Qué significa «le dîner»?", options:["el desayuno","la comida","la cena","el almuerzo"], answer:"la cena"},
      {type:"translate", q:"Esta noche cenamos pollo con verduras.", answer:"Ce soir on dîne du poulet avec des légumes.", hint:"esta noche → ce soir · cenamos → on dîne"},
      {type:"oral", content:"J'aime le fromage et le pain. Je n'aime pas beaucoup le poisson. Ma fille adore les pâtes.", guide:"j'em le fro-mazh e le peN. je nem pa bo-kü le pwa-soN. ma fii a-dor lé pat."},
      {type:"reto", title:"🍽️ Reto en casa", q:"Esta noche en la cena, nombra 3 alimentos en francés antes de comer.", tip:"Señala y di: «Du pain! De la salade! Du fromage!»"},
    ]},
  { id:14, phase:2, color:"#0F766E", title:"Les Vêtements", subtitle:"Vocabulaire: la ropa", description:"Describir lo que llevas puesto",
    exercises:[
      {type:"info", content:"LES VÊTEMENTS\n\nun t-shirt · un pull (jersey) · une chemise\nune veste (chaqueta) · un manteau (abrigo)\nun pantalon · un jean · une robe · une jupe\ndes chaussures · des baskets (zapatillas)\nune écharpe (bufanda) · un chapeau\n\nrouge · bleu/bleue · vert/verte · jaune\nnoir/noire · blanc/blanche · gris/grise"},
      {type:"multiple_choice", q:"¿Cómo se dice «una camisa»?", options:["une robe","une chemise","une veste","une jupe"], answer:"une chemise"},
      {type:"fill_blank", q:"Il porte un pantalon ___. (negro masc.)", answer:"noir", hint:"negro masc. → noir"},
      {type:"multiple_choice", q:"¿Qué significa «des baskets»?", options:["baloncesto","cestas","zapatillas deportivas","calcetines"], answer:"zapatillas deportivas"},
      {type:"translate", q:"Hoy llevo vaqueros y una camiseta azul.", answer:"Aujourd'hui je porte un jean et un t-shirt bleu.", hint:"hoy → aujourd'hui · llevo → je porte · azul masc. → bleu"},
      {type:"oral", content:"Aujourd'hui je porte un jean et un pull gris. Ma fille porte une robe rouge.", guide:"o-zhür-dwi je port éN zheN e éN pül gri. ma fii port ün rob rüzh."},
      {type:"reto", title:"👗 Reto visual", q:"Describe en francés lo que llevas puesto ahora mismo. Mínimo 3 prendas.", tip:"Je porte un/une... Il/Elle est... (color). Mes chaussures sont..."},
    ]},
  { id:15, phase:2, color:"#0F766E", title:"Les Transports", subtitle:"Vocabulaire: transportes", description:"Moverse, viajar, dar indicaciones",
    exercises:[
      {type:"info", content:"LES TRANSPORTS\n\nle métro · le bus · le train · l'avion\nla voiture · le vélo · à pied · en taxi\n\nprendre le train → coger el tren\nrater le bus → perder el bus\narrêt de bus · gare · aéroport\n\ntout droit · à gauche · à droite\nprès de · loin de · en face de"},
      {type:"multiple_choice", q:"¿Cómo se dice «en tren»?", options:["en bus","en train","en avion","en métro"], answer:"en train"},
      {type:"fill_blank", q:"Pour aller à l'école, ma fille prend le ___.", answer:"bus", hint:"autobús = bus"},
      {type:"multiple_choice", q:"¿Qué significa «rater le bus»?", options:["coger el bus","perder el bus","esperar el bus","ir en bus"], answer:"perder el bus"},
      {type:"translate", q:"Para ir al trabajo cojo el metro. Tardo veinte minutos.", answer:"Pour aller au travail je prends le métro. Ça prend vingt minutes.", hint:"cojo → je prends · tardo → ça prend · veinte → vingt"},
      {type:"oral", content:"Pour aller chez mes beaux-parents, on prend l'avion. C'est à deux heures de vol.", guide:"pür a-lé shé mé bo-pa-raN, oN praN la-vyoN. sé ta dé zér de vol."},
    ]},
  { id:16, phase:2, color:"#0F766E", title:"Chiffres & Heure", subtitle:"Números y la hora", description:"Imprescindible para el día a día",
    exercises:[
      {type:"info", content:"L'HEURE\n\nil est huit heures        → son las ocho\nil est midi / minuit\nil est 3h et demie        → tres y media\nil est 3h et quart        → tres y cuarto\nil est 4h moins le quart  → cuatro menos cuarto\n\n1-dix · 11-onze · 12-douze · 20-vingt\n30-trente · 40-quarante · 50-cinquante\n60-soixante · 70-soixante-dix · 80-quatre-vingts"},
      {type:"multiple_choice", q:"¿Cómo se dice «son las tres y media»?", options:["Il est trois heures et quart","Il est trois heures et demie","Il est trois heures moins le quart","Il est trois heures"], answer:"Il est trois heures et demie"},
      {type:"fill_blank", q:"À ___ heure est le dîner?", answer:"quelle", hint:"¿a qué hora? → à quelle heure?"},
      {type:"multiple_choice", q:"¿Cómo se dice «a las ocho y cuarto»?", options:["à huit heures et demie","à huit heures et quart","à huit heures moins le quart","à huit heures"], answer:"à huit heures et quart"},
      {type:"translate", q:"Son las nueve de la noche. La cena está lista.", answer:"Il est neuf heures du soir. Le dîner est prêt.", hint:"de la noche → du soir · está lista → est prêt"},
      {type:"oral", content:"Je me lève à sept heures. Je commence le travail à neuf heures. Je rentre à dix-neuf heures.", guide:"je me lev a set ér. je ko-maNs le tra-vii a né-vér. je raNtr a diz-né-vér."},
    ]},
  { id:17, phase:2, color:"#0F766E", title:"Au Restaurant", subtitle:"Pedir, preguntar, opinar", description:"Situación real: comer fuera en Francia",
    exercises:[
      {type:"info", content:"AU RESTAURANT\n\nUne table pour deux, s'il vous plaît.\nLa carte, s'il vous plaît.\nJe voudrais... / Je vais prendre...\nQu'est-ce que vous recommandez?\nC'est délicieux! / C'est bon!\nL'addition, s'il vous plaît.\nC'est compris? · Service compris"},
      {type:"multiple_choice", q:"¿Cómo pedir la carta?", options:["Je voudrais manger","La carte, s'il vous plaît","L'addition, s'il vous plaît","Une table pour deux"], answer:"La carte, s'il vous plaît"},
      {type:"fill_blank", q:"Je ___ un steak, s'il vous plaît. (quisiera)", answer:"voudrais", hint:"quisiera → je voudrais"},
      {type:"multiple_choice", q:"¿Cómo se pide la cuenta?", options:["La carte, s'il vous plaît","C'est compris?","L'addition, s'il vous plaît","C'est délicieux!"], answer:"L'addition, s'il vous plaît"},
      {type:"translate", q:"Quisiera una mesa para tres y la carta, por favor.", answer:"Je voudrais une table pour trois et la carte, s'il vous plaît.", hint:"quisiera → je voudrais · tres → trois"},
      {type:"oral", content:"Bonsoir! Une table pour deux, s'il vous plaît. Je vais prendre le menu du jour. C'est délicieux!", guide:"bõ-swar! ün tabl pür dé, sil vu plé. je vé praNdr le me-nü dü zhür. sé dé-li-syé!"},
      {type:"reto", title:"🍽️ Reto en familia", q:"La próxima vez que vayáis a un restaurante en Francia, haz el pedido completo en francés.", tip:"Bonsoir! Une table pour [n], s'il vous plaît. Je voudrais... / Qu'est-ce que vous recommandez?"},
    ]},

  // ── FASE 3 ──
  { id:18, phase:3, color:"#6D28D9", title:"Passé Composé I", subtitle:"Con avoir", description:"Hablar de lo que hiciste",
    exercises:[
      {type:"info", content:"PASSÉ COMPOSÉ (con avoir)\n\navoir présent + participe passé\n\nj'ai mangé · tu as vu · il a fait\nnous avons parlé · vous avez pris · ils ont dit\n\nPP REGULARES: -er→é · -ir→i · -re→u\nPP IRREGULARES:\nfaire→fait · voir→vu · prendre→pris\ndire→dit · avoir→eu · être→été\nlire→lu · écrire→écrit · boire→bu"},
      {type:"fill_blank", q:"J'ai ___ du sport hier. (hacer → fait)", answer:"fait", hint:"faire → fait"},
      {type:"fill_blank", q:"Elle a ___ une lettre. (écrire → écrit)", answer:"écrit", hint:"écrire → écrit"},
      {type:"multiple_choice", q:"¿Cómo se dice «hemos comido»?", options:["Nous avons mangé","Nous sommes mangé","Nous avons manger","Nous avons mangés"], answer:"Nous avons mangé"},
      {type:"translate", q:"Ayer comí con mi familia y hablamos mucho.", answer:"Hier j'ai mangé avec ma famille et nous avons beaucoup parlé.", hint:"ayer → hier · comí → j'ai mangé · hablamos → nous avons parlé"},
      {type:"oral", content:"Hier, j'ai travaillé toute la journée. Le soir, j'ai dîné avec ma famille. On a regardé un film.", guide:"i-ér, j'é tra-va-yé tüt la zhür-né. le swar, j'é di-né a-vek ma fa-mii. oN na re-gar-dé éN film."},
      {type:"reto", title:"📝 Reto escrito", q:"Escribe 4 frases contando qué hiciste ayer.", tip:"Hier j'ai... / Le matin j'ai... / Le soir on a..."},
    ]},
  { id:19, phase:3, color:"#6D28D9", title:"Passé Composé II", subtitle:"Con être", description:"Los verbos de movimiento y cambio",
    exercises:[
      {type:"info", content:"PASSÉ COMPOSÉ (con être)\n\n→ Verbos de movimiento + pronominaux\n→ Acuerdo: -e (fém.), -s (plural)\n\naller→allé · venir→venu · arriver→arrivé\npartir→parti · naître→né · mourir→mort\nrester→resté · tomber→tombé\nentrer · sortir · monter · descendre\n\nje suis allé/e · elle est venue\nnous sommes arrivés · elles sont parties"},
      {type:"fill_blank", q:"Elle est ___ en France. (nacer → née)", answer:"née", hint:"naître → née (fém.)"},
      {type:"fill_blank", q:"Nous sommes ___ à Lyon. (llegar → arrivés)", answer:"arrivés", hint:"arriver + s (nous)"},
      {type:"multiple_choice", q:"¿Cómo se dice «ella fue al mercado»?", options:["Elle a allé au marché","Elle est allée au marché","Elle est allé au marché","Elle a été au marché"], answer:"Elle est allée au marché"},
      {type:"translate", q:"El año pasado fui a Francia a ver a mi suegra.", answer:"L'année dernière je suis allé en France voir ma belle-mère.", hint:"el año pasado → l'année dernière · fui → je suis allé"},
      {type:"oral", content:"Je suis né en Espagne. Je suis venu en France pour ma famille. Nous sommes restés trois semaines.", guide:"je swi né aN es-pan-ye. je swi ve-nü aN fraNs pür ma fa-mii. nu som res-té trwa se-men."},
    ]},
  { id:20, phase:3, color:"#6D28D9", title:"L'Imparfait", subtitle:"Descripción e hábitos pasados", description:"Para describir y hablar de antes",
    exercises:[
      {type:"info", content:"L'IMPARFAIT\n→ Descripción en el pasado\n→ Acciones habituales en el pasado\n→ Base: nous (présent) sin -ons\n\nPARLER: je parlais · tu parlais · il parlait\nnous parlions · vous parliez · ils parlaient\n\nÊTRE (irregular): j'étais · tu étais · il était\nnous étions · vous étiez · ils étaient\n\nQuand j'étais enfant... / Avant, il habitait..."},
      {type:"fill_blank", q:"Quand j'___ enfant, j'habitais en Espagne.", answer:"étais", hint:"être → j'étais"},
      {type:"fill_blank", q:"Avant, il ___ à Madrid. (vivía — habiter)", answer:"habitait", hint:"habiter → il habitait"},
      {type:"multiple_choice", q:"¿PC o Imparfait? «Antes ella siempre cocinaba»", options:["Elle a toujours cuisiné","Elle cuisinait toujours","Elle a cuisiné toujours","Elle cuisina toujours"], answer:"Elle cuisinait toujours"},
      {type:"translate", q:"Cuando era pequeña, mi hija no hablaba todavía francés.", answer:"Quand elle était petite, ma fille ne parlait pas encore français.", hint:"cuando era → quand elle était · todavía no → ne...pas encore"},
      {type:"oral", content:"Quand j'étais enfant, je jouais au football. On habitait dans un petit appartement.", guide:"kaN j'é-té aN-faN, je zhü-é o fut-bol. oN a-bi-té daN éN pe-ti ta-par-te-maN."},
      {type:"reto", title:"🗣️ Reto con tu hija", q:"Cuéntale a tu hija algo de cuando eras pequeño, en francés.", tip:"Quand j'étais petit, je... / J'habitais à... / J'aimais..."},
    ]},
  { id:21, phase:3, color:"#6D28D9", title:"Les Adjectifs", subtitle:"Acuerdo y posición", description:"Describir personas, lugares y cosas",
    exercises:[
      {type:"info", content:"LES ADJECTIFS\n→ Acuerdo con nombre: masc./fém., sing./plural\n→ En general van DESPUÉS del nombre\n→ BAGS (Beauté/Âge/Grandeur/qualité) → ANTES\n\ngrand/grande · petit/petite\nbeau/belle · nouveau/nouvelle\nvieux/vieille · bon/bonne\n\nun homme grand (alto) → DESPUÉS\nune belle maison (bonita) → ANTES"},
      {type:"fill_blank", q:"C'est une fille ___. (inteligente fém.)", answer:"intelligente", hint:"adj. después del nombre, acuerdo fém."},
      {type:"multiple_choice", q:"¿Cómo se dice «una casa bonita»? (belle va antes)", options:["une maison belle","une belle maison","un beau maison","une beau maison"], answer:"une belle maison"},
      {type:"multiple_choice", q:"¿Cómo se dice «zapatos cómodos»?", options:["des chaussures confortables","des confortables chaussures","une chaussure confortable","le chaussure confort"], answer:"des chaussures confortables"},
      {type:"translate", q:"Tenemos un coche viejo pero una casa bonita y grande.", answer:"Nous avons une vieille voiture mais une belle grande maison.", hint:"viejo/a → vieux/vieille (antes) · bonita → belle (antes)"},
      {type:"oral", content:"Ma fille est intelligente et curieuse. Notre maison est grande et confortable. C'est une belle vie.", guide:"ma fii é aN-te-li-zhaNt e kü-ry-éz. notr mE-zoN é graNd e koN-for-tabl. sé ün bel vi."},
    ]},
  { id:22, phase:3, color:"#6D28D9", title:"Les Émotions", subtitle:"Sentimientos y estados", description:"Expresar cómo te sientes",
    exercises:[
      {type:"info", content:"LES ÉMOTIONS\n\nJe suis content/e · triste · fatigué/e\nJe suis stressé/e · heureux/heureuse\nJe suis fier/fière (orgulloso/a)\nJ'ai peur · J'ai honte\nJe m'ennuie · Ça m'énerve"},
      {type:"multiple_choice", q:"¿Cómo se dice «estoy muy contento»?", options:["Je suis très triste","Je suis très content","J'ai très peur","Je suis très fatigué"], answer:"Je suis très content"},
      {type:"fill_blank", q:"Elle est ___ aujourd'hui. (triste)", answer:"triste", hint:"triste no cambia en fém."},
      {type:"translate", q:"Estoy muy feliz de aprender francés para hablar con mi familia.", answer:"Je suis très heureux d'apprendre le français pour parler avec ma famille.", hint:"feliz → heureux · de aprender → d'apprendre"},
      {type:"oral", content:"Je suis content quand je parle français avec ma fille. Ça me rend heureux!", guide:"je swi koN-taN kaN je parl fraN-sé a-vek ma fii. sa me raN é-ré!"},
      {type:"reto", title:"💬 Reto emocional", q:"Dile a tu hija cómo te sientes cuando habláis en francés juntos.", tip:"Je suis très content quand tu parles français avec moi. Ça me rend heureux!"},
    ]},
  { id:23, phase:3, color:"#6D28D9", title:"Le Corps & La Santé", subtitle:"Cuerpo y salud", description:"Para el médico o hablar de salud",
    exercises:[
      {type:"info", content:"LE CORPS\nla tête · le ventre · le dos · la main\nle pied · le genou · la gorge · le nez\nl'œil/les yeux · l'oreille · le bras · la jambe\n\nLA SANTÉ\nJ'ai mal à... (me duele...)\nJ'ai de la fièvre · Je suis malade\nJe tousse · J'ai un rhume\nJe suis allergique à..."},
      {type:"fill_blank", q:"J'ai mal à la ___. (cabeza)", answer:"tête", hint:"cabeza = la tête"},
      {type:"multiple_choice", q:"¿Cómo se dice «me duele la barriga»?", options:["J'ai la ventre","J'ai mal au ventre","J'ai mal à la gorge","Je suis mal ventre"], answer:"J'ai mal au ventre"},
      {type:"translate", q:"Mi hija tiene fiebre y le duele la garganta.", answer:"Ma fille a de la fièvre et elle a mal à la gorge.", hint:"tiene fiebre → a de la fièvre · garganta → la gorge"},
      {type:"oral", content:"Bonjour docteur. J'ai mal au dos depuis trois jours. J'ai aussi de la fièvre.", guide:"bõ-zhür dok-tér. j'é mal o do de-pwi trwa zhür. j'é o-si de la fyé-vr."},
    ]},
  { id:24, phase:3, color:"#6D28D9", title:"Les Loisirs", subtitle:"Ocio y tiempo libre", description:"Hablar de lo que te gusta hacer",
    exercises:[
      {type:"info", content:"LES LOISIRS\n\nle cinéma · la lecture · la musique\nle sport · le vélo · la randonnée\nles voyages · la cuisine · le jardinage\njouer aux jeux vidéo\njouer d'un instrument\nregarder des séries/films\n\nJ'aime... · Je préfère... · J'adore... · Je déteste..."},
      {type:"multiple_choice", q:"¿Cómo se dice «me encanta la lectura»?", options:["Je préfère la lecture","J'adore la lecture","Je n'aime pas la lecture","J'aime un peu la lecture"], answer:"J'adore la lecture"},
      {type:"fill_blank", q:"Le week-end, j'aime faire des ___. (senderismo)", answer:"randonnées", hint:"senderismo = la randonnée"},
      {type:"translate", q:"Me gusta el cine pero prefiero los viajes con mi familia.", answer:"J'aime le cinéma mais je préfère les voyages avec ma famille.", hint:"me gusta → j'aime · prefiero → je préfère"},
      {type:"oral", content:"J'aime beaucoup le sport et la musique. Le week-end, j'adore faire des promenades avec ma famille.", guide:"j'em bo-kü le spor e la mü-zik. le wik-end, j'a-dor fér dé pro-mnad a-vek ma fa-mii."},
      {type:"reto", title:"🗣️ Reto con tu hija", q:"Pregúntale a tu hija qué le gusta hacer en su tiempo libre. En francés.", tip:"Qu'est-ce que tu aimes faire? Tu préfères le cinéma ou la musique?"},
    ]},
  { id:25, phase:3, color:"#6D28D9", title:"Raconter", subtitle:"Contar historias", description:"Combinar PC e imparfait para narrar",
    exercises:[
      {type:"info", content:"NARRAR EN PASADO\n\nIMPARFAIT → contexto, descripción, hábito\nPASSÉ COMPOSÉ → acción puntual, evento\n\n«Il faisait beau quand nous sommes arrivés.»\n(Hacía buen tiempo cuando llegamos.)\n\nd'abord (primero) · ensuite (luego)\naprès (después) · finalement\npendant que (mientras) · soudain (de repente)"},
      {type:"multiple_choice", q:"¿PC o Imparfait? «Cuando llegué, llovía.»", options:["Quand je suis arrivé, il pleut.","Quand j'arrivais, il a plu.","Quand je suis arrivé, il pleuvait.","Quand je suis arrivé, il pleuverait."], answer:"Quand je suis arrivé, il pleuvait."},
      {type:"fill_blank", q:"D'abord j'ai mangé, ___ j'ai regardé un film. (luego)", answer:"ensuite", hint:"luego → ensuite"},
      {type:"translate", q:"El verano pasado fuimos a Francia. Hacía calor y los niños jugaban en el jardín.", answer:"L'été dernier nous sommes allés en France. Il faisait chaud et les enfants jouaient dans le jardin.", hint:"fuimos → sommes allés · hacía calor → il faisait chaud"},
      {type:"oral", content:"L'année dernière, on est allés en France. D'abord on a visité Paris, ensuite on est restés chez ma belle-mère.", guide:"la-né der-nyér, oN é za-lé aN fraNs. da-bor oN na vi-zi-té pa-ri, aN-swit oN é res-té shé ma bel-mér."},
      {type:"reto", title:"📝 Reto narrativo", q:"Cuéntale a tu hija las últimas vacaciones en familia, en francés. Mínimo 5 frases.", tip:"L'été dernier... / D'abord nous avons... / Il faisait... / Ensuite nous sommes... / C'était super!"},
    ]},

  // ── FASE 4 ──
  { id:26, phase:4, color:"#B45309", title:"Verbes Pronominaux", subtitle:"Se lever, se laver…", description:"Verbos reflexivos: rutinas diarias",
    exercises:[
      {type:"info", content:"VERBES PRONOMINAUX\n\nje me lève · tu te lèves · il/elle se lève\nnous nous levons · vous vous levez · ils se lèvent\n\n→ PC avec ÊTRE siempre\n\nse réveiller (despertarse)\nse laver / se doucher (lavarse/ducharse)\ns'habiller (vestirse)\nse coucher (acostarse)\nse brosser les dents\ns'appeler (llamarse)"},
      {type:"fill_blank", q:"Je me ___ à sept heures. (lever)", answer:"lève", hint:"je me + lève"},
      {type:"fill_blank", q:"Elle s'___ Marie. (llamarse)", answer:"appelle", hint:"elle s'appelle"},
      {type:"multiple_choice", q:"¿Cómo se dice «nos acostamos a las diez»?", options:["Nous se couchons à dix heures","Nous nous couchons à dix heures","Nous vous couchez à dix heures","On se couche à dix heures"], answer:"Nous nous couchons à dix heures"},
      {type:"translate", q:"Por la mañana me despierto, me ducho y me visto.", answer:"Le matin je me réveille, je me douche et je m'habille.", hint:"me despierto → je me réveille · me ducho → je me douche · me visto → je m'habille"},
      {type:"oral", content:"Le matin, je me réveille à six heures et demie. Je me douche, je m'habille et je prends le petit-déjeuner.", guide:"le ma-teN, je me ré-vei a si zér e de-mi. je me düsh, je ma-bii e je praN le pe-ti dé-zhé-né."},
      {type:"reto", title:"⏰ Reto mañanero", q:"Mañana, cuando te levantes, cuéntale a tu hija tu rutina en francés.", tip:"Je me réveille à... / Je me douche... / Je m'habille... / Je prends le petit-déjeuner..."},
    ]},
  { id:27, phase:4, color:"#B45309", title:"La Comparaison", subtitle:"Plus, moins, aussi… que", description:"Comparar personas, cosas y situaciones",
    exercises:[
      {type:"info", content:"LA COMPARAISON\n\nplus + adj + que   → más... que\nmoins + adj + que  → menos... que\naussi + adj + que  → tan... como\n\nIl est plus grand que moi.\nC'est moins cher qu'en Espagne.\nElle est aussi intelligente que lui.\n\nIRREGULARES:\nbon → meilleur/e (mejor)\nmauvais → pire (peor)"},
      {type:"multiple_choice", q:"¿Cómo se dice «es más barato que en España»?", options:["C'est plus cher qu'en Espagne","C'est moins cher qu'en Espagne","C'est aussi cher qu'en Espagne","C'est le moins cher"], answer:"C'est moins cher qu'en Espagne"},
      {type:"fill_blank", q:"Ma fille est ___ grande que moi. (más)", answer:"plus", hint:"más → plus"},
      {type:"multiple_choice", q:"¿Cómo se dice «la comida es mejor aquí»?", options:["La nourriture est plus bonne ici","La nourriture est meilleure ici","La nourriture est bonne que ici","La nourriture est la plus bonne"], answer:"La nourriture est meilleure ici"},
      {type:"translate", q:"El francés es más difícil que el español pero menos difícil que el chino.", answer:"Le français est plus difficile que l'espagnol mais moins difficile que le chinois.", hint:"más difícil → plus difficile · menos → moins"},
      {type:"oral", content:"La France est plus grande que l'Espagne. Mais l'Espagne a aussi un beau patrimoine. Les deux pays sont super!", guide:"la fraNs é plü graNd ke les-pan-ye. mé les-pan-ye a o-si éN bo pa-tri-mwan."},
    ]},
  { id:28, phase:4, color:"#B45309", title:"Verbes Irréguliers", subtitle:"Venir, prendre, voir, savoir…", description:"Los irregulares más usados",
    exercises:[
      {type:"info", content:"VERBES IRRÉGULIERS\n\nVENIR: je viens · tu viens · il vient\n       nous venons · vous venez · ils viennent\n\nPRENDRE: je prends · tu prends · il prend\n          nous prenons · vous prenez · ils prennent\n\nVOIR: je vois · tu vois · il voit\n      nous voyons · vous voyez · ils voient\n\nSAVOIR: je sais · tu sais · il sait\n\nMETTRE: je mets · tu mets · il met"},
      {type:"fill_blank", q:"Je ___ du café le matin. (tomar — prendre)", answer:"prends", hint:"prendre → je prends"},
      {type:"fill_blank", q:"Tu ___ parler français? (¿sabes?)", answer:"sais", hint:"savoir → tu sais"},
      {type:"multiple_choice", q:"¿Cómo se dice «ellos vienen mañana»?", options:["Ils venent demain","Ils vienent demain","Ils viennent demain","Ils vient demain"], answer:"Ils viennent demain"},
      {type:"translate", q:"No sé si ella viene mañana. ¿Puedes ver si está en casa?", answer:"Je ne sais pas si elle vient demain. Tu peux voir si elle est à la maison?", hint:"no sé → je ne sais pas · ver → voir"},
      {type:"oral", content:"Je prends le train demain. Je viens chez vous à midi. Je ne sais pas encore l'heure exacte.", guide:"je praN le treN de-meN. je vyeN shé vu a mi-di. je ne sé pa aN-kor lér eg-zakt."},
    ]},
  { id:29, phase:4, color:"#B45309", title:"Pronoms Toniques", subtitle:"Moi, toi, lui, elle…", description:"Para enfatizar y hablar de personas",
    exercises:[
      {type:"info", content:"PRONOMS TONIQUES\n\nmoi · toi · lui · elle\nnous · vous · eux · elles\n\nUSOS:\n1. Después de preposición: C'est pour moi.\n2. Énfasis: Moi, je parle français!\n3. Comparación: plus grand que moi.\n4. Respuesta sola: Qui? — Moi!\n5. C'est + pronom: C'est lui! C'est elle!"},
      {type:"multiple_choice", q:"¿Cómo se dice «esto es para ti»?", options:["C'est pour tu","C'est pour toi","C'est pour lui","C'est pour elle"], answer:"C'est pour toi"},
      {type:"fill_blank", q:"C'est ___! (soy yo)", answer:"moi", hint:"yo enfático → moi"},
      {type:"multiple_choice", q:"¿Cómo se dice «ella es más simpática que él»?", options:["Elle est plus sympa que il","Elle est plus sympa que lui","Elle est plus sympa que moi","Elle est plus sympa que toi"], answer:"Elle est plus sympa que lui"},
      {type:"translate", q:"¡Yo hablo francés! Y ella también. Aprendemos juntos.", answer:"Moi, je parle français! Et elle aussi. On apprend ensemble.", hint:"yo énfasis → moi · ella también → elle aussi"},
      {type:"oral", content:"Moi, j'apprends le français. Ma femme, elle le parle déjà très bien. Et toi, tu parles français?", guide:"mwa, j'a-praN le fraN-sé. ma fam, el le parl dé-zha tré byeN. é twa, tü parl fraN-sé?"},
    ]},

  // ── FASE 5 ──
  { id:30, phase:5, color:"#BE185D", title:"Futur Proche", subtitle:"Aller + infinitif", description:"Hablar de planes e intenciones",
    exercises:[
      {type:"info", content:"FUTUR PROCHE\n→ Aller (présent) + infinitif\n\nje vais parler · tu vas manger\nil va partir · nous allons voir\nvous allez faire · ils vont venir\n\nNEGATIF: Je ne vais pas travailler demain."},
      {type:"fill_blank", q:"Je vais ___ le français. (aprender)", answer:"apprendre", hint:"aller + infinitif"},
      {type:"fill_blank", q:"Nous allons ___ en France cet été.", answer:"aller", hint:"nous allons + aller"},
      {type:"multiple_choice", q:"¿Cómo se dice «ella va a llamar mañana»?", options:["Elle va appelé demain","Elle va appeler demain","Elle aller appeler demain","Elle va à appeler demain"], answer:"Elle va appeler demain"},
      {type:"translate", q:"Este fin de semana vamos a visitar a los abuelos y vamos a comer juntos.", answer:"Ce week-end on va visiter les grands-parents et on va manger ensemble.", hint:"vamos a → on va + infinitif · abuelos → les grands-parents"},
      {type:"oral", content:"Ce soir je vais parler français avec ma fille. Demain on va faire une promenade. C'est notre programme!", guide:"se swar je vé parl fraN-sé a-vek ma fii. de-meN oN va fér ün pro-mnad."},
      {type:"reto", title:"📅 Reto de la semana", q:"Esta noche, cuéntale a tu hija en francés 3 planes para el fin de semana.", tip:"Ce week-end on va... / Samedi je vais... / Dimanche nous allons..."},
    ]},
  { id:31, phase:5, color:"#BE185D", title:"Les Questions", subtitle:"Est-ce que, quand, pourquoi…", description:"Hacer preguntas correctamente",
    exercises:[
      {type:"info", content:"LES QUESTIONS\n\n1. INTONATION (informal): Tu viens demain?\n2. EST-CE QUE: Est-ce que tu viens?\n3. INVERSION (formal): Viens-tu demain?\n\nqui? · que/quoi? · quand? · où?\npourquoi? · comment? · combien?\nquel/quelle?"},
      {type:"multiple_choice", q:"¿Cómo se dice «¿cuándo llegas?»", options:["Quand est-ce que tu arrives?","Pourquoi tu arrives?","Comment tu arrives?","Où tu arrives?"], answer:"Quand est-ce que tu arrives?"},
      {type:"fill_blank", q:"___ est-ce que tu habites? (¿dónde?)", answer:"Où", hint:"¿dónde? → où"},
      {type:"multiple_choice", q:"¿Cómo se dice «¿cuántos años tienes?»", options:["Combien tu es?","Quel âge tu as?","Quand tu as ans?","Comment âge tu as?"], answer:"Quel âge tu as?"},
      {type:"translate", q:"¿Por qué no vienes a cenar con nosotros esta noche?", answer:"Pourquoi est-ce que tu ne viens pas dîner avec nous ce soir?", hint:"¿por qué? → pourquoi · ¿no vienes? → tu ne viens pas"},
      {type:"oral", content:"Comment tu vas? Qu'est-ce que tu as fait aujourd'hui? Tu as mangé? Tu veux du café?", guide:"ko-maN tü va? kes-ke tü a fé o-zhür-dwi? tü a maN-zhé? tü vé dü ka-fé?"},
    ]},
  { id:32, phase:5, color:"#BE185D", title:"Les Pronoms", subtitle:"Le, la, lui, y, en…", description:"Evitar repeticiones y hablar con fluidez",
    exercises:[
      {type:"info", content:"PRONOMS COMPLÉMENTS\n\nCOD: le/la/l' · les (lo/la · los/las)\n«Je mange le pain» → «Je le mange»\n\nCOI (personas): lui (sing.) · leur (plural)\n«Je parle à ma fille» → «Je lui parle»\n\nY → lugar o «à + cosa»\n«Je pense à la réunion» → «J'y pense»\n\nEN → «de + cosa»\n«Tu veux du café?» → «Oui, j'en veux»"},
      {type:"multiple_choice", q:"«Je regarde le film» → con pronombre:", options:["Je lui regarde","Je le regarde","J'en regarde","J'y regarde"], answer:"Je le regarde"},
      {type:"fill_blank", q:"Je ___ parle tous les jours. (a mi hija → lui)", answer:"lui", hint:"à + persona → lui"},
      {type:"multiple_choice", q:"«Tu veux des pâtes?» → «Oui, j'___ veux.»", options:["le","la","en","y"], answer:"en"},
      {type:"translate", q:"¿Ves a tu hija todos los días? — Sí, la veo todos los días.", answer:"Tu vois ta fille tous les jours? — Oui, je la vois tous les jours.", hint:"la ves → tu la vois · todos los días → tous les jours"},
      {type:"oral", content:"Ma fille? Je la vois tous les soirs. Sa grand-mère lui téléphone souvent. On l'aime beaucoup!", guide:"ma fii? je la vwa tü lé swar. sa graN-mér lüi té-lé-fon sü-vaN. oN lem bo-kü!"},
    ]},
  { id:33, phase:5, color:"#BE185D", title:"Connecteurs", subtitle:"Mais, parce que, donc…", description:"Unir ideas y expresarte con fluidez",
    exercises:[
      {type:"info", content:"CONNECTEURS ESSENTIELS\n\net · mais · ou · donc · car\nalors → entonces · pourtant → sin embargo\n\nparce que → porque\nquand · si · pour + inf (para)\nque\n\nmalgré ça → a pesar de eso\nquand même → de todas formas"},
      {type:"multiple_choice", q:"¿Cómo se dice «hablo francés pero no perfectamente»?", options:["Je parle français ou pas parfaitement","Je parle français mais pas parfaitement","Je parle français donc pas parfaitement","Je parle français car pas parfaitement"], answer:"Je parle français mais pas parfaitement"},
      {type:"fill_blank", q:"J'apprends le français ___ parler avec ma famille.", answer:"pour", hint:"para + inf → pour"},
      {type:"translate", q:"Aprendo francés porque quiero hablar con mi hija. Es difícil pero lo consigo.", answer:"J'apprends le français parce que je veux parler avec ma fille. C'est difficile mais j'y arrive.", hint:"porque → parce que · pero → mais · lo consigo → j'y arrive"},
      {type:"oral", content:"Je ne parle pas encore très bien français, pourtant je fais des progrès. Je pratique parce que c'est important pour ma famille.", guide:"je ne parl pa aN-kor tré byeN fraN-sé, pür-taN je fé dé pro-gré."},
      {type:"reto", title:"✍️ Reto de escritura", q:"Escríbele a tu suegra un mensaje de 5-6 frases sobre cómo va tu aprendizaje. Usa al menos 3 conectores.", tip:"J'apprends le français depuis... / C'est difficile mais... / Je comprends mieux parce que..."},
    ]},
  { id:34, phase:5, color:"#BE185D", title:"La Météo & Saisons", subtitle:"Tiempo y estaciones", description:"Hablar del tiempo y hacer planes",
    exercises:[
      {type:"info", content:"LA MÉTÉO\n\nIl fait beau / mauvais temps\nIl fait chaud / froid\nIl pleut (llueve) · Il neige (nieva)\nIl y a du vent / du soleil / du brouillard\nIl fait [n] degrés\n\nle printemps · l'été · l'automne · l'hiver\nEn été / En hiver / Au printemps / En automne"},
      {type:"multiple_choice", q:"¿Cómo se dice «llueve»?", options:["Il fait froid","Il neige","Il pleut","Il y a du vent"], answer:"Il pleut"},
      {type:"fill_blank", q:"En été, il fait ___. (calor)", answer:"chaud", hint:"calor → chaud"},
      {type:"translate", q:"Esta semana hace frío y llueve. No podemos ir al parque.", answer:"Cette semaine il fait froid et il pleut. On ne peut pas aller au parc.", hint:"esta semana → cette semaine · no podemos → on ne peut pas"},
      {type:"oral", content:"Quel temps il fait aujourd'hui? Il fait beau! Il y a du soleil. On va aller se promener!", guide:"kel taN il fé o-zhür-dwi? il fé bo! il i a dü so-lei. oN va a-lé se pro-mné!"},
      {type:"reto", title:"☀️ Reto cotidiano", q:"Mañana por la mañana, coméntale a tu hija cómo está el tiempo en francés.", tip:"Regarde! Aujourd'hui il fait... / Il y a du... / On peut aller à..."},
    ]},
  { id:35, phase:5, color:"#BE185D", title:"🤖 Conversación IA · 1", subtitle:"Preséntate y habla de tu familia", description:"Practica con una IA en situación real",
    exercises:[
      {type:"info", content:"CONVERSACIÓN LIBRE\n\nVas a conversar con una IA en francés.\nElla hará el papel de tu suegra francesa.\n\n🎯 OBJETIVO:\n→ Presentarte\n→ Hablar de tu hija\n→ Contar dónde vivís\n→ Expresar por qué aprendes francés\n\nSi te bloqueas, escribe en español.\n¡Lo importante es intentarlo!"},
      {type:"conversation", systemPrompt:"Tu es la belle-mère de l'utilisateur, une femme française chaleureuse et patiente. L'utilisateur est espagnol et apprend le français. Parle lentement et clairement. Corrige ses erreurs doucement en montrant la forme correcte entre parenthèses. Pose des questions sur lui, sa femme, et sa fille. Sois très encourageante. Limite tes réponses à 2-3 phrases maximum."},
    ]},
  { id:36, phase:5, color:"#BE185D", title:"🤖 Conversación IA · 2", subtitle:"Restaurante y mercado", description:"Simula situaciones cotidianas en Francia",
    exercises:[
      {type:"info", content:"CONVERSACIÓN SITUACIONAL\n\n🍽️ SITUACIÓN 1:\nEstás en un restaurante en Francia.\nHaces el pedido completo.\n\n🛒 SITUACIÓN 2:\nEstás en el mercado.\nPreguntas precios y pides productos.\n\n🎯 OBJETIVO:\n→ Je voudrais... / Je vais prendre...\n→ Combien ça coûte? / C'est combien?\n→ Expresar preferencias y despedirte\n\n¡Tú empiezas!"},
      {type:"conversation", systemPrompt:"Tu joues deux rôles successivement: d'abord un serveur de restaurant français sympa, puis un vendeur au marché. L'utilisateur est espagnol qui apprend le français. Corrige ses erreurs gentiment entre parenthèses. Guide-le si nécessaire. Limite tes réponses à 2-3 phrases."},
    ]},
];

// ── HELPERS ──
function starsCount(score, total) {
  const p = total > 0 ? score / total : 0;
  return p >= 0.8 ? 3 : p >= 0.6 ? 2 : p > 0 ? 1 : 0;
}
function PBar({ value, max, color, height=5, bg="rgba(255,255,255,0.25)" }) {
  return <div style={{background:bg,borderRadius:99,height,overflow:"hidden"}}><div style={{width:`${Math.min(100,Math.round((value/max)*100))}%`,height:"100%",background:color,borderRadius:99,transition:"width 0.4s ease"}}/></div>;
}
function Stars({ n, color }) {
  return <span style={{fontSize:13,letterSpacing:1}}>{[1,2,3].map(i=><span key={i} style={{color:i<=n?color:"#D1D5DB"}}>★</span>)}</span>;
}
function Btn({ onClick, disabled, children, outline, color="#1B3464", style:s={} }) {
  return <button onClick={onClick} disabled={disabled} style={{width:"100%",padding:"14px",border:outline?`2px solid ${color}`:"none",background:outline?"transparent":(disabled?"#9CA3AF":color),color:outline?color:"white",borderRadius:12,fontSize:15,fontWeight:700,cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.6:1,transition:"opacity 0.15s",...sans,...s}}>{children}</button>;
}

// ── SETUP SCREEN (API Key) ──
function SetupView({ onSave }) {
  const [key, setKey] = useState("");
  return (
    <div style={{...sans,background:T.bg,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px"}}>
      <div style={{maxWidth:420,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:56,marginBottom:12}}>🇫🇷</div>
          <h1 style={{...serif,fontSize:26,fontWeight:700,margin:"0 0 8px",color:"#1B3464"}}>La App de Juampe</h1>
          <p style={{margin:0,color:T.muted,fontSize:14}}>Configuración inicial · solo una vez</p>
        </div>
        <div style={{background:T.card,borderRadius:20,padding:24,border:`1.5px solid ${T.border}`,boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
          <p style={{margin:"0 0 6px",fontWeight:700,fontSize:15}}>API Key de Anthropic</p>
          <p style={{margin:"0 0 16px",fontSize:13,color:T.muted,lineHeight:1.5}}>Necesaria para los módulos de conversación con IA (módulos 35 y 36). Puedes obtenerla en <strong>console.anthropic.com</strong> → API Keys.</p>
          <input type="password" value={key} onChange={e=>setKey(e.target.value)} placeholder="sk-ant-..."
            style={{width:"100%",boxSizing:"border-box",border:`2px solid ${T.border}`,borderRadius:10,padding:"12px 14px",fontSize:14,...sans,outline:"none",marginBottom:16}}/>
          <Btn onClick={()=>{saveApiKey(key);onSave();}} color="#1B3464">Guardar y empezar →</Btn>
          <button onClick={onSave} style={{width:"100%",marginTop:10,background:"transparent",border:"none",color:T.muted,fontSize:13,cursor:"pointer",padding:"8px",...sans}}>
            Saltar por ahora (sin conversación IA)
          </button>
        </div>
      </div>
    </div>
  );
}

// ── HOME ──
function HomeView({ progress, onStart, onSettings }) {
  const [openPhase, setOpenPhase] = useState(1);
  const completedMods = Object.values(progress).filter(p=>p.completed).length;
  const totalScore = Object.values(progress).reduce((a,p)=>a+(p.score||0),0);
  const totalPossible = Object.values(progress).reduce((a,p)=>a+(p.total||0),0);
  const globalPct = totalPossible>0?Math.round((totalScore/totalPossible)*100):0;

  function isUnlocked(phaseId) {
    if(phaseId===1) return true;
    const prev=MODULES.filter(m=>m.phase===phaseId-1);
    const prevT=prev.map(m=>m.exercises.filter(e=>e.type!=="info"&&e.type!=="conversation").length).reduce((a,b)=>a+b,0);
    const prevS=prev.reduce((acc,m)=>acc+(progress[m.id]?.score||0),0);
    return prevT===0||(prevS/prevT)>=0.7;
  }

  return (
    <div style={{...sans,background:T.bg,minHeight:"100vh",paddingBottom:40}}>
      <div style={{background:"#1B3464",color:"white",padding:"36px 20px 24px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-15,right:-15,fontSize:120,opacity:0.05}}>🇫🇷</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <p style={{...serif,margin:"0 0 2px",fontSize:11,letterSpacing:"0.18em",opacity:0.6,textTransform:"uppercase"}}>Francés · Nivel A2</p>
            <h1 style={{...serif,margin:"0 0 20px",fontSize:28,fontWeight:700}}>La App de Juampe</h1>
          </div>
          <button onClick={onSettings} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"white",borderRadius:8,padding:"6px 10px",cursor:"pointer",fontSize:13,...sans}}>⚙️</button>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          {[{label:"Módulos",value:`${completedMods}/${MODULES.length}`},{label:"Precisión",value:`${globalPct}%`},{label:"Puntos",value:totalScore}].map(s=>(
            <div key={s.label} style={{flex:1,background:"rgba(255,255,255,0.12)",borderRadius:12,padding:"10px 8px"}}>
              <p style={{margin:"0 0 2px",fontSize:18,fontWeight:700,...serif}}>{s.value}</p>
              <p style={{margin:0,fontSize:9,opacity:0.65,textTransform:"uppercase",letterSpacing:"0.06em"}}>{s.label}</p>
            </div>
          ))}
        </div>
        <PBar value={completedMods} max={MODULES.length} color="white" height={4}/>
      </div>
      <div style={{padding:"16px 16px 0"}}>
        {PHASES_META.map(ph=>{
          const mods=MODULES.filter(m=>m.phase===ph.id);
          const unlocked=isUnlocked(ph.id);
          const open=openPhase===ph.id;
          const phCompleted=mods.filter(m=>progress[m.id]?.completed).length;
          return (
            <div key={ph.id} style={{marginBottom:10}}>
              <div onClick={()=>unlocked&&setOpenPhase(open?null:ph.id)}
                style={{background:open?ph.color:T.card,borderRadius:14,padding:"14px 16px",cursor:unlocked?"pointer":"default",border:`1.5px solid ${open?ph.color:T.border}`,display:"flex",alignItems:"center",gap:12,opacity:unlocked?1:0.5}}>
                <div style={{width:36,height:36,borderRadius:10,background:open?"rgba(255,255,255,0.2)":ph.color+"20",display:"flex",alignItems:"center",justifyContent:"center",color:open?"white":ph.color,fontWeight:700,fontSize:14,...serif,flexShrink:0}}>{ph.id}</div>
                <div style={{flex:1}}>
                  <p style={{margin:0,fontWeight:700,fontSize:14,color:open?"white":T.text}}>{ph.name}</p>
                  <p style={{margin:0,fontSize:11,color:open?"rgba(255,255,255,0.7)":T.muted}}>{ph.weeks} · {phCompleted}/{mods.length} módulos {!unlocked&&"· 🔒 completa la fase anterior al 70%"}</p>
                </div>
                <span style={{color:open?"white":T.muted,fontSize:18}}>{open?"▲":"▼"}</span>
              </div>
              {open&&unlocked&&(
                <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8,paddingLeft:4}}>
                  {mods.map(mod=>{
                    const prog=progress[mod.id];
                    const nonInfo=mod.exercises.filter(e=>e.type!=="info"&&e.type!=="conversation").length;
                    const sc=prog?.score||0;
                    const done=prog?.completed;
                    const st=starsCount(sc,prog?.total||nonInfo);
                    return (
                      <div key={mod.id} onClick={()=>onStart(mod.id)}
                        style={{background:T.card,borderRadius:12,padding:"13px 14px",border:`1.5px solid ${done?mod.color+"44":T.border}`,cursor:"pointer",display:"flex",alignItems:"center",gap:12,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
                        <div style={{width:38,height:38,borderRadius:10,background:mod.color,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:700,fontSize:13,flexShrink:0,...serif}}>{mod.id}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                            <span style={{fontWeight:700,fontSize:14}}>{mod.title}</span>
                            {done&&<Stars n={st} color={mod.color}/>}
                          </div>
                          <p style={{margin:"2px 0 0",fontSize:11,color:T.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{mod.subtitle}</p>
                          {done&&<PBar value={sc} max={prog.total} color={mod.color} height={3} bg="#F3F4F6"/>}
                        </div>
                        <span style={{color:T.muted,fontSize:16,flexShrink:0}}>›</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── EXERCISE HEADER ──
function ExHeader({ mod, exIdx, total, onHome }) {
  return (
    <div style={{background:mod.color,padding:"14px 18px",color:"white"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <button onClick={onHome} style={{background:"rgba(255,255,255,0.18)",border:"none",color:"white",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:700,...sans}}>← Inicio</button>
        <span style={{fontSize:12,opacity:0.8,fontWeight:600}}>{exIdx+1} / {total}</span>
      </div>
      <h2 style={{...serif,margin:"0 0 2px",fontSize:17,fontWeight:700}}>{mod.title}</h2>
      <p style={{margin:"0 0 10px",fontSize:12,opacity:0.75}}>{mod.subtitle}</p>
      <PBar value={exIdx+1} max={total} color="white"/>
    </div>
  );
}

// ── CONVERSATION ──
function ConversationExercise({ ex, mod, apiKey }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  async function callAPI(msgs) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:500,system:ex.systemPrompt+"\n\nRÈGLE: Réponds TOUJOURS en français. Limite tes réponses à 2-3 phrases max.",messages:msgs}),
    });
    const data = await res.json();
    return data.content?.find(b=>b.type==="text")?.text || "Désolé, réessaie!";
  }

  async function start() {
    setStarted(true); setLoading(true);
    try { const r=await callAPI([{role:"user",content:"Commence la conversation de manière naturelle."}]); setMessages([{role:"assistant",content:r}]); }
    catch { setMessages([{role:"assistant",content:"Bonjour! Comment tu vas?"}]); }
    setLoading(false);
  }

  async function send() {
    if(!input.trim()) return;
    const newMsgs=[...messages,{role:"user",content:input}];
    setMessages(newMsgs); setInput(""); setLoading(true);
    try { const r=await callAPI(newMsgs); setMessages(m=>[...m,{role:"assistant",content:r}]); }
    catch { setMessages(m=>[...m,{role:"assistant",content:"Désolé, problème de connexion!"}]); }
    setLoading(false);
  }

  if(!apiKey) return (
    <div style={{background:"#FEF3C7",border:"1px solid #F59E0B",borderRadius:14,padding:16}}>
      <p style={{margin:0,fontSize:14,color:"#92400E",lineHeight:1.5}}>⚠️ Este módulo requiere una API key de Anthropic. Puedes añadirla pulsando el botón ⚙️ en la pantalla de inicio.</p>
    </div>
  );

  if(!started) return (
    <div>
      <div style={{background:mod.color+"12",border:`1px solid ${mod.color}30`,borderRadius:16,padding:20,marginBottom:16}}>
        <p style={{margin:"0 0 8px",fontWeight:700,color:mod.color}}>¿Listo para conversar?</p>
        <p style={{margin:0,fontSize:14,color:T.muted,lineHeight:1.5}}>La IA hablará contigo en francés. Si te bloqueas, escribe en español.</p>
      </div>
      <Btn onClick={start} color={mod.color}>Iniciar conversación →</Btn>
    </div>
  );

  return (
    <div>
      <div style={{maxHeight:320,overflowY:"auto",display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"80%",background:m.role==="user"?mod.color:T.card,color:m.role==="user"?"white":T.text,borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:"10px 14px",fontSize:14,lineHeight:1.5,border:m.role!=="user"?`1px solid ${T.border}`:"none"}}>{m.content}</div>
          </div>
        ))}
        {loading&&<div style={{display:"flex",justifyContent:"flex-start"}}><div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:"16px 16px 16px 4px",padding:"10px 14px",fontSize:14,color:T.muted}}>...</div></div>}
      </div>
      <div style={{display:"flex",gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!loading&&send()} placeholder="Écris en français…" disabled={loading}
          style={{flex:1,border:`2px solid ${T.border}`,borderRadius:10,padding:"10px 14px",fontSize:14,...sans,outline:"none",background:T.card}}/>
        <button onClick={send} disabled={loading||!input.trim()} style={{background:mod.color,color:"white",border:"none",borderRadius:10,padding:"10px 16px",cursor:loading||!input.trim()?"not-allowed":"pointer",fontWeight:700,...sans,opacity:loading||!input.trim()?0.5:1}}>→</button>
      </div>
    </div>
  );
}

// ── EXERCISE VIEW ──
function ExerciseView({ mod, ex, exIdx, total, input, setInput, checked, isCorrect, onCheck, onSelfAssess, onNext, isLast, onHome, apiKey }) {
  const [revealed, setRevealed] = useState(false);
  if(!ex) return null;
  const Badge=({label})=><span style={{display:"inline-block",background:mod.color+"18",color:mod.color,fontSize:10,fontWeight:700,letterSpacing:"0.07em",padding:"3px 10px",borderRadius:99,textTransform:"uppercase",marginBottom:12}}>{label}</span>;

  if(ex.type==="info") return (
    <div style={{...sans,background:T.bg,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <ExHeader mod={mod} exIdx={exIdx} total={total} onHome={onHome}/>
      <div style={{flex:1,padding:"20px"}}>
        <div style={{background:mod.color,borderRadius:18,padding:"22px",color:"white",marginBottom:14}}>
          <p style={{margin:"0 0 10px",fontSize:10,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",opacity:0.75}}>Tabla de referencia</p>
          <pre style={{margin:0,...sans,fontSize:13,lineHeight:1.85,whiteSpace:"pre-wrap",fontWeight:500}}>{ex.content}</pre>
        </div>
      </div>
      <div style={{padding:"14px 20px",borderTop:`1px solid ${T.border}`}}><Btn onClick={onNext} color={mod.color}>Empezar ejercicios →</Btn></div>
    </div>
  );

  if(ex.type==="oral") return (
    <div style={{...sans,background:T.bg,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <ExHeader mod={mod} exIdx={exIdx} total={total} onHome={onHome}/>
      <div style={{flex:1,padding:"20px"}}>
        <Badge label="🎙️ En voz alta"/>
        <p style={{...serif,fontSize:13,fontWeight:600,color:T.muted,margin:"0 0 14px"}}>Lee estas frases en voz alta:</p>
        <div style={{background:T.card,border:`2px solid ${mod.color}44`,borderRadius:16,padding:"20px",marginBottom:16}}>
          <p style={{...serif,fontSize:18,lineHeight:1.6,margin:"0 0 16px",color:T.text}}>{ex.content}</p>
          <div style={{background:mod.color+"12",borderRadius:10,padding:"10px 14px"}}>
            <p style={{margin:"0 0 3px",fontSize:10,fontWeight:700,color:mod.color,textTransform:"uppercase",letterSpacing:"0.06em"}}>Pronunciación</p>
            <p style={{margin:0,fontSize:13,color:mod.color,fontStyle:"italic"}}>{ex.guide}</p>
          </div>
        </div>
      </div>
      <div style={{padding:"14px 20px",borderTop:`1px solid ${T.border}`}}>
        {!checked?<Btn onClick={()=>onSelfAssess(true)} color={mod.color}>✓ Lo he dicho en voz alta</Btn>:<Btn onClick={onNext} color={mod.color}>{isLast?"Ver resultados →":"Siguiente →"}</Btn>}
      </div>
    </div>
  );

  if(ex.type==="reto") return (
    <div style={{...sans,background:T.bg,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <ExHeader mod={mod} exIdx={exIdx} total={total} onHome={onHome}/>
      <div style={{flex:1,padding:"20px"}}>
        <Badge label="⚡ Reto real"/>
        <h3 style={{...serif,fontSize:20,margin:"0 0 14px"}}>{ex.title}</h3>
        <div style={{background:T.card,border:`2px solid ${mod.color}55`,borderRadius:16,padding:20,marginBottom:14}}>
          <p style={{margin:"0 0 14px",fontSize:15,lineHeight:1.6,fontWeight:500}}>{ex.q}</p>
          <div style={{background:mod.color+"12",borderRadius:10,padding:"12px 14px"}}>
            <p style={{margin:"0 0 4px",fontSize:10,fontWeight:700,color:mod.color,textTransform:"uppercase",letterSpacing:"0.06em"}}>💡 Pista</p>
            <p style={{margin:0,fontSize:13,color:mod.color,lineHeight:1.5}}>{ex.tip}</p>
          </div>
        </div>
      </div>
      <div style={{padding:"14px 20px",borderTop:`1px solid ${T.border}`,display:"flex",flexDirection:"column",gap:8}}>
        {!checked?(<><Btn onClick={()=>onSelfAssess(true)} color={mod.color}>✓ ¡Reto completado!</Btn><Btn onClick={()=>onSelfAssess(false)} outline color={mod.color}>Lo haré más tarde</Btn></>)
          :<Btn onClick={onNext} color={mod.color}>{isLast?"Ver resultados →":"Siguiente →"}</Btn>}
      </div>
    </div>
  );

  if(ex.type==="conversation") return (
    <div style={{...sans,background:T.bg,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <ExHeader mod={mod} exIdx={exIdx} total={total} onHome={onHome}/>
      <div style={{flex:1,padding:"20px",overflowY:"auto"}}>
        <Badge label="🤖 Conversación IA"/>
        <ConversationExercise ex={ex} mod={mod} apiKey={apiKey}/>
      </div>
      <div style={{padding:"14px 20px",borderTop:`1px solid ${T.border}`}}>
        <Btn onClick={onNext} color={mod.color}>{isLast?"Ver resultados →":"Siguiente →"}</Btn>
      </div>
    </div>
  );

  return (
    <div style={{...sans,background:T.bg,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <ExHeader mod={mod} exIdx={exIdx} total={total} onHome={onHome}/>
      <div style={{flex:1,padding:"20px 20px 0",overflowY:"auto"}}>
        <Badge label={{fill_blank:"Completa",multiple_choice:"Elige",translate:"Traduce"}[ex.type]}/>
        <p style={{...serif,fontSize:20,fontWeight:600,margin:"0 0 20px",lineHeight:1.4}}>{ex.q}</p>

        {ex.type==="multiple_choice"&&(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {ex.options.map(opt=>{
              let bg=T.card,border=T.border,color=T.text;
              if(checked){if(opt===ex.answer){bg=T.greenBg;border=T.green;color=T.green;}else if(opt===input){bg=T.redBg;border=T.red;color=T.red;}}
              else if(opt===input){bg=mod.color+"18";border=mod.color;color=mod.color;}
              return <div key={opt} onClick={()=>!checked&&setInput(opt)} style={{background:bg,border:`2px solid ${border}`,color,borderRadius:12,padding:"13px 16px",cursor:checked?"default":"pointer",fontWeight:600,fontSize:14,transition:"all 0.15s"}}>{opt}</div>;
            })}
          </div>
        )}

        {ex.type==="fill_blank"&&(
          <div>
            <input type="text" value={input} onChange={e=>!checked&&setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!checked&&input.trim()&&onCheck()}
              placeholder="Escribe tu respuesta…"
              style={{width:"100%",boxSizing:"border-box",border:`2px solid ${checked?(isCorrect?T.green:T.red):T.border}`,borderRadius:12,padding:"13px 16px",fontSize:16,...sans,background:checked?(isCorrect?T.greenBg:T.redBg):T.card,color:checked?(isCorrect?T.green:T.red):T.text,outline:"none"}}
              disabled={checked} autoFocus/>
            {checked&&!isCorrect&&<p style={{margin:"8px 0 0",color:T.green,fontSize:14,fontWeight:700}}>✓ Correcto: <em>{ex.answer}</em></p>}
            {!checked&&ex.hint&&<p style={{margin:"8px 0 0",color:T.muted,fontSize:12}}>💡 {ex.hint}</p>}
          </div>
        )}

        {ex.type==="translate"&&(
          <div>
            {!revealed?(<><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Escribe tu traducción en francés…" rows={3}
              style={{width:"100%",boxSizing:"border-box",border:`2px solid ${T.border}`,borderRadius:12,padding:"13px 16px",fontSize:14,...sans,background:T.card,color:T.text,outline:"none",resize:"none"}} autoFocus/>
              {ex.hint&&<p style={{margin:"8px 0 0",color:T.muted,fontSize:12}}>💡 {ex.hint}</p>}</>)
            :(<div>
              <div style={{background:T.card,border:`1.5px solid ${T.border}`,borderRadius:12,padding:14,marginBottom:10}}>
                <p style={{margin:"0 0 3px",fontSize:10,fontWeight:700,textTransform:"uppercase",color:T.muted}}>Tu respuesta</p>
                <p style={{margin:0,fontSize:14}}>{input.trim()||<em style={{color:T.muted}}>Sin respuesta</em>}</p>
              </div>
              <div style={{background:T.greenBg,border:`1.5px solid ${T.green}`,borderRadius:12,padding:14,marginBottom:16}}>
                <p style={{margin:"0 0 3px",fontSize:10,fontWeight:700,textTransform:"uppercase",color:T.green}}>Respuesta correcta</p>
                <p style={{margin:0,fontSize:14,color:T.green,fontWeight:700}}>{ex.answer}</p>
              </div>
              {!checked&&(<><p style={{margin:"0 0 10px",fontWeight:700}}>¿Lo tenías?</p><div style={{display:"flex",gap:8}}>
                <button onClick={()=>onSelfAssess(true)} style={{flex:1,padding:13,background:T.green,color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer",...sans}}>✓ Sí</button>
                <button onClick={()=>onSelfAssess(false)} style={{flex:1,padding:13,background:T.red,color:"white",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer",...sans}}>✗ No del todo</button>
              </div></>)}
            </div>)}
          </div>
        )}

        {checked&&!["translate","oral","reto"].includes(ex.type)&&(
          <div style={{marginTop:14,padding:14,borderRadius:12,background:isCorrect?T.greenBg:T.redBg,border:`1.5px solid ${isCorrect?T.green:T.red}`}}>
            <p style={{margin:0,fontWeight:700,color:isCorrect?T.green:T.red,fontSize:14}}>{isCorrect?"✓ Très bien!":"✗ Pas tout à fait…"}</p>
          </div>
        )}
        {checked&&ex.type==="translate"&&(
          <div style={{marginTop:14,padding:14,borderRadius:12,background:isCorrect?T.greenBg:T.redBg,border:`1.5px solid ${isCorrect?T.green:T.red}`}}>
            <p style={{margin:0,fontWeight:700,color:isCorrect?T.green:T.red,fontSize:14}}>{isCorrect?"✓ ¡Bien!":"✗ A repasar — llegarás."}</p>
          </div>
        )}
        <div style={{height:20}}/>
      </div>
      <div style={{padding:"14px 20px",borderTop:`1px solid ${T.border}`,background:T.bg,display:"flex",flexDirection:"column",gap:8}}>
        {ex.type==="translate"&&!revealed&&<Btn onClick={()=>setRevealed(true)} color={mod.color}>Ver respuesta</Btn>}
        {ex.type!=="translate"&&!checked&&<Btn onClick={onCheck} disabled={!input.trim()} color={mod.color}>Comprobar</Btn>}
        {checked&&<Btn onClick={onNext} color={mod.color}>{isLast?"Ver resultados →":"Siguiente →"}</Btn>}
      </div>
    </div>
  );
}

// ── RESULTS ──
function ResultsView({ mod, score, total, onHome, onRetry }) {
  const pct=total>0?Math.round((score/total)*100):100;
  const st=starsCount(score,total);
  const {emoji,msg,tip}=pct>=80?{emoji:"🎉",msg:"Excellent!",tip:"Dominas el módulo. Pasa al siguiente con confianza."}
    :pct>=60?{emoji:"👍",msg:"Bien joué!",tip:"Buen resultado. Un repaso rápido y adelante."}
    :{emoji:"💪",msg:"Continue!",tip:"Necesita más práctica. ¡Vuelve a intentarlo!"};
  return (
    <div style={{...sans,background:T.bg,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <div style={{background:mod.color,padding:"48px 24px 32px",color:"white",textAlign:"center"}}>
        <div style={{fontSize:56,marginBottom:10}}>{emoji}</div>
        <div style={{fontSize:24,marginBottom:6}}><Stars n={st} color="gold"/></div>
        <h2 style={{...serif,margin:"0 0 4px",fontSize:24,fontWeight:700}}>{msg}</h2>
        <p style={{margin:0,opacity:0.8,fontSize:14}}>{mod.title} · {mod.subtitle}</p>
      </div>
      <div style={{flex:1,padding:"24px 20px"}}>
        <div style={{background:T.card,borderRadius:20,padding:"24px",textAlign:"center",border:`1.5px solid ${T.border}`,marginBottom:14}}>
          <p style={{...serif,fontSize:48,fontWeight:700,margin:"0 0 4px",color:mod.color}}>{score}<span style={{fontSize:20,color:T.muted}}>/{total}</span></p>
          <p style={{margin:"0 0 14px",color:T.muted,fontSize:13}}>{pct}% de aciertos</p>
          <PBar value={score} max={total} color={pct>=80?T.green:mod.color} height={8} bg="#F3F4F6"/>
        </div>
        <div style={{background:mod.color+"12",border:`1px solid ${mod.color}30`,borderRadius:14,padding:16,marginBottom:20}}>
          <p style={{margin:0,fontSize:14,color:mod.color,fontWeight:600,lineHeight:1.5}}>{tip}</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <Btn onClick={onHome} color={mod.color}>← Volver al inicio</Btn>
          <Btn onClick={onRetry} outline color={mod.color}>🔄 Repetir módulo</Btn>
        </div>
      </div>
    </div>
  );
}

// ── SETTINGS ──
function SettingsView({ onBack }) {
  const [key, setKey] = useState(loadApiKey());
  const [saved, setSaved] = useState(false);
  return (
    <div style={{...sans,background:T.bg,minHeight:"100vh"}}>
      <div style={{background:"#1B3464",padding:"20px",color:"white",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.18)",border:"none",color:"white",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:700,...sans}}>← Volver</button>
        <h2 style={{...serif,margin:0,fontSize:18,fontWeight:700}}>Configuración</h2>
      </div>
      <div style={{padding:"24px 20px"}}>
        <div style={{background:T.card,borderRadius:16,padding:20,border:`1.5px solid ${T.border}`,marginBottom:16}}>
          <p style={{margin:"0 0 6px",fontWeight:700}}>API Key de Anthropic</p>
          <p style={{margin:"0 0 14px",fontSize:13,color:T.muted}}>Para los módulos de conversación IA (35 y 36).</p>
          <input type="password" value={key} onChange={e=>{setKey(e.target.value);setSaved(false);}} placeholder="sk-ant-..."
            style={{width:"100%",boxSizing:"border-box",border:`2px solid ${T.border}`,borderRadius:10,padding:"12px 14px",fontSize:14,...sans,outline:"none",marginBottom:12}}/>
          <Btn onClick={()=>{saveApiKey(key);setSaved(true);}} color="#1B3464">{saved?"✓ Guardado":"Guardar API Key"}</Btn>
        </div>
        <div style={{background:T.card,borderRadius:16,padding:20,border:`1.5px solid ${T.border}`}}>
          <p style={{margin:"0 0 6px",fontWeight:700,color:T.red}}>Borrar progreso</p>
          <p style={{margin:"0 0 14px",fontSize:13,color:T.muted}}>Esto reinicia todos los módulos. No se puede deshacer.</p>
          <Btn onClick={()=>{if(window.confirm("¿Seguro? Se borrará todo el progreso.")){localStorage.removeItem("juampe-v2");window.location.reload();}}} outline color={T.red}>Borrar todo el progreso</Btn>
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ──
export default function App() {
  const [view, setView] = useState("loading");
  const [activeModId, setActiveModId] = useState(null);
  const [exIdx, setExIdx] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [sessionResults, setSessionResults] = useState([]);
  const [progress, setProgress] = useState({});
  const [apiKey, setApiKey] = useState("");

  useEffect(()=>{
    const p=loadProgress();
    const k=loadApiKey();
    const hasVisited=localStorage.getItem("juampe-visited");
    setProgress(p);
    setApiKey(k);
    setView(hasVisited?"home":"setup");
  },[]);

  useEffect(()=>{
    if(view!=="loading") saveProgress(progress);
  },[progress]);

  const mod=MODULES.find(m=>m.id===activeModId);
  const exercises=mod?.exercises||[];
  const ex=exercises[exIdx];
  const nonInfoTotal=exercises.filter(e=>e.type!=="info"&&e.type!=="conversation").length;
  const isLast=exIdx===exercises.length-1;

  function startModule(id){setActiveModId(id);setExIdx(0);setInput("");setChecked(false);setIsCorrect(false);setSessionResults([]);setView("exercise");}
  function checkAnswer(){if(!ex)return;let c=false;if(ex.type==="multiple_choice")c=input===ex.answer;if(ex.type==="fill_blank")c=input.trim().toLowerCase()===ex.answer.toLowerCase();setIsCorrect(c);setChecked(true);if(!["info","conversation"].includes(ex.type))setSessionResults(r=>[...r,c]);}
  function handleSelfAssess(val){setIsCorrect(val);setChecked(true);if(!["info","conversation"].includes(ex.type))setSessionResults(r=>[...r,val]);}
  function next(){if(isLast){const score=sessionResults.filter(Boolean).length;setProgress(p=>({...p,[activeModId]:{score,total:nonInfoTotal,completed:true}}));setView("results");}else{setExIdx(i=>i+1);setInput("");setChecked(false);setIsCorrect(false);}}

  if(view==="loading") return <div style={{...sans,background:T.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{textAlign:"center"}}><div style={{fontSize:48,marginBottom:12}}>🇫🇷</div><p style={{color:T.muted,margin:0}}>Cargando…</p></div></div>;
  if(view==="setup") return <SetupView onSave={()=>{localStorage.setItem("juampe-visited","1");setApiKey(loadApiKey());setView("home");}}/>;
  if(view==="settings") return <SettingsView onBack={()=>setView("home")}/>;
  if(view==="home") return <HomeView progress={progress} onStart={startModule} onSettings={()=>setView("settings")}/>;
  if(view==="exercise") return <ExerciseView key={exIdx} mod={mod} ex={ex} exIdx={exIdx} total={exercises.length} input={input} setInput={setInput} checked={checked} isCorrect={isCorrect} onCheck={checkAnswer} onSelfAssess={handleSelfAssess} onNext={next} isLast={isLast} onHome={()=>setView("home")} apiKey={apiKey}/>;
  if(view==="results") return <ResultsView mod={mod} score={progress[activeModId]?.score||0} total={nonInfoTotal} onHome={()=>setView("home")} onRetry={()=>startModule(activeModId)}/>;
}
