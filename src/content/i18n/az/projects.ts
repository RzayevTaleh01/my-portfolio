import type { ContentOverrides } from "../types";

type Projects = NonNullable<ContentOverrides["projects"]>;

export const projects: Projects = {
  diaspor: {
    tagline: "Multi-tenant nəşr platforması: hər diaspor təşkilatı üçün brendli xəbər saytı və vahid milli lent.",
    facts: [
      { label: "Rol", value: "Full-stack · freelance" },
      { label: "Dövr", value: "05 - 09/2026" },
      { label: "Tenant modeli", value: "Hər təşkilata subdomen" },
      { label: "Əsas", value: "Spring Boot · Next.js" },
    ],
    overview: [
      "Diaspor.org hər diaspor təşkilatına subdomendə öz brendli xəbər saytını verir, əsas portal isə onların təsdiqlənmiş xəbərlərini vahid milli lentdə toplayır.",
      "Bütün sistemi başdan sona layihələndirib qurdum: API, admin paneli, ictimai saytlar, verilənlər bazası və media anbarı.",
    ],
    problem: [
      "Bir çox kiçik təşkilata peşəkar xəbər saytı lazımdır, amma hər biri üçün ayrı sayt saxlamaq baha başa gəlir və məzmunu parçalayır. Platforma hər təşkilata öz kimliyini verməli, eyni zamanda bir kod bazasını, bir verilənlər bazasını və bir redaksiya axınını paylaşmalıdır.",
    ],
    architecture: {
      summary:
        "Bir Spring Boot API iki frontendə xidmət edir: təşkilatların məzmunu idarə etdiyi React admin paneli və hər təşkilatın subdomenini, eləcə də milli portalı render edən, server tərəfdə işləyən Next.js saytı.",
      layers: [
        {
          name: "Auditoriya",
          nodes: [
            { name: "Təşkilat saytları", detail: "Hər təşkilata brendli subdomen" },
            { name: "Milli portal", detail: "Toplanmış lent" },
            { name: "Redaktor və adminlər", detail: "Məzmunun idarə olunması" },
          ],
        },
        {
          name: "Frontend",
          nodes: [
            { name: "Next.js ictimai sayt", detail: "SSR · SEO" },
            { name: "React admin paneli", detail: "TypeScript" },
          ],
        },
        {
          name: "API",
          nodes: [
            { detail: "Java" },
            { name: "Rollara əsaslanan giriş", detail: "Rola görə icazələr" },
            { name: "Təsdiq", detail: "Milli lentə keçid nöqtəsi" },
          ],
        },
        {
          name: "Data və infrastruktur",
          nodes: [
            { detail: "Versiyalı miqrasiyalar" },
            { detail: "Media anbarı" },
            { detail: "Konteynerləşdirilmiş backend" },
          ],
        },
      ],
    },
    components: [
      {
        name: "İctimai sayt",
        role: "Bütün təşkilatlar, bir tətbiq",
        points: [
          "Tək Next.js tətbiqi hər təşkilatın brendli subdomen saytını render edir.",
          "Server tərəfdə render xəbər səhifələrini sürətli və axtarış sistemləri üçün indekslənən edir.",
        ],
      },
      {
        name: "Admin paneli",
        role: "Məzmunun idarə olunduğu yer",
        points: ["Xəbərləri yaratmaq və idarə etmək üçün React + TypeScript paneli; giriş rola görə məhdudlaşdırılır."],
      },
      {
        name: "REST API",
        role: "Vahid həqiqət mənbəyi",
        points: [
          "Hər iki frontendin istifadə etdiyi Spring Boot API.",
          "Rollara əsaslanan giriş nəzarəti və milli lentdə dərc üçün təsdiq addımı.",
        ],
      },
      {
        name: "Saxlama",
        role: "Data və media",
        points: [
          "PostgreSQL sxemi versiyalı miqrasiyalarla inkişaf edir.",
          "Şəkillər və media verilənlər bazasında deyil, S3-də saxlanılır.",
        ],
      },
    ],
    flow: [
      { title: "Yaz", detail: "Təşkilatın redaktoru admin panelində xəbər yaradır." },
      { title: "Saxla", detail: "API xəbəri PostgreSQL-də saxlayır, medianı S3-ə yükləyir." },
      { title: "Dərc et", detail: "Xəbər təşkilatın öz subdomen saytında görünür." },
      { title: "Təsdiqlə", detail: "Təsdiqlənmiş xəbərlər əsas portaldakı milli lentə toplanır." },
    ],
    decisions: [
      {
        title: "Multi-tenant, çoxlu deploy yox",
        detail: "Bir kod bazası və bir verilənlər bazası bütün təşkilatlara xidmət edir - yeni təşkilat yeni deploy deyil, sadəcə datadır.",
      },
      {
        title: "İctimai səhifələr üçün SSR",
        detail: "Xəbərləri axtarış sistemləri oxuyur və sosial şəbəkələrdə paylaşılır, ona görə səhifələr serverdə render olunur.",
      },
      {
        title: "Versiyalı miqrasiyalar",
        detail: "Sxemdəki hər dəyişiklik yoxlanılan, təkrarlana bilən miqrasiyadır - mühitlər bir-birindən ayrılmır.",
      },
      {
        title: "Media verilənlər bazasından kənarda",
        detail: "S3 verilənlər bazasını kiçik, backend konteynerlərini isə vəziyyətsiz və yenidən deploy üçün asan saxlayır.",
      },
    ],
    stack: [{}, {}, { group: "Data və infrastruktur" }],
  },

  eduvision: {
    tagline: "Neyro-simvolik arxitekturalı adaptiv intellektual tutor sistemi.",
    facts: [
      { label: "Mühərriklər", value: "5 + RL agenti" },
      {},
      { label: "Öyrənən modeli" },
      { label: "Siyasət" },
    ],
    overview: [
      "EduVision fərdi, bir-bir insan tutorluğunu simulyasiya edir. Hər tələbənin nə bildiyini modelləşdirir, növbəti nəyi öyrədəcəyinə qərar verir, bunu təbii dildə izah edir və cavabı qiymətləndirir - sonra tələbə modelini yeniləyir və dövr təkrarlanır.",
      "Sistem dil modelini sadəcə “sarımaq” əvəzinə qərarları dildən ayırır: pedaqoji olaraq nə baş verəcəyinə ehtimal və öyrənilmiş komponentlər qərar verir, LLM isə yalnız bu qərarı dialoqa çevirir.",
    ],
    problem: [
      "LLM çatbotları suallara cavab verir, amma öyrətmir: onların öyrənənin davamlı modeli, çətinlik anlayışı yoxdur və kurs materialında olmayan şeyləri deyə bilərlər.",
      "Tutora yaddaş (bu tələbə nə bilir?), strategiya (növbəti nə olmalıdır?) və mənbəyə bağlılıq (izah bu kurs üçün düzgündürmü?) lazımdır.",
    ],
    architecture: {
      summary:
        "Beş müstəqil mühərrik qərar mərkəzi rolunu oynayan Pedaqogika mühərriki vasitəsilə əlaqə saxlayır. Gücləndirmə ilə öyrənmə agenti çətinliyi tənzimləyir, platforma servisləri isə eksperimentləri, izah oluna bilənliyi və xərcləri idarə edir.",
      layers: [
        {
          name: "Müştərilər",
          nodes: [
            { name: "Tələbə", detail: "Adaptiv söhbət və cavablar" },
            { name: "Müəllim", detail: "Dərslər, PDF-lər və rubrikalar" },
            { name: "API istifadəçiləri" },
          ],
        },
        {
          name: "API",
          nodes: [{ detail: "Kurslar, sessiyalar, söhbət, öyrənən vəziyyəti" }, { name: "Autentifikasiya" }],
        },
        {
          name: "Mühərriklər",
          nodes: [
            { name: "Tutor", detail: "Dialoq və persona" },
            { name: "Pedaqogika", detail: "Strategiya + PPO agenti" },
            { name: "Öyrənən", detail: "BKT mənimsəmə və SRS" },
            { name: "Qiymətləndirmə", detail: "Rubrika və kod yoxlaması" },
            { name: "Bilik", detail: "RAG + anlayış qrafı" },
          ],
        },
        {
          name: "Platforma",
          nodes: [
            { name: "Plaginlər", detail: "Sahəyə xas məzmun" },
            { name: "Eksperimentlər", detail: "A/B testlər · bandit optimallaşdırıcı" },
            { name: "İzah oluna bilənlik", detail: "Bu niyə seçildi?" },
            { name: "İcra mühiti", detail: "Xərc nəzarəti · limitlər · metrikalar" },
          ],
        },
        {
          name: "Modellər və data",
          nodes: [{ detail: "Together AI vasitəsilə" }, { detail: "Cümlə embedding-ləri" }, {}, { name: "PPO siyasəti" }],
        },
      ],
    },
    components: [
      {
        name: "Bilik mühərriki",
        role: "Kursun uzunmüddətli yaddaşı",
        points: [
          "PDF və mətnləri qəbul edir, ~512 tokenlik hissələrə bölür və hər hissə üçün embedding yaradır.",
          "Vektorları pgvector ilə PostgreSQL-də, anlayışlar arasındakı əlaqələri isə NetworkX qrafında saxlayır.",
          "Tutora top-k kontekst verir ki, izahlar kurs materialına əsaslansın.",
        ],
      },
      {
        name: "Öyrənən mühərriki",
        role: "Tələbənin ehtimal modeli",
        points: [
          "Bayes bilik izləmə ilə hər bacarıq üzrə mənimsəmə ehtimalını izləyir.",
          "Bacarıq unudulmazdan əvvəl aralıqlı təkrarla təkrar planlaşdırır.",
          "Düzəliş üsulunu seçmək üçün səhvləri taksonomiya ilə təsnif edir.",
        ],
      },
      {
        name: "Pedaqogika mühərriki",
        role: "Nəyi və necə öyrətməyə qərar verir",
        points: [
          "Öyrənənin vəziyyətini və tapılmış konteksti tədris strategiyasına çevirir (Sokratik sual, skafoldinq, Feynman).",
          "Çətinliyi mənimsəmə, dəqiqlik, cavab müddəti, yorğunluq və cari çətinliyi müşahidə edən PPO agentinə həvalə edir.",
        ],
      },
      {
        name: "Tutor mühərriki",
        role: "Strategiyanı dialoqa çevirir",
        points: [
          "Llama 3.1 8B Instruct Turbo ilə izahlar, ipucları və suallar yaradır.",
          "Təhsil bələdçisi kimi yönləndirilir və Pedaqogika mühərrikinin seçdiyi strategiya ilə məhdudlaşır.",
          "LLM-ə giriş provayder interfeysi üzərindən olur, ona görə model təchizatçısı dəyişdirilə bilər.",
        ],
      },
      {
        name: "Qiymətləndirmə mühərriki",
        role: "Qiymət və rəy verir",
        points: [
          "Kod üçün AST analizi, mətn üçün semantik oxşarlıq və müəllim rubrikalarına görə LLM qiymətləndirməsi.",
          "Nəticəni Öyrənən mühərrikinə qaytararaq dövrü tamamlayır.",
        ],
      },
    ],
    flow: [
      { title: "Qəbul", detail: "Müəllim material yükləyir; Bilik mühərriki onu hissələrə bölür, embedding yaradır və əlaqələndirir." },
      { title: "Sessiyanın başlanması", detail: "Öyrənən mühərriki tələbənin mənimsəmə profilini yükləyir; Pedaqogika mühərriki ilk mövzunu seçir." },
      { title: "Öyrətmə", detail: "Tutor mühərriki mövzunu seçilmiş üslubda, tapılmış hissələrə əsaslanaraq təqdim edir." },
      { title: "Qiymətləndirmə", detail: "Tələbə cavab verir; Qiymətləndirmə mühərriki onu yoxlayır və rəy qaytarır." },
      { title: "Uyğunlaşma", detail: "BKT mənimsəməni yeniləyir; PPO agenti çətinliyi artırır, saxlayır və ya azaldır; dövr təkrarlanır." },
    ],
    deepDives: [
      {
        title: "Bayes bilik izləmə (BKT)",
        body: [
          "Mənimsəmə gizli dəyişəndir. Hər cavab bir sübutdur və bilmədən təsadüfən düz cavab vermə (G) və bildiyi halda səhv etmə (S) ehtimalları ilə çəkilir. Aposterior ehtimal hesablandıqdan sonra model cəhd zamanı baş verən öyrənməni (T) də nəzərə alır.",
        ],
      },
      {
        title: "Çətinlik gücləndirmə ilə öyrənmə problemi kimi",
        body: [
          "Agent 5 ölçülü vəziyyəti müşahidə edir - mənimsəmə, son cavabın düzgünlüyü, normallaşdırılmış cavab müddəti, yorğunluq indeksi və cari çətinlik - və üç hərəkətdən birini seçir: çətinliyi azaltmaq, saxlamaq və ya artırmaq.",
          "Mükafat öyrənmə qazancı, axın zonasında qalmaq və sessiya yorğunluğu arasında balans qurur. Kiçik diskret hərəkət fəzası siyasəti stabil və izahı asan saxlayır.",
        ],
      },
      {
        title: "Axtarışla mənbəyə əsaslanan cavablar",
        body: [
          "Hər sual embedding-ə çevrilir və kosinus oxşarlığı ilə kurs hissələri ilə müqayisə olunur. Ən uyğun top-k hissə kontekst kimi tutorun sistem promptuna əlavə edilir - beləliklə model internetdən yox, kursdan izah edir.",
        ],
      },
    ],
    decisions: [
      {
        title: "LLM sarğısı yox, neyro-simvolik yanaşma",
        detail: "Pedaqoji qərarları izah oluna bilən modellər verir, LLM isə yalnız dil yaradır. Hər qərar izlənilə və izah edilə bilər.",
      },
      {
        title: "Dərin bilik izləmə əvəzinə BKT",
        detail: "Hər bacarıq üçün dörd izah oluna bilən parametr, hər cavabda ucuz yeniləmə və tələbə başına çox az data ilə də ağlabatan davranış.",
      },
      {
        title: "PostgreSQL daxilində pgvector",
        detail: "Vektorlar, öyrənən vəziyyəti və kurs datası bir tranzaksiyalı anbarda yaşayır - ayrıca vektor bazasını idarə etməyə ehtiyac yoxdur.",
      },
      {
        title: "Daxili qiymətləndirmə",
        detail: "A/B eksperiment və bandit modulları RL siyasətini statik çətinlik ardıcıllığı ilə öyrənmə qazancı, cəlb olunma və tərk etmə göstəricilərinə görə müqayisə edir.",
      },
    ],
    stack: [{ group: "AI" }, {}, { group: "Data" }, { group: "Əməliyyat və sənədlər" }],
    next: [
      "Multimodal tutorluq üçün səs və şəkil girişi (Whisper, vision).",
      "Real vaxtda mənimsəmə xəritələri olan müəllim analitika paneli.",
      "Siyasəti sessiya mükafatına deyil, uzunmüddətli yadda saxlamaya görə optimallaşdırmaq.",
    ],
  },

  langvis: {
    tagline: "Hər cümləni düzəldən və öyrənəni A2-dən B2-yə aparan real vaxt səsli dil tutoru.",
    facts: [
      { label: "Kurs", value: "24 bölmə · A2→B2" },
      { label: "İzlənən bacarıqlar" },
      { label: "Tədris metodları" },
      { label: "Səs", value: "16 kHz giriş · 24 kHz çıxış" },
    ],
    overview: [
      "LangVis masaüstü danışıq kursudur. Öyrənən danışır; tutor dinləyir, cümləni düzəldir, təkrar etməyi xahiş edir və fikri daha güclü ifadə etməyin yolunu təklif edir. Səhvləri yadda saxlayır və təkrarlananları qısa məşqlərə çevirir.",
      "O, bilərəkdən köməkçi deyil: bir işi var - öyrənənin daha yaxşı danışmasını təmin etmək - və arxitekturanın hər hissəsi bu dövrə xidmət edir.",
    ],
    problem: [
      "Danışıq praktikası ani, gecikməsiz söhbət tələb edir, yaxşı düzəliş isə hər cümlənin diqqətli analizini. Hər ikisini bir model çağırışında etmək ya söhbəti yavaşladır, ya da rəyi səthi edir.",
    ],
    architecture: {
      summary:
        "İki model yolu yan-yana işləyir: canlı audio sessiyası söhbəti axıcı saxlayır, kiçik və sürətli model isə arxa planda hər cümləni analiz edir və növbəti promptu formalaşdıran öyrənən modelini yeniləyir.",
      layers: [
        {
          name: "İnterfeys",
          nodes: [
            { name: "Proqram", detail: "Mərhələlər, bölmələr, qaydalar" },
            { name: "Kouçinq", detail: "Düzəlişlər, məsləhətlər, təkmilləşdirmələr" },
            { name: "Lüğət", detail: "Səviyyədən bir addım yuxarı sözlər" },
            { name: "Tutorun üzü", detail: "Səs səviyyəsinə görə real vaxtda çəkilir" },
          ],
        },
        {
          name: "Canlı sessiya",
          nodes: [
            { name: "Audio giriş/çıxış", detail: "Mikrofon və dinamik axınları" },
            { detail: "İkitərəfli real vaxt səs" },
            { name: "Yenidən qoşulma", detail: "Sessiyanın bərpası" },
          ],
        },
        {
          name: "Tutor domeni",
          nodes: [
            { name: "Dil tutoru", detail: "müşahidə → ölçmə → öyrətmə" },
            { name: "Analiz", detail: "Hər cümlə üçün, əsas axından kənarda" },
            { name: "Kurikulum", detail: "Bacarıqlar, bölmələr, metodlar" },
            { name: "İrəliləyiş", detail: "Səviyyə, bacarıqlar, lüğət" },
          ],
        },
        {
          name: "Nüvə",
          nodes: [
            { name: "Plagin yükləyicisi", detail: "Alətlər, müşahidəçilər, prompt blokları" },
            { name: "Oyandırma sözü", detail: "İstəyə bağlı, tam oflayn" },
            { name: "Öz jurnalı", detail: "Öz çıxışı və xətaları" },
          ],
        },
        {
          name: "Lokal saxlama",
          nodes: [
            { detail: "Həqiqət mənbəyi" },
            { detail: "Oxunaqlı, yenidən yaradılır" },
            { detail: "Parametrlər və API açarı" },
          ],
        },
      ],
    },
    components: [
      {
        name: "Canlı sessiya",
        role: "Gözləmədən söhbət",
        points: [
          "16 kHz mikrofon səsini Gemini Live API-yə göndərir və 24 kHz cavabları səsləndirir.",
          "Serverin GoAway mesajlarını və parametr dəyişikliklərini söhbət kontekstini saxlaya və ya ata bilən idarə olunan yenidən qoşulma ilə emal edir.",
        ],
      },
      {
        name: "Cümlə analizi",
        role: "Hər ifadəni ölçür",
        points: [
          "Yüngül model hər cümlə üçün strukturlaşdırılmış JSON qaytarır: səhvlər, düzgün forma, bacarıq etiketləri, CEFR sübutları.",
          "Arxa planda işləyir, ona görə canlı model onu heç vaxt gözləmir.",
          "Lokal söz səviyyəli yoxlamalar ucuz suallara (bu söz işlənibmi?) model çağırışı olmadan cavab verir.",
        ],
      },
      {
        name: "Kurikulum və irəliləyiş",
        role: "Növbəti nəyi öyrətmək",
        points: [
          "Hədəf formaları, nümunə cümlələri və adlandırılmış tədris metodları olan 6 mərhələ × 4 bölmə.",
          "Hər birinin mənimsəmə dərəcəsi, real səhvləri və təkrar tarixi olan ~40 qrammatik bacarıq.",
          "Ən zəif üç bacarıq fokus olur və növbəti sessiyanın promptuna əlavə edilir.",
        ],
      },
      {
        name: "Plagin sistemi",
        role: "Nüvəyə toxunmadan genişlənir",
        points: [
          "plugins/ qovluğunda PLUGIN lüğəti və run() funksiyası olan istənilən fayl tutorun çağıra biləcəyi alətə çevrilir.",
          "İstəyə bağlı hook-lar plaginə hər cümləni müşahidə etməyə, daimi prompt təlimatları əlavə etməyə və ya interfeysdə görünməyə imkan verir.",
        ],
      },
    ],
    flow: [
      { title: "Danış", detail: "Səs canlı modelə axır; tutor əvvəlcə düzəliş edir, sonra davam edir." },
      { title: "Analiz et", detail: "Transkript səhvləri və bacarıqları etiketləyən arxa plan analizatoruna gedir." },
      { title: "Yenilə", detail: "Səviyyə, bacarıq mənimsəməsi və lüğət level.json-a yazılır; progress.md yenidən yaradılır." },
      { title: "Uyğunlaş", detail: "Eyni səhv üç dəfə təkrarlananda məşq başlayır; ən zəif bacarıqlar növbəti promptu formalaşdırır." },
      { title: "İrəlilə", detail: "Hədəf formalar möhkəmləndikdə növbəti bölmə sessiyanı yenidən başlatmadan açılır." },
    ],
    deepDives: [
      {
        title: "İki model, iki sürət",
        body: [
          "Canlı model gecikmə üçün, analiz modeli isə struktur və xərc üçün optimallaşdırılıb. Onları ayırmaq söhbəti təbii saxlayır, hər cümlə isə yenə də tam qrammatik yoxlamadan keçir.",
          "Nəticələr format_for_prompt() plagin hook-u vasitəsilə geri qayıdır, beləliklə tutor növbəti cavabında nəyə fokuslanacağını bilir.",
        ],
      },
      {
        title: "İdarə olunan yenidən qoşulmalar",
        body: [
          "Uzun səs sessiyaları bitir, cihazlar dəyişir və dil sessiyanın ortasında dəyişdirilə bilər. Proqram çökmək əvəzinə sessiyanın TaskGroup-u daxilində yenidən qoşulma siqnalı qaldırır. keep_context bayrağı sessiya bərpa açarının qalıb-qalmayacağına qərar verir - audio cihaz dəyişəndə qalır, yeni dil seçiləndə atılır.",
        ],
      },
      {
        title: "Plagin müqaviləsi",
        body: [
          "Plaginlər başlanğıcda aşkar edilir. Eyni interfeys dil tutorunun özünü də işlədir - bu, nüvəni kiçik saxlayır və yeni dil əlavə etməyi kod deyil, data dəyişikliyinə çevirir.",
        ],
      },
    ],
    decisions: [
      {
        title: "Səviyyə təxmin edilmir, ölçülür",
        detail: "CEFR səviyyəsi yerləşdirmə testi deyil, öyrənənin son cümlələri üzərində hesablanan sürüşkən baldır.",
      },
      {
        title: "Lokal-first məxfilik",
        detail: "API açarı, parametrlər və bütün irəliləyiş faylları kompüterdə qalır və git-dən kənarda saxlanılır; səs yalnız sessiya zamanı modelə göndərilir.",
      },
      {
        title: "Hazır şəkil yoxdur",
        detail: "Tutorun üzü, ikonlar və irəliləyiş zolaqları real vaxtda çəkilir, ona görə interfeys istənilən ekran miqyasında kəskin qalır.",
      },
      {
        title: "Dillər data kimi",
        detail: "Yeni dil əlavə etmək onun bacarıqlarını və mərhələlərini kurikuluma yazmaq və söz səviyyəli detektor əlavə etmək deməkdir - interfeys artıq hazırdır.",
      },
    ],
    stack: [{ group: "AI" }, { group: "Tətbiq" }, { group: "Saxlama" }],
    next: ["Slovak dili kursu (kurikulum və detektor artıq planlaşdırılıb).", "Audio axınından tələffüzün qiymətləndirilməsi."],
  },

  "devcode-lms": {
    tagline: "Proqramlaşdırma məktəbləri üçün rollara əsaslanan təhsil idarəetmə sistemi.",
    facts: [
      { label: "Rollar", value: "Admin · Müəllim · Tələbə" },
      { label: "Cədvəllər" },
      { label: "Səhifələr" },
      { label: "Miqrasiyalar" },
    ],
    overview: [
      "DevCode Academy proqramlaşdırma məktəbini başdan sona idarə edir: kurslar və dərslər, davamiyyətli canlı dərs sessiyaları, qiymətləndirilən tapşırıqlar, sertifikatların ictimai yoxlanışı və bloq.",
      "Hər rolun öz paneli və naviqasiyası var, hamısı müştəri və serverin paylaşdığı vahid tipli sxemə əsaslanır.",
    ],
    architecture: {
      summary:
        "React tək səhifəli tətbiqi Express REST API ilə əlaqə saxlayır. Verilənlər bazası sxemi paylaşılan modulda bir dəfə təyin olunur və sorğular, miqrasiyalar və sorğu validasiyası üçün təkrar istifadə edilir.",
      layers: [
        {
          name: "Müştəri",
          nodes: [
            { detail: "Kurslar, müəllimlər, tələbələr" },
            { name: "Müəllim", detail: "Dərslər, qiymətləndirmə, davamiyyət" },
            { name: "Tələbə", detail: "Kurslar, tapşırıqlar, qiymətlər" },
            { name: "İctimai", detail: "Əsas səhifə, bloq, sertifikat yoxlanışı" },
          ],
        },
        {
          name: "Müştəri icra mühiti",
          nodes: [{ detail: "Marşrutlaşdırma" }, { detail: "Server vəziyyəti keşi" }, { detail: "Validasiyalı formalar" }],
        },
        {
          name: "API",
          nodes: [
            { name: "REST marşrutları" },
            { name: "Autentifikasiya", detail: "Sessiyalar + rol yoxlamaları" },
            { name: "Saxlama qatı", detail: "Drizzle üzərində repozitoriya" },
          ],
        },
        { name: "Paylaşılan", nodes: [{ detail: "Drizzle cədvəlləri + drizzle-zod sxemləri" }] },
        { name: "Data", nodes: [{}, { name: "Sessiya anbarı" }] },
      ],
    },
    components: [
      {
        name: "Kurs domeni",
        role: "Məzmun və qeydiyyat",
        points: [
          "Kurslar → dərslər → materiallar və dərs tapşırıqları, həmçinin öz qeydiyyatları olan ayrıca oflayn kurslar.",
          "Dərs irəliləyişi hər tələbə üçün izlənilir və panellərdə ümumiləşdirilir.",
        ],
      },
      {
        name: "Canlı sessiyalar və davamiyyət",
        role: "Sinif əməliyyatları",
        points: [
          "Müəllim dərs sessiyası açır; qlobal aktiv sessiya paneli onu bütün səhifələrdə izləyir.",
          "Davamiyyət hər sessiya üçün qeydə alınır və tələbələrə görünür.",
        ],
      },
      {
        name: "Tapşırıqlar və qiymətləndirmə",
        role: "Öyrənmə dövrü",
        points: ["Tələbələr iş təhvil verir, müəllimlər rəylə qiymətləndirir, qiymətlər tələbənin qeydinə toplanır."],
      },
      {
        name: "Sertifikatlar",
        role: "Platformadan kənarda etibar",
        points: ["Sertifikatlar kurs bitdikdə verilir və sertifikat kodu olan hər kəs tərəfindən ictimai yoxlanıla bilər."],
      },
    ],
    flow: [
      { title: "Admin", detail: "Kurslar yaradır və müəllimləri təyin edir." },
      { title: "Müəllim", detail: "Dərslər qurur, canlı sessiyalar keçirir, davamiyyəti qeyd edir." },
      { title: "Tələbə", detail: "Qeydiyyatdan keçir, dərsləri izləyir, tapşırıqları təhvil verir." },
      { title: "Müəllim", detail: "İşləri qiymətləndirir; irəliləyiş hər iki paneldə yenilənir." },
      { title: "Platforma", detail: "Kurs bitdikdə yoxlanıla bilən sertifikat verir." },
    ],
    deepDives: [
      {
        title: "Bir sxem, üç istifadə",
        body: [
          "Cədvəllər Drizzle ilə bir dəfə təyin olunur. Eyni təriflər SQL miqrasiyaları, serverdə tipli sorğular və sorğu gövdələrini və müştəri formalarını yoxlayan Zod sxemləri yaradır - beləliklə API müqaviləsi verilənlər bazasından ayrıla bilmir.",
        ],
      },
    ],
    decisions: [
      {
        title: "Marşrutlarla verilənlər bazası arasında saxlama interfeysi",
        detail: "Marşrutlar birbaşa Drizzle-dan deyil, saxlama abstraksiyasından asılıdır - bu, handler-ləri sadə, data qatını isə test edilə bilən saxlayır.",
      },
      {
        title: "Server vəziyyəti TanStack Query-də",
        detail: "Qlobal müştəri store-u yoxdur: server datası sorğu açarları ilə keşlənir və yenilənir, UI vəziyyəti lokal qalır.",
      },
      {
        title: "Sessiyalar PostgreSQL-də",
        detail: "Sessiyalar eyni verilənlər bazasında saxlanılır, ona görə tətbiq ayrıca sessiya servisi olmadan üfüqi miqyaslana bilir.",
      },
    ],
    stack: [{}, {}, { group: "Data" }],
    next: ["Kod tapşırıqları üçün avtomatik qiymətləndirmə.", "Canlı sessiyalar üçün real vaxt bildirişləri."],
  },

  "crypto-trader": {
    tagline: "Canlı panel, backtest və Telegram idarəsi olan çox indikatorlu ticarət mühərriki.",
    facts: [
      { label: "Dövr", value: "15 san" },
      { label: "Birja" },
      { label: "Nəqliyyat" },
      { label: "İdarəetmə" },
    ],
    overview: [
      "Bazarı hər 15 saniyədən bir skan edən, imkanları bir neçə texniki indikatorla qiymətləndirən, mövqeləri aydın çıxış qaydaları ilə idarə edən və hər qərarı canlı panelə ötürən avtomatlaşdırılmış ticarət sistemi.",
      "Susmaya görə Binance testnet üzərində işləyir - bu, maliyyə məsləhəti deyil, mühəndislik və tədqiqat layihəsidir.",
    ],
    architecture: {
      summary:
        "Strategiya mühərriki servislərin arxasında təcrid olunub: bazara giriş, portfel uçotu, bildirişlər və saxlama ayrı modullardır, nəqliyyat (WebSocket yayımı) isə import edilmir, kənardan ötürülür.",
      layers: [
        {
          name: "Panel",
          nodes: [
            { name: "Portfel", detail: "Aktivlər, qrafiklər, tarixçə" },
            { name: "Canlı fəaliyyət", detail: "Axınla gələn əməliyyatlar" },
            { name: "Bot parametrləri", detail: "Risk, hədəf, aç/bağla" },
            { name: "Əl ilə ticarət", detail: "Botu üstələmək" },
          ],
        },
        {
          name: "Server",
          nodes: [{}, { detail: "Müştərilərə yayım" }, { name: "Autentifikasiya", detail: "Passport sessiyaları" }],
        },
        {
          name: "Ticarət servisləri",
          nodes: [
            { name: "Strategiya", detail: "Qiymətləndirmə və çıxışlar" },
            { detail: "Bazar datası və sifarişlər" },
            { name: "Portfel", detail: "Balanslar və mənfəət/zərər" },
            { name: "Backtest", detail: "Təkrar oynatma və metrikalar" },
            { detail: "Əmrlər və xəbərdarlıqlar" },
          ],
        },
        { name: "Data", nodes: [{}, { name: "Cədvəllər" }] },
      ],
    },
    components: [
      {
        name: "Strategiya mühərriki",
        role: "Nəyi alıb-satacağına qərar verir",
        points: [
          "Hər koini RSI, momentum, MACD tipli siqnal, Bollinger mövqeyi, Fibonacci səviyyələri və bazar strukturu ilə qiymətləndirir.",
          "Mənfəət hədəflərində, stop-loss-da və RSI həddindən artıq alınanda mövqedən çıxır; istifadəçinin hədəf balansına çatanda özünü dayandırır.",
        ],
      },
      {
        name: "Backtest",
        role: "Strategiyanı ticarətdən əvvəl yoxlayır",
        points: [
          "Yaradılmış tarixi qiymətləri eyni giriş və çıxış məntiqindən keçirir.",
          "Qazanma faizini, əməliyyat sayını və profit factor-u hesablayır.",
        ],
      },
      {
        name: "Real vaxt qatı",
        role: "Botu müşahidə oluna bilən edir",
        points: [
          "Hər əməliyyat və balans dəyişikliyi WebSocket vasitəsilə panelə yayımlanır.",
          "Telegram əmrləri və xəbərdarlıqları telefondan idarə imkanı verir.",
        ],
      },
    ],
    flow: [
      { title: "Taktı", detail: "Hər 15 saniyədən bir mühərrik botun istifadəçi üçün aktiv olub-olmadığını yoxlayır." },
      { title: "Qoruyucu", detail: "Ümumi balans hədəfə çatıbsa, hər şeyi satır və dayanır." },
      { title: "Qiymətləndir", detail: "Bazar datasını alır və imkanları ümumi indikator balına görə sıralayır." },
      { title: "İcra et", detail: "Çıxış qaydasına düşən mövqeləri bağlayır, risk limitləri daxilində ən yaxşı yeniləri açır." },
      { title: "Hesabat", detail: "Əməliyyatları saxlayır, WebSocket ilə yayımlayır və Telegram-a bildiriş göndərir." },
    ],
    deepDives: [
      {
        title: "Strategiyanın ölçülməsi",
        body: [
          "Backtestlər canlı ticarətdəki eyni take-profit (+8%) və stop-loss (−5%) qaydalarından istifadə edir. Əsas metrika profit factor-dur - ümumi mənfəətin ümumi zərərə nisbəti; 1-dən yuxarı dəyər strategiyanın itirdiyindən çox qazandığını göstərir.",
        ],
      },
    ],
    decisions: [
      { title: "Susmaya görə testnet", detail: "Binance müştərisi testnet rejimində başlayır, ona görə bütün axın real vəsait olmadan işləyə bilir." },
      { title: "Kənardan ötürülən yayım", detail: "Strategiya WebSocket serverini import etmək əvəzinə yayım funksiyasını parametr kimi alır və təcrid olunmuş şəkildə test edilə bilir." },
      { title: "Bütün vəziyyət üçün bir sxem", detail: "Əməliyyatlar, aktivlər, parametrlər və qiymət tarixçəsi Zod validasiyalı tipli Drizzle sxemini paylaşır." },
    ],
    stack: [{}, {}, { group: "Data" }],
  },

  "vacancy-bot": {
    tagline: "Azərbaycan iş saytlarından vakansiya və təcrübə elanlarını toplayıb kanallarda dərc edən Telegram botu.",
    facts: [
      { label: "Mənbələr" },
      { label: "Əmrlər" },
      { label: "Kanallar" },
      { label: "Verilənlər bazası" },
    ],
    overview: [
      "Bot vakansiyaların Telegram kanallarına əl ilə köçürülməsini əvəz edir. Adminlər toplamanı başladır, toplananı yoxlayır və paketlərlə dərc edir - əvvəl test kanalına, sonra production-a.",
    ],
    architecture: {
      summary:
        "Nazik əmr qatı mənbəyə xas scraper servisləri və Mongoose modelləri üzərində dayanır. Hər əmr yalnız adminlər üçün olan middleware-dən keçir.",
      layers: [
        { name: "Telegram", nodes: [{ name: "Admin çatı" }, { name: "Kanallar", detail: "Test və production" }] },
        {
          name: "Bot",
          nodes: [
            { name: "Autentifikasiya middleware", detail: "ALLOWED_USERS ağ siyahısı" },
            { name: "Əmr marşrutlaşdırıcısı", detail: "Hər əmr üçün bir modul" },
            { name: "Mesaj emalçısı", detail: "Mənbəyə görə formatlama" },
          ],
        },
        {
          name: "Scraper-lər",
          nodes: [{ name: "Mənbə 1" }, { name: "Mənbə 2" }, { name: "Alətlər" }],
        },
        {
          name: "Data",
          nodes: [{ detail: "Vakansiyalar" }, { detail: "Təcrübə proqramları" }, { detail: "Hər mənbənin son işləmə vaxtı" }],
        },
      ],
    },
    components: [
      {
        name: "Scraper servisləri",
        role: "Elanları çıxarır",
        points: [
          "Statik HTML üçün Axios + Cheerio, JavaScript ilə render olunan səhifələr üçün Puppeteer.",
          "Hər mənbə eyni formanı qaytarır: başlıq, link, şirkət, tarix və təsvir.",
        ],
      },
      {
        name: "Dərc",
        role: "Nəzarətli çatdırılma",
        points: [
          "/send növbəti 10 göndərilməmiş elanı və ya id ilə konkret bir elanı dərc edir.",
          "Mesaj formatları mənbəyə görə fərqlənir (məsələn, təcrübə proqramları üçün başlama və bitmə tarixləri).",
        ],
      },
    ],
    flow: [
      { detail: "Admin mənbəni seçir; scraper elan səhifəsini yükləyir və təhlil edir." },
      { title: "Təkrarları sil", detail: "Hər elan link ilə yoxlanılır; yalnız yeniləri saxlanılır." },
      { title: "Qeyd et", detail: "ScrapeInfo /start statistikası üçün son işləmə vaxtını saxlayır." },
      { detail: "Paket yoxlanış üçün test kanalına gedir." },
      { detail: "Eyni paket dərc olunur; /log nəyin göndərildiyini göstərir." },
    ],
    deepDives: [
      {
        title: "İdempotent toplama",
        body: ["Link vakansiyanın təbii açarıdır. Toplamanı təkrar işə salmaq heç vaxt dublikat yaratmır, ona görə adminlər istədikləri qədər toplaya bilərlər."],
      },
    ],
    decisions: [
      { title: "Dizayn etibarilə yalnız admin", detail: "Ağ siyahı middleware-i hər əmri qoruyur, ona görə bot ictimai kanallarda təhlükəsiz işləyə bilir." },
      { title: "Mənbələr konfiqurasiya kimi", detail: "Mənbələr mühit konfiqurasiyası ilə qeydə alınır, yeni sayt əlavə etmək bir scraper modulu əlavə etmək deməkdir." },
      { title: "Əvvəl test, sonra prod", detail: "İki kanal ayrıca admin interfeysi olmadan dərci yoxlanıla bilən edir." },
    ],
    stack: [{ group: "İcra mühiti" }, { group: "Toplama" }, { group: "Data" }],
  },

  aments: {
    tagline: "Ciddi Route → Query → Mapper → UI data arxitekturası olan, serverdə render olunan Next.js onlayn mağazası.",
    facts: [{ label: "Render" }, { label: "Data qatları" }, { value: "Serverdə dil" }],
    overview: [
      "JSON forması frontendin nəzarətində olmayan backend üçün e-ticarət frontendi. Məqsəd: API dəyişsə belə, UI komponentləri həmişə sabit açarları oxusun.",
    ],
    problem: [
      "Komponentlər xam API sahələrini birbaşa oxuyanda backenddəki hər ad dəyişikliyi UI-ni bir çox yerdə sındırır, komponentlər isə raw?.name ?? raw?.title ?? \"\" kimi ehtiyat məntiqi ilə dolur.",
    ],
    architecture: {
      summary: "Hər qatın bir vəzifəsi var və backend JSON-unun necə göründüyünü yalnız mapper bilir.",
      layers: [
        { nodes: [{ name: "Bölmələr və kartlar", detail: "Yalnız sabit açarları oxuyur - ehtiyat məntiqi yoxdur" }] },
        { nodes: [{ detail: "Dili müəyyən edir, sorğuları çağırır, props ötürür" }] },
        { nodes: [{ detail: "Sorğu + çıxarma + map + filtr" }] },
        { nodes: [{ detail: "Xam JSON → susmaya görə dəyərlərlə UI forması" }] },
        { name: "Nəqliyyat", nodes: [{ detail: "HTTP müştərisi" }, { detail: "Endpoint sabitləri" }] },
      ],
    },
    components: [
      { name: "Mapper-lər", role: "API formasını bilən yeganə yer", points: ["Susmaya görə dəyərlər obyektindən başlayır, məlum sahələri köçürür, göstəriləcək dəyərləri (saylar, linklər) hesablayır."] },
      { name: "Sorğular", role: "Hər endpoint üçün bir funksiya", points: ["Təkrarlanan sorğu/çıxarma kodunu aradan qaldırır və yanlış elementləri UI-yə çatmamış atır."] },
      { name: "Marşrutlar", role: "Serverdə kompozisiya", points: ["Serverdə istifadəçinin dili ilə data alır və xəta olanda boş siyahıya keçir - beləliklə sınmış endpoint səhifəni sındırmır."] },
    ],
    flow: [
      { detail: "Server səhifəsi dili müəyyən edir və sorğunu çağırır." },
      { detail: "ApiService vasitəsilə endpoint-ə sorğu göndərir və res.data.data-nı çıxarır." },
      { detail: "Hər xam elementi sabit UI formasına çevirir." },
      { detail: "Props alır və cat.name, cat.image, cat.items, cat.href-i render edir." },
    ],
    deepDives: [
      {
        title: "Susmaya görə dəyərləri olan mapper",
        body: ["Backend orderCount-un adını dəyişsə, yalnız bu funksiya dəyişir - bütün komponentlər items-i oxumağa davam edir."],
      },
    ],
    decisions: [
      { title: "Anti-korrupsiya qatı", detail: "Mapper UI-ni xarici API-dən təcrid edir - frontendə tətbiq edilmiş klassik domain-driven design nümunəsi." },
      { title: "Serverdə yumşaq uğursuzluq", detail: "Uğursuz sorğu boş siyahı qaytarır; səhifə yenə də render olunur." },
    ],
  },
};
