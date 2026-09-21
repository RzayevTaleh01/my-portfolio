import type { ContentOverrides } from "../types";

export const core: ContentOverrides = {
  profile: {
    headline: "Softvérový inžinier · Výskumník v oblasti AI",
    intro:
      "Mám 4 roky frontendových skúseností s vývojom produkčných webových aplikácií v Reacte a Next.js a praktické skúsenosti s backendom - REST API, databázy a nasadzovanie. Popri softvérovom inžinierstve sa venujem výskumu AI. Mojou hlavnou oblasťou záujmu je NLP pre jazyky s malým množstvom dát: turkická jazyková rodina, napríklad azerbajdžančina, a západoslovanská skupina, napríklad slovenčina a čeština.",
    bio: [
      "Začínal som v roku 2022 ako frontendový stážista v AzInTelecom, kde som vytváral klientske a administrátorské rozhrania systému Sima Reporting System. V rokoch 2023 – 2026 som bol v spoločnosti Edumedia-Azerbaijan, kde som prešiel od juniora po middle vývojára na národných vzdelávacích platformách Azerbajdžanu - vrátane platformy Digitálna škola ministerstva a novej verzie Video.edu.az postavenej na Next.js. Od roku 2026 pracujem ako full-stack vývojár v ITM - Information Technology Center.",
      "Okrem frontendu navrhujem celé systémy. Pre Diaspor.org som od začiatku do konca postavil multi-tenant publikačnú platformu: Spring Boot REST API, administráciu v Reacte, verejný web v Next.js so serverovým renderovaním, PostgreSQL s verzovanými migráciami a S3 pre médiá. V ITM pracujem aj v PHP a Laraveli - na platforme akademického časopisu postavenej na OJS a na prepise portálu verejného zdravotníckeho inštitútu.",
      "Profesionálne som softvérový inžinier. Výskum je to, čomu sa venujem vo vlastnom čase, ako nadšenec: čítam články, reprodukujem, čo sa dá, a učím sa písať vlastný výskum. Mojím smerom je NLP pre jazyky s malým množstvom dát - turkická jazyková rodina, napríklad azerbajdžančina, a západoslovanská skupina, napríklad slovenčina a čeština. Adaptívne učenie je miesto, kde som začal, a vzišli z neho EduVision a LangVis, ale ťažisko sa presunulo na samotný jazyk.",
      "Pripravujem sa na ďalší krok: doktorandské štúdium v tejto oblasti a akademickú dráhu postavenú na publikovanej práci popri tej inžinierskej.",
      "Pri každodennej práci používam AI na zrýchlenie vývoja a k prompt engineeringu pristupujem ako programátor. Teraz žijem na Slovensku a študujem Priemyselný manažment na Technickej univerzite v Košiciach.",
    ],
    highlights: ["4 roky frontend skúseností", "Backend: Node.js · Spring Boot", "NLP · jazyky s malým množstvom dát", "Angličtina B2 · Slovenčina A2"],
    socials: [{}, {}, {}, {}, { label: "E-mail" }],
  },
  experience: [
    {
      location: "Baku, Azerbajdžan · Na diaľku",
      period: "05/2026 - súčasnosť",
      roles: [
        {
          title: "Full-Stack vývojár",
          period: "05/2026 - súčasnosť",
          summary: "Full-stack práca na webových platformách centra.",
          projects: [
            { detail: "Multi-tenant publikačná platforma, postavená od začiatku do konca." },
            { detail: "Platforma na OJS s frontom v Laraveli, DOI a indexovanie v Google Scholar." },
            { detail: "Prepis verejného portálu v Laraveli." },
          ],
        },
      ],
    },
    {
      location: "Baku, Azerbajdžan · Na pracovisku",
      roles: [
        {
          title: "Frontend vývojár (Middle)",
          summary: "Národné platformy pre ministerstvo vedy a školstva a ministerstvo zahraničných vecí.",
          projects: [
            {
              name: "Digitálna škola (Digital.edu.az)",
              detail:
                "Národná školská platforma ministerstva: jeden portál pre učiteľov, riaditeľov, žiakov a rodičov. Náš najväčší a najnáročnejší systém.",
              points: [
                "Viac ako 10 jej služieb som postavil od nuly.",
                "AI asistent učenia - hoci som frontendový vývojár, prizvali ma do tímu, ktorý postavil chatbota pre žiakov na lokálnom generatívnom modeli trénovanom na materiáloch ministerstva. Spustený v júni 2026.",
              ],
            },
            { detail: "Presunutý zo starého systému a postavený nanovo v Next.js." },
            { detail: "Oficiálny web ministerstva zahraničných vecí - podpora." },
            { detail: "Interný systém ministerstva na apostilu a legalizáciu, postavený od nuly." },
          ],
        },
        {
          title: "Frontend vývojár (Junior)",
          summary: "Národné vzdelávacie platformy pre ministerstvo vedy a školstva.",
          projects: [
            {
              detail: "Interný systém pre odborné školy.",
              points: ["Vyše 10 služieb postavených alebo prepracovaných - online diplomy, individuálne študijné plány, prestupy študentov."],
            },
            { detail: "Žiadosti o štúdium v zahraničí v rámci programov HTP a DP." },
            { detail: "Frontend napísaný od nuly." },
            { detail: "Vzdelávacie centrum pre učiteľov - postavil som frontend." },
            { detail: "Oficiálny web Karabašskej univerzity." },
            { detail: "Detská STEM akadémia - postavil som web." },
            { detail: "Oficiálny web ministerstva - podpora." },
            { detail: "Platforma ministerstva na prieskumy - podpora." },
            { detail: "Produktový web online pokladníc - podpora." },
          ],
        },
      ],
    },
    {
      location: "Baku, Azerbajdžan · Na pracovisku",
      roles: [
        {
          title: "Frontend vývojár (stážista)",
          summary: "Sima Reporting System - klientske a administrátorské rozhrania.",
          highlights: ["Ukončil som ju s certifikátom s vyznamenaním."],
          credential: { label: "Certifikát s vyznamenaním" },
        },
      ],
    },
  ],
  volunteering: [
    {
      organization: "Azerbajdžanská štátna univerzita ropy a priemyslu - IT oddelenie",
      role: "Full-Stack vývojár (dobrovoľnícky)",
      location: "Baku, Azerbajdžan · Na pracovisku",
      summary: "Interný systém pre fakultu informatiky - študenti, vyučujúci a ich záznamy.",
      highlights: [
        "Pridal som sa v treťom ročníku; rok v IT oddelení ako full-stack vývojár.",
        "Jeden z piatich študentov vybraných z fakulty.",
        "Moja prvá pracovná skúsenosť.",
      ],
    },
    {
      role: "Frontendové programovanie - jednosemestrálny kurz",
      location: "Baku, Azerbajdžan",
      summary: "Semestrálny frontendový program, do ktorého sa vstupovalo cez skúšku.",
      highlights: [
        "Kódovacia škola pôsobiaca v Azerbajdžane spolu s ministerstvom školstva a univerzitou ADNSU.",
        "Prijímacia skúška - program dostalo prvých 25 študentov fakulty.",
        "Oslobodil ma od troch z piatich predmetov v tom semestri.",
        "Ukončil som ho so ziskom 100/100; certifikáty odovzdalo ministerstvo školstva a Algorithmics.",
      ],
      credential: { label: "Certifikát" },
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
    {},
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
    "Profesiou softvérový inžinier, ktorý sa čítaním a stavaním prepracúva k výskumu. Smerom je NLP pre jazyky s malým množstvom dát - turkická jazyková rodina, napríklad azerbajdžančina, a západoslovanská skupina, napríklad slovenčina a čeština - a táto stránka je miestom, kde sa tá práca zbiera, kým sa pripravujem na doktorandské štúdium.",
  researchDirections: [
    {
      title: "NLP pre azerbajdžančinu",
      description:
        "Aglutinačný jazyk s malým množstvom anotovaných dát. Chcem pochopiť, ako ďaleko dokáže jazyk doniesť tokenizácia a modelovanie citlivé na morfológiu, než sa stenou stane veľkosť korpusu.",
      methods: ["Morfologická segmentácia", "Budovanie korpusu", "Prenos z jazykov s množstvom dát"],
    },
    {
      title: "Prenos v rámci turkickej rodiny",
      description:
        "Turečtina dáta má; azerbajdžančina, turkménčina a ostatné oveľa menej. Rodina zdieľa štruktúru, takže otázkou je, koľko sa prenesie z bohatšieho súrodenca a kde to potichu prestane fungovať.",
      methods: ["Viacjazyčné predtrénovanie", "Zdieľané subword slovníky", "Zero-shot hodnotenie"],
    },
    {
      title: "Čeština a slovenčina",
      description:
        "Dva blízke, morfologicky bohaté jazyky, medzi ktorými žijem. Sú prirodzeným testovacím prostredím pre medzijazykovú prácu: takmer zhodná štruktúra, oddelené dáta, oddelené komunity.",
      methods: ["Medzijazykové zarovnanie", "Bohatá morfológia", "Doladenie pri málo dátach"],
    },
    {
      title: "Adaptívne vzdelávacie systémy",
      description:
        "Miesto, kde som začal, a stále jedna z línií: modelovať, čo študent vie, rozhodnúť, čo ho naučiť ďalej, a vysvetliť to jazykom opretým o učebný materiál.",
      methods: ["Bayesovské sledovanie znalostí (BKT)", "PPO", "Retrieval-augmented generation"],
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
