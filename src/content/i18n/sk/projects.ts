import type { ContentOverrides } from "../types";

type Projects = NonNullable<ContentOverrides["projects"]>;

export const projects: Projects = {
  diaspor: {
    tagline: "Multi-tenant publikačná platforma: vlastný spravodajský web pre každú organizáciu diaspóry a jeden národný kanál.",
    facts: [
      { label: "Rola", value: "Full-stack · ITM" },
      { label: "Obdobie", value: "05/2026 - súčasnosť" },
      { label: "Tenanti", value: "Subdoména pre každú organizáciu" },
      { label: "Jadro", value: "Spring Boot · Next.js" },
    ],
    overview: [
      "Diaspor.org dáva každej organizácii diaspóry vlastný spravodajský web na subdoméne s jej značkou, zatiaľ čo hlavný portál zhromažďuje ich schválené správy do jedného národného kanála.",
      "Celý systém som navrhol a postavil od začiatku do konca: API, administráciu, verejné weby, databázu aj úložisko médií.",
    ],
    problem: [
      "Mnohé malé organizácie potrebujú profesionálny spravodajský web, no samostatný web pre každú z nich je drahý a rozdrobuje obsah. Platforma musí dať každej organizácii vlastnú identitu a pritom zdieľať jednu kódovú základňu, jednu databázu a jeden redakčný proces.",
    ],
    architecture: {
      summary:
        "Jedno Spring Boot API obsluhuje dva frontendy: administráciu v Reacte, kde organizácie spravujú obsah, a web v Next.js so serverovým renderovaním, ktorý vykresľuje subdoménu každej organizácie aj národný portál.",
      layers: [
        {
          name: "Publikum",
          nodes: [
            { name: "Weby organizácií", detail: "Subdoména so značkou pre každú" },
            { name: "Národný portál", detail: "Zhromaždený kanál" },
            { name: "Redaktori a admini", detail: "Správa obsahu" },
          ],
        },
        {
          name: "Frontend",
          nodes: [
            { name: "Verejný web v Next.js", detail: "SSR · SEO" },
            { name: "Administrácia v Reacte", detail: "TypeScript" },
          ],
        },
        {
          name: "API",
          nodes: [
            { detail: "Java" },
            { name: "Prístup podľa rolí", detail: "Oprávnenia podľa roly" },
            { name: "Schvaľovanie", detail: "Brána do národného kanála" },
          ],
        },
        {
          name: "Dáta a infraštruktúra",
          nodes: [{ detail: "Verzované migrácie" }, { detail: "Úložisko médií" }, { detail: "Backend v kontajneri" }],
        },
      ],
    },
    components: [
      {
        name: "Verejný web",
        role: "Všetky organizácie, jedna aplikácia",
        points: [
          "Jedna aplikácia v Next.js vykresľuje web každej organizácie na jej subdoméne.",
          "Serverové renderovanie robí stránky so správami rýchlymi a indexovateľnými vyhľadávačmi.",
        ],
      },
      {
        name: "Administrácia",
        role: "Kde sa spravuje obsah",
        points: ["Panel v Reacte a TypeScripte na tvorbu a správu správ s prístupom riadeným podľa roly."],
      },
      {
        name: "REST API",
        role: "Jediný zdroj pravdy",
        points: ["Spring Boot API zdieľané oboma frontendmi.", "Riadenie prístupu podľa rolí a krok schválenia pred zverejnením v národnom kanáli."],
      },
      {
        name: "Úložisko",
        role: "Dáta a médiá",
        points: ["Schéma PostgreSQL sa vyvíja cez verzované migrácie.", "Obrázky a médiá sú uložené v S3, nie v databáze."],
      },
    ],
    flow: [
      { title: "Napísať", detail: "Redaktor organizácie vytvorí správu v administrácii." },
      { title: "Uložiť", detail: "API uloží správu do PostgreSQL a nahrá médiá do S3." },
      { title: "Zverejniť", detail: "Správa sa objaví na vlastnej subdoméne organizácie." },
      { title: "Schváliť", detail: "Schválené správy sa zhromaždia do národného kanála na hlavnom portáli." },
    ],
    decisions: [
      {
        title: "Multi-tenant, nie viac nasadení",
        detail: "Jedna kódová základňa a jedna databáza obsluhujú všetky organizácie - nová organizácia sú len dáta, nie nové nasadenie.",
      },
      {
        title: "SSR pre verejné stránky",
        detail: "Správy čítajú vyhľadávače a zdieľajú sa na sociálnych sieťach, preto sa stránky renderujú na serveri.",
      },
      {
        title: "Verzované migrácie",
        detail: "Každá zmena schémy je skontrolovaná, opakovateľná migrácia, takže prostredia sa nikdy nerozídu.",
      },
      {
        title: "Médiá mimo databázy",
        detail: "S3 udržiava databázu malú a backendové kontajnery bezstavové a ľahko znovu nasaditeľné.",
      },
    ],
    stack: [{}, {}, { group: "Dáta a infraštruktúra" }],
  },

  eduvision: {
    tagline: "Adaptívny inteligentný tútorský systém s neuro-symbolickou architektúrou.",
    facts: [{ label: "Moduly", value: "5 + RL agent" }, {}, { label: "Model študenta" }, { label: "Stratégia" }],
    overview: [
      "EduVision simuluje individuálne doučovanie. Modeluje, čo každý študent vie, rozhoduje, čo ho naučiť ďalej, vysvetľuje to v prirodzenom jazyku a hodnotí odpoveď - potom aktualizuje model študenta a cyklus sa opakuje.",
      "Namiesto obalenia jazykového modelu systém oddeľuje rozhodnutia od jazyka: o tom, čo sa pedagogicky stane, rozhodujú pravdepodobnostné a naučené komponenty a LLM len premení toto rozhodnutie na dialóg.",
    ],
    problem: [
      "LLM chatboty odpovedajú na otázky, ale neučia: nemajú trvalý model študenta, nepoznajú náročnosť a môžu tvrdiť veci, ktoré v učebnom materiáli nie sú.",
      "Tútor potrebuje pamäť (čo tento študent vie?), stratégiu (čo má nasledovať?) a oporu v zdrojoch (je vysvetlenie pre tento kurz správne?).",
    ],
    architecture: {
      summary:
        "Päť nezávislých modulov komunikuje cez pedagogický modul, ktorý slúži ako rozhodovacie centrum. Agent posilňovaného učenia ladí náročnosť a platformové služby riešia experimenty, vysvetliteľnosť a náklady.",
      layers: [
        {
          name: "Klienti",
          nodes: [
            { name: "Študent", detail: "Adaptívny chat a odpovede" },
            { name: "Učiteľ", detail: "Lekcie, PDF a hodnotiace kritériá" },
            { name: "Používatelia API" },
          ],
        },
        { name: "API", nodes: [{ detail: "Kurzy, relácie, chat, stav študenta" }, { name: "Autentifikácia" }] },
        {
          name: "Moduly",
          nodes: [
            { name: "Tútor", detail: "Dialóg a persona" },
            { name: "Pedagogika", detail: "Stratégia + PPO agent" },
            { name: "Študent", detail: "Zvládnutie cez BKT a SRS" },
            { name: "Hodnotenie", detail: "Kritériá a kontrola kódu" },
            { name: "Znalosti", detail: "RAG + graf pojmov" },
          ],
        },
        {
          name: "Platforma",
          nodes: [
            { name: "Pluginy", detail: "Obsah pre konkrétnu doménu" },
            { name: "Experimenty", detail: "A/B testy · bandit optimalizátor" },
            { name: "Vysvetliteľnosť", detail: "Prečo bolo toto zvolené?" },
            { name: "Runtime", detail: "Kontrola nákladov · limity · metriky" },
          ],
        },
        {
          name: "Modely a dáta",
          nodes: [{ detail: "cez Together AI" }, { detail: "Vektorové reprezentácie viet" }, {}, { name: "PPO stratégia" }],
        },
      ],
    },
    components: [
      {
        name: "Znalostný modul",
        role: "Dlhodobá pamäť kurzu",
        points: [
          "Načítava PDF a texty, delí ich na úseky s ~512 tokenmi a pre každý úsek vytvára embedding.",
          "Vektory ukladá do PostgreSQL s pgvector a vzťahy medzi pojmami do grafu NetworkX.",
          "Tútorovi poskytuje top-k kontext, aby vysvetlenia vychádzali z učebného materiálu.",
        ],
      },
      {
        name: "Modul študenta",
        role: "Pravdepodobnostný model študenta",
        points: [
          "Sleduje pravdepodobnosť zvládnutia každej zručnosti pomocou bayesovského sledovania znalostí.",
          "Plánuje opakovanie metódou rozloženého opakovania skôr, než sa zručnosť zabudne.",
          "Triedi chyby podľa taxonómie, aby zvolil vhodnú nápravu.",
        ],
      },
      {
        name: "Pedagogický modul",
        role: "Rozhoduje, čo a ako učiť",
        points: [
          "Spája stav študenta a nájdený kontext do výučbovej stratégie (sokratovské otázky, scaffolding, Feynmanova metóda).",
          "Náročnosť deleguje na PPO agenta, ktorý sleduje zvládnutie, presnosť, čas odpovede, únavu a aktuálnu náročnosť.",
        ],
      },
      {
        name: "Tútorský modul",
        role: "Premieňa stratégiu na dialóg",
        points: [
          "Generuje vysvetlenia, nápovedy a otázky pomocou Llama 3.1 8B Instruct Turbo.",
          "Vystupuje ako vzdelávací sprievodca, obmedzený stratégiou zvolenou pedagogickým modulom.",
          "Prístup k LLM ide cez rozhranie poskytovateľa, takže dodávateľa modelu možno vymeniť.",
        ],
      },
      {
        name: "Hodnotiaci modul",
        role: "Hodnotí a dáva spätnú väzbu",
        points: [
          "AST analýza pre kód, sémantická podobnosť pre text a hodnotenie pomocou LLM podľa kritérií učiteľa.",
          "Výsledok vracia do modulu študenta a uzatvára tak cyklus.",
        ],
      },
    ],
    flow: [
      { title: "Načítanie", detail: "Učiteľ nahrá materiál; znalostný modul ho rozdelí, vytvorí embeddingy a prepojí." },
      { title: "Začiatok relácie", detail: "Modul študenta načíta profil zvládnutia; pedagogický modul vyberie prvú tému." },
      { title: "Výučba", detail: "Tútorský modul predstaví tému zvoleným štýlom s oporou v nájdených úsekoch." },
      { title: "Hodnotenie", detail: "Študent odpovie; hodnotiaci modul odpoveď vyhodnotí a vráti spätnú väzbu." },
      { title: "Prispôsobenie", detail: "BKT aktualizuje zvládnutie; PPO agent zvýši, ponechá alebo zníži náročnosť; cyklus sa opakuje." },
    ],
    deepDives: [
      {
        title: "Bayesovské sledovanie znalostí (BKT)",
        body: [
          "Zvládnutie je skrytá premenná. Každá odpoveď je dôkaz, vážený pravdepodobnosťou uhádnutia bez vedomostí (G) a chyby napriek vedomostiam (S). Po výpočte aposteriórnej pravdepodobnosti model zohľadní aj učenie počas pokusu (T).",
        ],
      },
      {
        title: "Náročnosť ako úloha posilňovaného učenia",
        body: [
          "Agent sleduje 5-rozmerný stav - zvládnutie, správnosť poslednej odpovede, normalizovaný čas odpovede, index únavy a aktuálnu náročnosť - a volí jednu z troch akcií: znížiť, ponechať alebo zvýšiť náročnosť.",
          "Odmena vyvažuje prírastok vedomostí, zotrvanie v stave flow a únavu z relácie. Malý diskrétny priestor akcií udržiava stratégiu stabilnú a ľahko vysvetliteľnú.",
        ],
      },
      {
        title: "Odpovede opreté o vyhľadávanie",
        body: [
          "Každá otázka sa prevedie na embedding a porovná s úsekmi kurzu pomocou kosínusovej podobnosti. Najrelevantnejšie úseky sa vložia do systémového promptu tútora ako kontext - model tak vysvetľuje kurz, nie internet.",
        ],
      },
    ],
    decisions: [
      {
        title: "Neuro-symbolický prístup namiesto obalu LLM",
        detail: "Pedagogické rozhodnutia robia interpretovateľné modely a LLM len generuje jazyk. Každé rozhodnutie sa dá dohľadať a vysvetliť.",
      },
      {
        title: "BKT namiesto hlbokého sledovania znalostí",
        detail: "Štyri interpretovateľné parametre na zručnosť, lacná aktualizácia po každej odpovedi a rozumné správanie aj pri veľmi malom množstve dát o študentovi.",
      },
      {
        title: "pgvector priamo v PostgreSQL",
        detail: "Vektory, stav študenta a dáta kurzu sú v jednom transakčnom úložisku - netreba prevádzkovať samostatnú vektorovú databázu.",
      },
      {
        title: "Zabudované hodnotenie",
        detail: "Moduly A/B experimentov a bandit porovnávajú RL stratégiu so statickým postupom náročnosti podľa prírastku vedomostí, zapojenia a odchodovosti.",
      },
    ],
    stack: [{ group: "Umelá inteligencia" }, {}, { group: "Dáta" }, { group: "Prevádzka a dokumentácia" }],
    next: [
      "Hlasový a obrazový vstup (Whisper, vision) pre multimodálne doučovanie.",
      "Analytický panel pre učiteľov s mapami zvládnutia v reálnom čase.",
      "Optimalizácia stratégie na dlhodobé zapamätanie namiesto odmeny za reláciu.",
    ],
  },

  langvis: {
    tagline: "Hlasový jazykový tútor v reálnom čase, ktorý opraví každú vetu a posunie študenta z A2 na B2.",
    facts: [
      { label: "Kurz", value: "24 lekcií · A2→B2" },
      { label: "Sledované zručnosti" },
      { label: "Vyučovacie metódy" },
      { label: "Zvuk", value: "16 kHz vstup · 24 kHz výstup" },
    ],
    overview: [
      "LangVis je desktopový kurz rozprávania. Študent hovorí; tútor počúva, opraví vetu, požiada o zopakovanie a ponúkne silnejší spôsob, ako to povedať. Pamätá si chyby a opakované premení na krátke cvičenia.",
      "Zámerne nie je asistentom: má jedinú úlohu - pomôcť študentovi hovoriť lepšie - a každá časť architektúry slúži tomuto cyklu.",
    ],
    problem: [
      "Nácvik rozprávania potrebuje okamžitú konverzáciu bez oneskorenia, ale dobrá oprava vyžaduje dôkladnú analýzu každej vety. Robiť oboje jedným volaním modelu buď spomalí rozhovor, alebo spraví spätnú väzbu povrchnou.",
    ],
    architecture: {
      summary:
        "Dve cesty modelov bežia vedľa seba: živá zvuková relácia udržiava plynulý rozhovor a malý rýchly model na pozadí analyzuje každú vetu a aktualizuje model študenta, ktorý formuje ďalší prompt.",
      layers: [
        {
          name: "Rozhranie",
          nodes: [
            { name: "Osnova", detail: "Etapy, lekcie, pravidlá" },
            { name: "Koučing", detail: "Opravy, tipy, vylepšenia" },
            { name: "Slovník", detail: "Slová o úroveň vyššie" },
            { name: "Tvár tútora", detail: "Kreslená podľa hlasitosti zvuku" },
          ],
        },
        {
          name: "Živá relácia",
          nodes: [
            { name: "Zvukový vstup/výstup", detail: "Prúdy mikrofónu a reproduktora" },
            { detail: "Obojsmerný hlas v reálnom čase" },
            { name: "Opätovné pripojenie", detail: "Obnovenie relácie" },
          ],
        },
        {
          name: "Doména tútora",
          nodes: [
            { name: "Jazykový tútor", detail: "pozorovať → merať → učiť" },
            { name: "Analýza", detail: "Pre každú vetu, mimo hlavnej cesty" },
            { name: "Osnovy", detail: "Zručnosti, lekcie, metódy" },
            { name: "Pokrok", detail: "Úroveň, zručnosti, slovná zásoba" },
          ],
        },
        {
          name: "Jadro",
          nodes: [
            { name: "Načítanie pluginov", detail: "Nástroje, pozorovatelia, bloky promptu" },
            { name: "Aktivačné slovo", detail: "Voliteľné, úplne offline" },
            { name: "Vlastný log", detail: "Vlastný výstup a chyby" },
          ],
        },
        {
          name: "Lokálne úložisko",
          nodes: [{ detail: "Zdroj pravdy" }, { detail: "Čitateľný, generovaný znova" }, { detail: "Nastavenia a API kľúč" }],
        },
      ],
    },
    components: [
      {
        name: "Živá relácia",
        role: "Rozhovor bez čakania",
        points: [
          "Posiela 16 kHz zvuk z mikrofónu do Gemini Live API a prehráva 24 kHz odpovede.",
          "Správy GoAway zo servera a zmeny nastavení rieši riadeným opätovným pripojením, ktoré môže kontext rozhovoru ponechať alebo zahodiť.",
        ],
      },
      {
        name: "Analýza viet",
        role: "Meria každý výrok",
        points: [
          "Ľahký model vráti pre každú vetu štruktúrovaný JSON: chyby, opravený tvar, značky zručností, dôkazy pre CEFR.",
          "Beží na pozadí, takže živý model naň nikdy nečaká.",
          "Lokálne kontroly na úrovni slov odpovedajú na lacné otázky (bolo toto slovo použité?) bez volania modelu.",
        ],
      },
      {
        name: "Osnovy a pokrok",
        role: "Čo učiť ďalej",
        points: [
          "6 etáp × 4 lekcie s cieľovými tvarmi, vzorovými vetami a pomenovanými vyučovacími metódami.",
          "~40 gramatických zručností, každá so zvládnutím, skutočnými chybami a dátumom opakovania.",
          "Tri najslabšie zručnosti sa stanú zameraním, ktoré sa vloží do promptu ďalšej relácie.",
        ],
      },
      {
        name: "Systém pluginov",
        role: "Rozšíriteľný bez zásahu do jadra",
        points: [
          "Každý súbor v plugins/ so slovníkom PLUGIN a funkciou run() sa stane nástrojom, ktorý môže tútor zavolať.",
          "Voliteľné hooky umožňujú pluginu sledovať každú vetu, pridať trvalé inštrukcie do promptu alebo sa zobraziť v rozhraní.",
        ],
      },
    ],
    flow: [
      { title: "Hovoriť", detail: "Zvuk prúdi do živého modelu; tútor najprv opraví a potom pokračuje." },
      { title: "Analyzovať", detail: "Prepis ide do analyzátora na pozadí, ktorý označí chyby a zručnosti." },
      { title: "Aktualizovať", detail: "Úroveň, zvládnutie zručností a slovná zásoba sa zapíšu do level.json; progress.md sa vygeneruje znova." },
      { title: "Prispôsobiť", detail: "Tá istá chyba trikrát spustí cvičenie; najslabšie zručnosti formujú ďalší prompt." },
      { title: "Postupovať", detail: "Keď sú cieľové tvary zvládnuté, ďalšia lekcia začne bez reštartu relácie." },
    ],
    deepDives: [
      {
        title: "Dva modely, dve rýchlosti",
        body: [
          "Živý model je optimalizovaný na nízke oneskorenie, analytický na štruktúru a náklady. Ich oddelenie udrží rozhovor prirodzený a každá veta pritom prejde úplnou gramatickou kontrolou.",
          "Výsledky sa vracajú cez hook pluginu format_for_prompt(), takže tútor v ďalšej odpovedi vie, na čo sa zamerať.",
        ],
      },
      {
        title: "Riadené opätovné pripojenia",
        body: [
          "Dlhé hlasové relácie končia, zariadenia sa menia a jazyk sa dá prepnúť uprostred relácie. Namiesto pádu sa v TaskGroup relácie vyvolá signál na opätovné pripojenie. Príznak keep_context rozhodne, či sa zachová kľúč na obnovenie relácie - pri zmene zvukového zariadenia áno, pri novom jazyku nie.",
        ],
      },
      {
        title: "Kontrakt pluginu",
        body: [
          "Pluginy sa objavia pri štarte. To isté rozhranie poháňa aj samotného jazykového tútora, vďaka čomu je jadro malé a pridanie jazyka je zmena dát, nie kódu.",
        ],
      },
    ],
    decisions: [
      { title: "Úroveň sa meria, nehádže", detail: "Úroveň CEFR je priebežné skóre z posledných viet študenta, nie vstupný test." },
      {
        title: "Súkromie na prvom mieste",
        detail: "API kľúč, nastavenia a všetky súbory pokroku zostávajú v počítači a sú vylúčené z gitu; zvuk ide k modelu len počas relácie.",
      },
      {
        title: "Žiadne dodané obrázky",
        detail: "Tvár tútora, ikony a ukazovatele pokroku sa kreslia za behu, takže rozhranie je ostré pri akomkoľvek zväčšení.",
      },
      {
        title: "Jazyky ako dáta",
        detail: "Pridanie jazyka znamená zapísať jeho zručnosti a etapy do osnov a pridať detektor na úrovni slov - rozhranie ho už podporuje.",
      },
    ],
    stack: [{ group: "Umelá inteligencia" }, { group: "Aplikácia" }, { group: "Úložisko" }],
    next: ["Kurz slovenčiny (osnovy a detektor sú už naplánované).", "Hodnotenie výslovnosti zo zvukového prúdu."],
  },

  "devcode-lms": {
    tagline: "Systém na riadenie výučby s rolami pre programátorské školy.",
    facts: [{ label: "Roly", value: "Admin · Učiteľ · Študent" }, { label: "Tabuľky" }, { label: "Stránky" }, { label: "Migrácie" }],
    overview: [
      "DevCode Academy riadi programátorskú školu od začiatku do konca: kurzy a lekcie, živé hodiny s dochádzkou, zadania s hodnotením, verejné overenie certifikátov a blog.",
      "Každá rola má vlastný panel a navigáciu, všetko postavené na jednej typovej schéme zdieľanej klientom aj serverom.",
    ],
    architecture: {
      summary:
        "Jednostránková aplikácia v Reacte komunikuje s REST API v Expresse. Databázová schéma je definovaná raz v zdieľanom module a používa sa pre dopyty, migrácie aj validáciu požiadaviek.",
      layers: [
        {
          name: "Klient",
          nodes: [
            { detail: "Kurzy, učitelia, študenti" },
            { name: "Učiteľ", detail: "Lekcie, hodnotenie, dochádzka" },
            { name: "Študent", detail: "Kurzy, zadania, známky" },
            { name: "Verejné", detail: "Úvod, blog, overenie certifikátu" },
          ],
        },
        { name: "Klientsky runtime", nodes: [{ detail: "Smerovanie" }, { detail: "Cache stavu servera" }, { detail: "Validované formuláre" }] },
        {
          name: "API",
          nodes: [
            { name: "REST cesty" },
            { name: "Autentifikácia", detail: "Relácie + kontrola rolí" },
            { name: "Vrstva úložiska", detail: "Repozitár nad Drizzle" },
          ],
        },
        { name: "Zdieľané", nodes: [{ detail: "Tabuľky Drizzle + schémy drizzle-zod" }] },
        { name: "Dáta", nodes: [{}, { name: "Úložisko relácií" }] },
      ],
    },
    components: [
      {
        name: "Doména kurzov",
        role: "Obsah a zápis",
        points: [
          "Kurzy → lekcie → materiály a zadania lekcií, plus samostatné prezenčné kurzy s vlastnými zápismi.",
          "Pokrok v lekciách sa sleduje pre každého študenta a sumarizuje na paneloch.",
        ],
      },
      {
        name: "Živé hodiny a dochádzka",
        role: "Chod triedy",
        points: [
          "Učiteľ otvorí hodinu; globálny panel aktívnej hodiny ho sprevádza na všetkých stránkach.",
          "Dochádzka sa zaznamenáva pre každú hodinu a študenti ju vidia.",
        ],
      },
      {
        name: "Zadania a hodnotenie",
        role: "Cyklus učenia",
        points: ["Študenti odovzdávajú práce, učitelia ich hodnotia so spätnou väzbou a známky sa zapisujú do záznamu študenta."],
      },
      {
        name: "Certifikáty",
        role: "Dôvera mimo platformy",
        points: ["Certifikáty sa vydávajú po dokončení a ktokoľvek s kódom certifikátu ich môže verejne overiť."],
      },
    ],
    flow: [
      { detail: "Vytvára kurzy a priraďuje učiteľov." },
      { title: "Učiteľ", detail: "Pripravuje lekcie, vedie živé hodiny, zapisuje dochádzku." },
      { title: "Študent", detail: "Zapíše sa, sleduje lekcie, odovzdáva zadania." },
      { title: "Učiteľ", detail: "Hodnotí odovzdané práce; pokrok sa aktualizuje na oboch paneloch." },
      { title: "Platforma", detail: "Po dokončení vydá overiteľný certifikát." },
    ],
    deepDives: [
      {
        title: "Jedna schéma, tri použitia",
        body: [
          "Tabuľky sú definované raz v Drizzle. Z tých istých definícií vznikajú SQL migrácie, typové dopyty na serveri a Zod schémy, ktoré validujú telá požiadaviek aj formuláre na klientovi - kontrakt API sa tak nemôže odchýliť od databázy.",
        ],
      },
    ],
    decisions: [
      {
        title: "Rozhranie úložiska medzi cestami a databázou",
        detail: "Cesty závisia od abstrakcie úložiska, nie priamo od Drizzle, vďaka čomu sú handlery tenké a dátová vrstva testovateľná.",
      },
      {
        title: "Stav servera v TanStack Query",
        detail: "Žiadny globálny store na klientovi: dáta zo servera sa cachujú a invalidujú podľa kľúčov dopytov, stav UI zostáva lokálny.",
      },
      {
        title: "Relácie v PostgreSQL",
        detail: "Relácie sú v tej istej databáze, takže aplikácia sa dá škálovať horizontálne bez samostatnej služby relácií.",
      },
    ],
    stack: [{}, {}, { group: "Dáta" }],
    next: ["Automatické hodnotenie programátorských zadaní.", "Notifikácie v reálnom čase pre živé hodiny."],
  },

  "crypto-trader": {
    tagline: "Obchodný engine s viacerými indikátormi, živým panelom, backtestom a ovládaním cez Telegram.",
    facts: [{ label: "Cyklus", value: "15 s" }, { label: "Burza" }, { label: "Prenos" }, { label: "Ovládanie" }],
    overview: [
      "Automatizovaný obchodný systém, ktorý každých 15 sekúnd skenuje trh, hodnotí príležitosti pomocou viacerých technických indikátorov, riadi pozície podľa jasných výstupných pravidiel a každé rozhodnutie posiela na živý panel.",
      "Predvolene beží na testnete Binance - ide o inžiniersky a výskumný projekt, nie o finančné poradenstvo.",
    ],
    architecture: {
      summary:
        "Obchodná stratégia je izolovaná za službami: prístup k trhu, evidencia portfólia, notifikácie a ukladanie sú samostatné moduly a prenos (WebSocket vysielanie) sa odovzdáva zvonku namiesto importu.",
      layers: [
        {
          name: "Panel",
          nodes: [
            { name: "Portfólio", detail: "Držby, grafy, história" },
            { name: "Živá aktivita", detail: "Obchody v reálnom čase" },
            { name: "Nastavenia bota", detail: "Riziko, cieľ, zap./vyp." },
            { name: "Manuálne obchodovanie", detail: "Prebitie bota" },
          ],
        },
        { name: "Server", nodes: [{}, { detail: "Vysielanie klientom" }, { name: "Autentifikácia", detail: "Relácie Passport" }] },
        {
          name: "Obchodné služby",
          nodes: [
            { name: "Stratégia", detail: "Hodnotenie a výstupy" },
            { detail: "Trhové dáta a príkazy" },
            { name: "Portfólio", detail: "Zostatky a zisk/strata" },
            { name: "Backtest", detail: "Prehrávanie a metriky" },
            { detail: "Príkazy a upozornenia" },
          ],
        },
        { name: "Dáta", nodes: [{}, { name: "Tabuľky" }] },
      ],
    },
    components: [
      {
        name: "Obchodná stratégia",
        role: "Rozhoduje, čo kúpiť a predať",
        points: [
          "Hodnotí každú mincu podľa RSI, momenta, signálu v štýle MACD, pozície v Bollingerových pásmach, Fibonacciho úrovní a štruktúry trhu.",
          "Vystupuje pri cieľovom zisku, stop-losse a prekúpenom RSI; zastaví sa, keď používateľ dosiahne cieľový zostatok.",
        ],
      },
      {
        name: "Backtesting",
        role: "Overí stratégiu pred obchodovaním",
        points: ["Prehráva generované historické ceny cez rovnakú vstupnú a výstupnú logiku.", "Vykazuje úspešnosť, počet obchodov a profit factor."],
      },
      {
        name: "Vrstva reálneho času",
        role: "Robí bota pozorovateľným",
        points: ["Každý obchod a zmena zostatku sa cez WebSocket vysiela na panel.", "Príkazy a upozornenia v Telegrame umožňujú ovládanie z telefónu."],
      },
    ],
    flow: [
      { title: "Takt", detail: "Každých 15 s engine skontroluje, či je bot pre používateľa aktívny." },
      { title: "Poistka", detail: "Ak celkový zostatok dosiahol cieľ, všetko predá a zastaví sa." },
      { title: "Hodnotenie", detail: "Získa trhové dáta a zoradí príležitosti podľa kombinovaného skóre indikátorov." },
      { title: "Akcia", detail: "Zatvorí pozície, ktoré splnili výstupné pravidlá, a otvorí najlepšie nové v rámci limitov rizika." },
      { title: "Report", detail: "Uloží obchody, vyšle ich cez WebSocket a pošle notifikáciu do Telegramu." },
    ],
    deepDives: [
      {
        title: "Meranie stratégie",
        body: [
          "Backtesty používajú rovnaké pravidlá take-profit (+8 %) a stop-loss (−5 %) ako živé obchodovanie. Kľúčovou metrikou je profit factor - hrubý zisk vydelený hrubou stratou; hodnota nad 1 znamená, že stratégia zarobila viac, než stratila.",
        ],
      },
    ],
    decisions: [
      { title: "Predvolene testnet", detail: "Klient Binance štartuje v režime testnet, takže celý proces môže bežať bez skutočných prostriedkov." },
      { title: "Vysielanie odovzdané zvonku", detail: "Stratégia dostane funkciu na vysielanie namiesto importu WebSocket servera, vďaka čomu sa dá testovať izolovane." },
      { title: "Jedna schéma pre celý stav", detail: "Obchody, držby, nastavenia a história cien zdieľajú typovú schému Drizzle so Zod validáciou." },
    ],
    stack: [{}, {}, { group: "Dáta" }],
  },

  "vacancy-bot": {
    tagline: "Telegram bot, ktorý zbiera pracovné ponuky a stáže z azerbajdžanských portálov a zverejňuje ich v kanáloch.",
    facts: [{ label: "Zdroje" }, { label: "Príkazy" }, { label: "Kanály" }, { label: "Databáza" }],
    overview: [
      "Bot nahrádza ručné kopírovanie ponúk do Telegram kanálov. Admini spustia zber, skontrolujú, čo sa nazbieralo, a zverejňujú po dávkach - najprv v testovacom kanáli, potom v produkčnom.",
    ],
    architecture: {
      summary: "Tenká vrstva príkazov stojí nad službami na zber pre jednotlivé zdroje a modelmi Mongoose. Každý príkaz prechádza middlewarom len pre adminov.",
      layers: [
        { name: "Telegram", nodes: [{ name: "Admin chat" }, { name: "Kanály", detail: "Test a produkcia" }] },
        {
          name: "Bot",
          nodes: [
            { name: "Autentifikačný middleware", detail: "Whitelist ALLOWED_USERS" },
            { name: "Smerovač príkazov", detail: "Jeden modul na príkaz" },
            { name: "Spracovanie správ", detail: "Formátovanie podľa zdroja" },
          ],
        },
        { name: "Scrapery", nodes: [{ name: "Zdroj 1" }, { name: "Zdroj 2" }, { name: "Nástroje" }] },
        { name: "Dáta", nodes: [{ detail: "Pracovné ponuky" }, { detail: "Stáže" }, { detail: "Posledný beh pre každý zdroj" }] },
      ],
    },
    components: [
      {
        name: "Služby na zber",
        role: "Extrahujú ponuky",
        points: [
          "Axios + Cheerio pre statické HTML, Puppeteer pre stránky renderované JavaScriptom.",
          "Každý zdroj vracia rovnaký tvar: názov, odkaz, firma, dátum a popis.",
        ],
      },
      {
        name: "Publikovanie",
        role: "Riadené doručenie",
        points: [
          "/send zverejní ďalších 10 neodoslaných ponúk alebo jednu konkrétnu podľa id.",
          "Formát správ sa líši podľa zdroja (napr. dátum začiatku a konca pri stážach).",
        ],
      },
    ],
    flow: [
      { detail: "Admin vyberie zdroj; scraper stiahne a spracuje stránku s ponukami." },
      { title: "Deduplikácia", detail: "Každá ponuka sa vyhľadá podľa odkazu; ukladajú sa len nové." },
      { title: "Záznam", detail: "ScrapeInfo uloží čas posledného behu pre štatistiky /start." },
      { detail: "Dávka ide na kontrolu do testovacieho kanála." },
      { detail: "Tá istá dávka sa zverejní; /log ukáže, čo bolo odoslané." },
    ],
    deepDives: [
      {
        title: "Idempotentný zber",
        body: ["Odkaz je prirodzený kľúč ponuky. Opakovaný zber nikdy nevytvorí duplikáty, takže admini môžu zbierať, koľkokrát chcú."],
      },
    ],
    decisions: [
      { title: "Len pre adminov už z návrhu", detail: "Whitelist middleware chráni každý príkaz, takže bot môže bezpečne fungovať vo verejných kanáloch." },
      { title: "Zdroje ako konfigurácia", detail: "Zdroje sa registrujú cez konfiguráciu prostredia, takže nový web znamená pridať jeden modul scrapera." },
      { title: "Najprv test, potom produkcia", detail: "Dva kanály umožňujú kontrolu pred zverejnením bez samostatného administračného rozhrania." },
    ],
    stack: [{ group: "Runtime" }, { group: "Zber dát" }, { group: "Dáta" }],
  },

  "unec-ttj": {
    tagline:
      "Platforma akademického časopisu na OJS: dvadsať fakúlt posiela články, každý prejde recenzným redakčným procesom a zverejnené číslo je indexované a citovateľné.",
    facts: [{ label: "Rola", value: "Full-stack · ITM" }, { label: "Stav", value: "Prebieha" }, { label: "Platforma" }, { label: "Indexovanie" }],
    overview: [
      "Študentská vedecká spoločnosť UNEC vydáva študentský vedecký časopis univerzity dvakrát ročne. Prispieva doň zhruba dvadsať fakúlt, v azerbajdžančine, turečtine, angličtine alebo ruštine, a každý článok musí prejsť rovnakým redakčným procesom, než sa dostane do čísla.",
      "Platforma beží na Open Journal Systems, open-source softvéri pre časopisy od Public Knowledge Project. OJS nesie redakčný workflow a metadátové štandardy; mojou prácou je Laravel okolo neho - verejný web časopisu, téma a integrácia, ktorá oboje drží v súlade.",
    ],
    problem: [
      "Časopis nie je blog. Článok nie je dokument, ktorý sa nahrá a objaví - je to záznam prechádzajúci stavmi a v každom stave smie iný človek vidieť a robiť niečo iné. Postaviť to od nuly znamená znovu vytvoriť sledovanie podaní, prideľovanie recenzentov, kolá revízií, redakčnú úpravu, výrobu galejí, zostavenie čísla, registráciu DOI aj indexovacie metadáta.",
      "Druhou polovicou problému je nájditeľnosť. Ak sú metadáta zlé, Google Scholar článok neindexuje, DOI sa nerozlíši a článok mimo stránky vlastne neexistuje.",
    ],
    architecture: {
      summary:
        "OJS vlastní redakčný záznam, Laravel vlastní verejný zážitok. Oboje číta rovnaké dáta časopisu, takže článok sa zverejní na jednom mieste a objaví sa všade.",
      layers: [
        {
          name: "Čitatelia",
          nodes: [
            { name: "Verejný web časopisu", detail: "Čísla, články, abstrakty, PDF galeje" },
            { name: "Vyhľadávače", detail: "Google Scholar a indexovacie crawlery" },
          ],
        },
        {
          name: "Prezentácia",
          nodes: [
            { name: "Laravel front", detail: "Blade šablóny, viacjazyčné cesty, statické stránky" },
            { name: "OJS téma", detail: "Vzhľad časopisu - stránky čísla, článku a podania" },
          ],
        },
        {
          name: "Redakcia",
          nodes: [
            { name: "Workflow OJS 3.4", detail: "Podanie → recenzia → redakčná úprava → produkcia" },
            { name: "Role", detail: "Autor, redaktor, redaktor sekcie, recenzent, korektor" },
          ],
        },
        {
          name: "Metadáta",
          nodes: [
            { name: "DOI plugin", detail: "Registruje DOI pre každý článok a číslo" },
            { name: "OAI-PMH", detail: "Endpoint na zber dát pre indexovacie služby" },
            { name: "Citačné tagy", detail: "Meta tagy Highwire Press, ktoré číta Google Scholar" },
          ],
        },
        {
          name: "Dáta",
          nodes: [
            { name: "MySQL", detail: "Podania, používatelia, čísla, metadáta" },
            { name: "Úložisko súborov", detail: "Rukopisy, revízie a galeje mimo webového koreňa" },
          ],
        },
      ],
    },
    components: [
      {
        name: "Proces podania",
        role: "Stavový automat, ktorým článok prechádza",
        points: [
          "Článok vstúpi ako podanie a čaká: redaktor najprv urobí vstupnú kontrolu voči zameraniu časopisu a správe o plagiáte.",
          "Články, ktoré prejdú, dostane redaktor sekcie, ktorý pozve recenzentov; kolo recenzie končí prijatím, revíziami alebo zamietnutím.",
          "Revízie sa vracajú autorovi a môžu prebehnúť v niekoľkých kolách, než rozhodnutie platí.",
          "Prijaté články idú na redakčnú úpravu a potom do produkcie, kde sa vygeneruje a pripojí PDF galej.",
        ],
      },
      {
        name: "Role a oprávnenia",
        role: "Kto smie článok v danom stave vidieť",
        points: [
          "Autori vidia vlastné podania a rozhodnutia o nich, nič iné.",
          "Recenzenti vidia anonymizovaný rukopis pre kolo, do ktorého boli pozvaní.",
          "Redaktori sekcií pôsobia vo svojej sekcii; výkonný redaktor vidí celý front.",
        ],
      },
      {
        name: "Zostavenie čísla",
        role: "Z prijatých článkov sa stáva zverejnené číslo",
        points: [
          "Články sa zaradia do ročníka a čísla, zoradia a stránkujú - rozsah strán vytlačený pri článku pochádza odtiaľto.",
          "Zverejnenie čísla je jedna akcia; v tom istom okamihu sprístupní všetky články v ňom.",
        ],
      },
      {
        name: "Indexovacia vrstva",
        role: "Aby bola práca nájditeľná a citovateľná",
        points: [
          "Každý článok a číslo dostane registrované DOI, takže citácie sa rozlíšia natrvalo.",
          "Stránky článkov vydávajú citačné meta tagy, ktoré Google Scholar hľadá, a endpoint OAI-PMH umožňuje agregátorom zbierať katalóg.",
          "Časopis má ISSN - práve to mení webovú stránku na citovateľnú publikáciu.",
        ],
      },
      {
        name: "Verejný web",
        role: "To, kam čitateľ skutočne príde",
        points: [
          "Laravel obsluhuje vlastné stránky časopisu - o časopise, redakčná rada, pokyny pre autorov, archív - v rovnakom vzhľade ako stránky OJS.",
          "Frontend je ručne písané HTML, CSS a JavaScript, takže téma zostáva blízko šablónam OJS, ktorým sa musí prispôsobiť.",
        ],
      },
    ],
    flow: [
      { title: "Podanie", detail: "Autor nahrá rukopis, vyplní metadáta a potvrdí kontrolný zoznam podania." },
      { title: "Vstupná kontrola", detail: "Redaktor preverí zameranie, formát a plagiát a článok buď zamietne, alebo pošle ďalej." },
      { title: "Recenzné konanie", detail: "Redaktor sekcie pozve recenzentov; každý vráti odporúčanie a pripomienky." },
      { title: "Rozhodnutie", detail: "Prijať, prepracovať alebo zamietnuť. Revízie idú späť autorovi a kolo sa opakuje." },
      { title: "Produkcia", detail: "Redakčná úprava, potom sa vygeneruje a skoriguje PDF galej." },
      { title: "Zverejnenie", detail: "Článok sa zaradí do čísla; zverejnenie čísla ho sprístupní a vyrazí DOI." },
      { title: "Indexovanie", detail: "Metadáta odchádzajú cez citačné tagy a OAI-PMH a článok sa začne objavovať vo vyhľadávaní." },
    ],
    decisions: [
      {
        title: "OJS namiesto vlastného CMS",
        detail:
          "Redakčný workflow, model rolí a indexovacie štandardy sú desaťročia nazbieraných doménových znalostí. Postaviť ich nanovo by trvalo dlhšie a aj tak by boli menej správne než implementácia od PKP.",
      },
      {
        title: "Laravel okolo neho, nie v ňom",
        detail:
          "Verejný web a statický obsah časopisu žijú v Laraveli, takže sa dajú meniť bez zásahu do inštalácie OJS - a aktualizácia OJS neohrozí web.",
      },
      {
        title: "Metadáta ako plnohodnotná funkcia",
        detail:
          "Registrácia DOI a citačné tagy nie sú dodatok. Sú rozdielom medzi PDF na serveri a článkom, ktorý sa dá citovať.",
      },
      {
        title: "Štyri jazyky podania",
        detail:
          "Články prichádzajú v azerbajdžančine, turečtine, angličtine alebo ruštine, takže rozhranie, metadátové polia aj archív musia byť viacjazyčné, nie raz preložené.",
      },
    ],
    stack: [{}, { group: "Platforma časopisu" }, {}],
    next: [
      "Dokončiť zvyšné redakčné obrazovky a redizajn archívu.",
      "Rozšíriť indexovanie za Google Scholar do odborných databáz, na ktorých fakultám záleží.",
      "Reporting pre Študentskú vedeckú spoločnosť: podania, miera prijatia a rýchlosť recenzií podľa fakulty.",
    ],
  },

  etacxi: {
    tagline:
      "Prepis webu verejného zdravotníckeho inštitútu od nuly: natvrdo zapísané stránky a mŕtvy layout z roku 2019 nahradil Laravel portál, ktorý zamestnanci naozaj vedia spravovať.",
    facts: [{ label: "Rola", value: "Full-stack · ITM" }, { label: "Stav", value: "Prebieha" }, { label: "Klient", value: "Verejná právnická osoba" }, { label: "Prístup", value: "Prepis, nie nový vzhľad" }],
    overview: [
      "Vedecko-výskumný inštitút pľúcnych chorôb je verejná právnická osoba v Baku s koreňmi siahajúcimi k protituberkulóznemu inštitútu z roku 1944. Jeho web etacxi.az je miesto, kde občania hľadajú štruktúru inštitútu, jeho vedenie, správy a praktické informácie pred návštevou.",
      "Web, ktorý dnes stojí, vznikol v roku 2019 a odvtedy sa nepohol. Prepisujem ho od nuly: tá istá inštitúcia, tá istá verejná úloha, ale platforma, ktorú zamestnanci udržia aktuálnu bez vývojára.",
    ],
    problem: [
      "Sekcia správ nie je sekcia. Každá správa má vlastnú natvrdo zapísanú cestu - /xeber1, /xeber2, /xeber3 - takže čokoľvek zverejniť znamená upraviť kód a nasadiť. Najnovšia položka je z roku 2023, čo sa stáva, keď je publikovanie úlohou vývojára.",
      "Odkazy v pätičke sú zástupné texty, ktoré doteraz hlásia \"link 1\" až \"link 6\" a nevedú nikam. Stránka sa deklaruje ako anglická, hoci podáva azerbajdžančinu. Beží po nezabezpečenom HTTP.",
      "Obsah sedí v šablónach namiesto v databáze, takže sa nedá vypísať, filtrovať, vyhľadávať ani zobraziť vo viacerých jazykoch bez duplikovania šablóny.",
    ],
    architecture: {
      summary:
        "Obsah sa sťahuje zo šablón do databázy. Všetko, čo návštevník číta, sa stáva záznamom, ktorý vlastní redaktor, a verejný web je tenká vykresľovacia vrstva nad ním.",
      layers: [
        {
          name: "Návštevníci",
          nodes: [
            { name: "Občania", detail: "Služby, kontakty, vedenie, správy" },
            { name: "Médiá a partneri", detail: "Oznamy, galéria, medzinárodné vzťahy" },
          ],
        },
        {
          name: "Verejný web",
          nodes: [
            { name: "Blade šablóny", detail: "Responzívny layout, postavený nanovo" },
            { name: "Jazykové cesty", detail: "/az a /en z jedného obsahového modelu" },
          ],
        },
        {
          name: "Aplikácia",
          nodes: [
            { name: "Laravel kontroléry", detail: "Stránky, správy, galéria, kontaktný formulár" },
            { name: "Administrácia", detail: "Prihlásený CRUD pre každý typ obsahu" },
            { name: "Validácia", detail: "Form requesty, CSRF, kontaktný formulár chránený pred spamom" },
          ],
        },
        {
          name: "Dáta",
          nodes: [
            { name: "MySQL", detail: "Stránky, správy, zamestnanci, galéria, preklady" },
            { name: "Úložisko médií", detail: "Nahraté obrázky a dokumenty" },
          ],
        },
      ],
    },
    components: [
      {
        name: "Obsahový model",
        role: "Zo stránok sa stávajú záznamy",
        points: [
          "Statické stránky - všeobecné informácie, vedenie, štruktúra, medzinárodné vzťahy - sa menia na editovateľné záznamy namiesto šablón.",
          "Záznam o vedení nesie fotku, funkciu a životopis, takže zmena riaditeľa je formulár, nie commit.",
          "Každé textové pole je pre daný jazyk, takže azerbajdžančina a angličtina sú ten istý záznam, nie dve kópie stránky.",
        ],
      },
      {
        name: "Správy a oznamy",
        role: "Náhrada natvrdo zapísaných ciest",
        points: [
          "Jedna tabuľka správ s dátumom zverejnenia, slugom a stavom, vypísaná so stránkovaním a čitateľná na stabilnej URL.",
          "Koncepty zostávajú neviditeľné až do zverejnenia, takže redaktor si môže správu pripraviť dopredu.",
        ],
      },
      {
        name: "Administrácia",
        role: "Kto web udržiava pri živote",
        points: [
          "Prihlásenie oddelené podľa rolí: redaktori zverejňujú správy a galériu, administrátor spravuje stránky, zamestnancov a používateľov.",
          "Nahraté obrázky sa zmenšujú a ukladajú mimo kódu, takže médiá nikdy nie sú súčasťou nasadenia.",
        ],
      },
      {
        name: "Služby pre občanov",
        role: "To, prečo ľudia naozaj prídu",
        points: [
          "Praktické stránky - povinné zdravotné poistenie, kontakty, adresa a telefónne čísla - dostávajú vlastnú štruktúru namiesto toho, aby boli pochované v texte.",
          "Kontaktný formulár sa validuje na serveri a má obmedzenie frekvencie; správy sa ukladajú aj odosielajú mailom.",
        ],
      },
      {
        name: "Frontend",
        role: "Layout, ktorý prežije telefón",
        points: [
          "Ručne písané HTML, CSS a JavaScript, postavené responzívne nanovo namiesto záplat na starom markupe z čias jQuery.",
          "Externé vloženia, ktoré starý web načítaval na každej stránke, sú preč; galéria a video sekcie sa obsluhujú lokálne.",
        ],
      },
    ],
    flow: [
      { title: "Redaktor píše", detail: "Zamestnanec vytvorí správu alebo upraví stránku v administrácii, v oboch jazykoch." },
      { title: "Validovať a uložiť", detail: "Form request skontroluje vstup; text ide do MySQL, obrázky do úložiska médií." },
      { title: "Zverejniť", detail: "Nastavenie stavu na zverejnené okamžite zaradí záznam do verejných výpisov." },
      { title: "Požiadavka", detail: "Návštevník príde na jazykovú cestu; kontrolér načíta záznam pre daný jazyk." },
      { title: "Vykreslenie", detail: "Blade vykreslí stránku v layoute inštitútu, responzívne až po šírku telefónu." },
    ],
    decisions: [
      {
        title: "Prepis namiesto nového vzhľadu",
        detail:
          "Problémom nie je, ako web z roku 2019 vyzerá. Problémom je, že obsah žije v kóde - nový náter CSS by nechal inštitút rovnako neschopný publikovať ako dnes.",
      },
      {
        title: "Laravel pre verejnú inštitúciu",
        detail:
          "Dlhodobo udržiavateľný PHP stack, ktorý si vedia ľudia inštitútu prevziať a prevádzkovať, s už vyriešenou autentifikáciou, validáciou, migráciami a administračnou vrstvou.",
      },
      {
        title: "Dvojjazyčnosť dátami, nie duplikovaním",
        detail:
          "Preklady sú stĺpce záznamu, nie druhá kópia webu. Práve to bráni azerbajdžanskej a anglickej verzii rozísť sa tak, ako sa rozišla tá stará.",
      },
      {
        title: "HTTPS a poriadne nastavenie domény",
        detail:
          "Verejná zdravotnícka inštitúcia, ktorá pýta od občanov kontaktné údaje po nezabezpečenom HTTP, je neprijateľná; TLS je súčasťou prepisu, nie neskoršou úlohou.",
      },
    ],
    stack: [{}, {}, { group: "Prevádzka" }],
    next: [
      "Migrovať existujúce stránky, archív správ a galériu do nového obsahového modelu.",
      "Dokončiť anglickú jazykovú verziu, aby oba jazyky vyšli naraz.",
      "Prejsť prístupnosť - verejný zdravotnícky web musí fungovať pre ľudí, ktorí s ním najmenej vládzu bojovať.",
    ],
  },

  aments: {
    tagline: "E-shop v Next.js so serverovým renderovaním a prísnou dátovou architektúrou Route → Query → Mapper → UI.",
    facts: [{ label: "Renderovanie" }, { label: "Dátové vrstvy" }, { value: "Jazyk na serveri" }],
    overview: [
      "E-commerce frontend pre backend, ktorého tvar JSON frontend nemá pod kontrolou. Cieľ: UI komponenty vždy čítajú stabilné kľúče, aj keď sa API zmení.",
    ],
    problem: [
      "Keď komponenty čítajú surové polia API priamo, každé premenovanie na backende rozbije UI na mnohých miestach a komponenty sa plnia záložnou logikou typu raw?.name ?? raw?.title ?? \"\".",
    ],
    architecture: {
      summary: "Každá vrstva má jednu zodpovednosť a iba mapper vie, ako vyzerá JSON z backendu.",
      layers: [
        { nodes: [{ name: "Sekcie a karty", detail: "Čítajú len stabilné kľúče - bez záložnej logiky" }] },
        { nodes: [{ detail: "Určí jazyk, zavolá dopyty, odovzdá props" }] },
        { nodes: [{ detail: "Požiadavka + extrakcia + mapovanie + filter" }] },
        { nodes: [{ detail: "Surový JSON → tvar pre UI s predvolenými hodnotami" }] },
        { name: "Prenos", nodes: [{ detail: "HTTP klient" }, { detail: "Konštanty endpointov" }] },
      ],
    },
    components: [
      { name: "Mappery", role: "Jediné miesto, ktoré pozná tvar API", points: ["Začnú objektom predvolených hodnôt, skopírujú známe polia a odvodia zobrazované hodnoty (počty, odkazy)."] },
      { name: "Dopyty", role: "Jedna funkcia na endpoint", points: ["Odstránia opakovaný kód požiadavky a extrakcie a vyradia neplatné položky skôr, než sa dostanú do UI."] },
      { name: "Cesty", role: "Skladanie na serveri", points: ["Dáta získavajú na serveri v jazyku používateľa a pri chybe použijú prázdny zoznam - nefunkčný endpoint tak nikdy nerozbije stránku."] },
    ],
    flow: [
      { detail: "Serverová stránka určí jazyk a zavolá dopyt." },
      { detail: "Pošle požiadavku na endpoint cez ApiService a vytiahne res.data.data." },
      { detail: "Každú surovú položku prevedie na stabilný tvar pre UI." },
      { detail: "Dostane props a vykreslí cat.name, cat.image, cat.items, cat.href." },
    ],
    deepDives: [
      {
        title: "Mapper s predvolenými hodnotami",
        body: ["Ak backend premenuje orderCount, zmení sa len táto funkcia - všetky komponenty naďalej čítajú items."],
      },
    ],
    decisions: [
      { title: "Antikorupčná vrstva", detail: "Mapper izoluje UI od externého API - klasický vzor domain-driven designu aplikovaný na frontend." },
      { title: "Mäkké zlyhanie na serveri", detail: "Neúspešný dopyt vráti prázdny zoznam; stránka sa aj tak vykreslí." },
    ],
  },
};
