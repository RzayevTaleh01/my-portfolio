import type { ContentOverrides } from "../types";

export const core: ContentOverrides = {
  profile: {
    headline: "Softvérový inžinier · Výskumník v oblasti AI",
    intro:
      "Mám 4 roky frontendových skúseností s vývojom produkčných webových aplikácií v Reacte a Next.js a praktické skúsenosti s backendom - REST API, databázy a nasadzovanie. Ako výskumník v oblasti AI vytváram adaptívne vzdelávacie systémy: sledovanie znalostí, posilňované učenie a LLM tútorov opretých o zdroje.",
    bio: [
      "Začínal som v roku 2022 ako frontendový stážista v AzInTelecom, kde som vytváral klientske a administrátorské rozhrania systému Sima Reporting System. V rokoch 2023 – 2026 som v spoločnosti Edumedia-Azerbaijan pracoval na národných vzdelávacích platformách - vrátane novej verzie Video.edu.az postavenej na Next.js a nových služieb pre Portal.edu.az a Pts.edu.az.",
      "Okrem frontendu navrhujem celé systémy. Pre Diaspor.org som od začiatku do konca postavil multi-tenant publikačnú platformu: Spring Boot REST API, administráciu v Reacte, verejný web v Next.js so serverovým renderovaním, PostgreSQL s verzovanými migráciami a S3 pre médiá.",
      "Môj výskum sa venuje AI vo vzdelávaní: modelovaniu toho, čo študent vie, rozhodovaniu, čo ho naučiť ďalej, a vysvetľovaniu v prirodzenom jazyku opretom o učebný materiál. EduVision, môj adaptívny tútorský systém, kombinuje bayesovské sledovanie znalostí (BKT), agenta posilňovaného učenia PPO a LLM s vyhľadávaním v zdrojoch (RAG); LangVis je hlasový tútor na nácvik rozprávania v reálnom čase.",
      "Pri každodennej práci používam AI na zrýchlenie vývoja a k prompt engineeringu pristupujem ako programátor. Teraz žijem na Slovensku a študujem Priemyselný manažment na Technickej univerzite v Košiciach.",
    ],
    highlights: ["4 roky frontend skúseností", "Backend: Node.js · Spring Boot", "Výskum AI · adaptívne učenie", "Angličtina B2 · Slovenčina A2"],
    socials: [{}, {}, {}, { label: "E-mail" }],
  },
  experience: [
    {
      role: "Full-Stack vývojár",
      period: "05/2026 - súčasnosť",
      location: "Baku, Azerbajdžan · Na diaľku",
      summary:
        "Full-stack vývoj webových platforiem centra - multi-tenant publikačná platforma, systém pre akademický časopis a portál verejného zdravotníckeho inštitútu.",
      highlights: [
        "Diaspor.org - multi-tenant publikačnú platformu som navrhol od začiatku do konca: Spring Boot REST API, administrácia v Reacte, verejný web v Next.js (SSR), PostgreSQL s verzovanými migráciami, S3 pre médiá a prístup na základe rolí.",
        "UNEC Student Research Journal - platforma akademického časopisu na OJS s frontom v Laraveli: workflow podania, recenzného konania a produkcie pre zhruba dvadsať fakúlt, registrácia DOI a indexovanie v Google Scholar.",
        "Institute of Lung Diseases (etacxi.az) - verejný portál prepisujem od nuly v Laraveli a natvrdo zapísané stránky presúvam do editovateľného dvojjazyčného obsahového modelu s administráciou.",
      ],
    },
    {
      role: "Frontend vývojár (Strong Junior)",
      location: "Baku, Azerbajdžan · Na pracovisku",
      summary: "Frontendový vývoj národných vzdelávacích webových platforiem Azerbajdžanu.",
      highlights: [
        "Video.edu.az - nová verzia postavená na Next.js.",
        "Portal.edu.az a Pts.edu.az - nové služby a priebežná podpora.",
        "Digital.edu.az, Karabakh.edu.az, Ict.edu.az, Ite.az, MarsAcademy.az; podpora pre Edu.gov.az.",
      ],
    },
    {
      role: "Frontend vývojár (stážista)",
      location: "Baku, Azerbajdžan · Na pracovisku",
      summary: "Sima Reporting System - klientske a administrátorské rozhrania.",
      highlights: ["Stáž som ukončil s certifikátom s vyznamenaním."],
    },
  ],
  education: [
    {
      degree: "Bakalár",
      field: "Priemyselný manažment",
      institution: "Technická univerzita v Košiciach",
      location: "Košice, Slovensko",
      period: "09/2026 - súčasnosť",
    },
    {
      degree: "Bakalár",
      field: "Informačné technológie",
      institution: "Azerbajdžanská štátna univerzita ropy a priemyslu",
      location: "Baku, Azerbajdžan",
    },
  ],
  educationIntl: [
    {
      degree: "Magister",
      field: "Systémové programovanie",
      institution: "Azerbajdžanská technická univerzita",
      location: "Baku, Azerbajdžan",
    },
    {
      degree: "Bakalár",
      field: "Informačné technológie",
      institution: "Azerbajdžanská štátna univerzita ropy a priemyslu",
      location: "Baku, Azerbajdžan",
    },
  ],
  certificates: [
    { title: "Frontend vývojár - certifikát s vyznamenaním (stáž)" },
    {},
    { title: "Problem Solving (Basic), React (Basic), JavaScript (Basic a Intermediate)" },
  ],
  languages: [
    { name: "Angličtina", level: "Vyššia stredná úroveň (B2)" },
    { name: "Slovenčina", level: "A2" },
  ],
  skills: [
    { title: "Frontend" },
    { title: "Stav a dáta" },
    { title: "UI a dizajn" },
    { title: "Backend a databázy" },
    { title: "DevOps a nástroje" },
    { title: "Umelá inteligencia" },
  ],
  researchStatement:
    "Skúmam adaptívne vzdelávanie poháňané umelou inteligenciou: ako môže systém modelovať, čo študent vie, rozhodnúť, čo ho naučiť ďalej, a vysvetliť to v prirodzenom jazyku, ktorý sa opiera o učebný materiál.",
  researchDirections: [
    {
      title: "Modelovanie študenta",
      description:
        "Odhad toho, čo študent vie, z nepresných odpovedí - aby sa systém mohol prispôsobiť bez toho, aby sa študent musel sám hodnotiť.",
      methods: ["Bayesovské sledovanie znalostí (BKT)", "Rozložené opakovanie", "Taxonómia chýb"],
    },
    {
      title: "Posilňované učenie pre pedagogiku",
      description:
        "Učenie stratégie, ktorá udrží každého študenta v stave flow - dosť náročné na rast, dosť ľahké, aby to nevzdal.",
      methods: ["PPO", "Návrh odmeny", "A/B hodnotenie"],
    },
    {
      title: "Konverzační tútori opretí o zdroje",
      description: "LLM tútori, ktorí dodržiavajú pedagogickú stratégiu a zostávajú fakticky presní vďaka vyhľadávaniu v učebnom materiáli.",
      methods: ["Retrieval-augmented generation", "Neuro-symbolické riadenie", "Reč v reálnom čase"],
    },
  ],
  archive: [
    { description: "Kvízová aplikácia s dynamickou architektúrou otázok a ukladaním do localStorage." },
    { description: "Preklad stránky na strane klienta s čistým kódom bez závislostí." },
    { description: "Full-stack platforma na zdieľanie fotografií s backendom v Node.js a Express." },
    { description: "Správca úloh s Context API, tmavým režimom a localStorage." },
    { description: "Rozhranie pracovnej burzy s filtrovaním a localStorage." },
    { description: "Autentifikácia pomocou JSON Web Tokenov v Next.js." },
    { description: "Služba v Spring Boot s validáciou, spracovaním výnimiek a vlastnými aliasmi." },
    { description: "Systém riadenia ľudských zdrojov s overením e-mailu - backend v Spring Boot a frontend v Reacte." },
  ],
};
