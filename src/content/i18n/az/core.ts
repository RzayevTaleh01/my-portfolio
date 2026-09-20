import type { ContentOverrides } from "../types";

export const core: ContentOverrides = {
  profile: {
    headline: "Software Engineer · AI üzrə tədqiqatçı",
    intro:
      "React və Next.js ilə production veb tətbiqlər qurmaqda 4 illik frontend təcrübəm var, həmçinin backend üzrə praktiki təcrübəm var - REST API-lər, verilənlər bazaları və deploy. AI tədqiqatçısı kimi adaptiv təhsil sistemləri qururam: bilik izləmə, gücləndirmə ilə öyrənmə və mənbəyə əsaslanan LLM tutorlar.",
    bio: [
      "Karyerama 2022-ci ildə AzInTelecom-da frontend təcrübəçisi kimi başladım və Sima Hesabat Sisteminin müştəri və admin panellərini hazırladım. 2023–2026-cı illərdə Edumedia-Azerbaijan-da milli təhsil platformaları üzərində işlədim - o cümlədən Next.js ilə qurulmuş yeni Video.edu.az versiyası, Portal.edu.az və Pts.edu.az üçün yeni xidmətlər.",
      "Frontenddən kənarda tam sistemlər layihələndirirəm. Diaspor.org üçün multi-tenant nəşr platformasını başdan sona qurdum: Spring Boot REST API, React admin paneli, server tərəfdə render olunan Next.js ictimai saytı, versiyalı miqrasiyalarla PostgreSQL və media üçün S3.",
      "Tədqiqatım təhsildə süni intellekt haqqındadır: öyrənənin nə bildiyini modelləşdirmək, növbəti nəyi öyrətməyə qərar vermək və bunu mənbəyə əsaslanan təbii dildə izah etmək. Adaptiv tutor sistemim EduVision Bayes bilik izləməsini (BKT), PPO gücləndirmə ilə öyrənmə agentini və RAG əsaslı LLM-ləri birləşdirir; LangVis isə danışıq praktikası üçün real vaxtda işləyən səsli tutordur.",
      "Gündəlik mühəndislik işində inkişafı sürətləndirmək üçün süni intellektdən istifadə edirəm və prompt engineering-ə proqramçı yanaşması ilə baxıram. Hazırda Slovakiyada yaşayıram və Košice Texniki Universitetində Sənaye menecmenti ixtisası üzrə təhsil alıram.",
    ],
    highlights: ["4 il frontend təcrübəsi", "Backend: Node.js · Spring Boot", "AI tədqiqatı · adaptiv təhsil", "İngilis B2 · Slovak A2"],
    socials: [{}, {}, {}, { label: "E-poçt" }],
  },
  experience: [
    {
      role: "Full-Stack Developer",
      location: "Uzaqdan",
      summary:
        "Diaspor təşkilatları üçün çox saytlı nəşr platforması: hər təşkilatın öz brendli subdomen xəbər saytı var, əsas portal isə təsdiqlənmiş xəbərləri milli lentdə toplayır.",
      highlights: [
        "Arxitekturanı başdan sona layihələndirdim - Spring Boot REST API, React admin paneli, Next.js SSR ictimai saytı.",
        "Versiyalı miqrasiyalarla PostgreSQL, media üçün S3, Docker-də işləyən backend.",
        "Rollara əsaslanan giriş nəzarəti qurdum.",
      ],
    },
    {
      role: "Frontend Developer (Strong Junior)",
      location: "Bakı, Azərbaycan · Ofisdə",
      summary: "Azərbaycanın milli təhsil veb platformaları üçün frontend inkişafı.",
      highlights: [
        "Video.edu.az - Next.js ilə qurulmuş yeni versiya.",
        "Portal.edu.az və Pts.edu.az - yeni xidmətlər və davamlı dəstək.",
        "Digital.edu.az, Karabakh.edu.az, Ict.edu.az, Ite.az, MarsAcademy.az; Edu.gov.az üçün dəstək.",
      ],
    },
    {
      role: "Frontend Developer (Təcrübəçi)",
      location: "Bakı, Azərbaycan · Ofisdə",
      summary: "Sima Hesabat Sistemi - müştəri və admin panelləri.",
      highlights: ["Təcrübə proqramını fərqlənmə sertifikatı ilə başa vurdum."],
    },
  ],
  education: [
    {
      degree: "Bakalavr",
      field: "Sənaye menecmenti",
      institution: "Košice Texniki Universiteti",
      location: "Košice, Slovakiya",
      period: "09/2026 - indiyədək",
    },
    {
      degree: "Bakalavr",
      field: "İnformasiya texnologiyaları",
      institution: "Azərbaycan Dövlət Neft və Sənaye Universiteti",
      location: "Bakı, Azərbaycan",
    },
  ],
  educationIntl: [
    {
      degree: "Magistr",
      field: "Sistem proqramlaşdırma",
      institution: "Azərbaycan Texniki Universiteti",
      location: "Bakı, Azərbaycan",
    },
    {
      degree: "Bakalavr",
      field: "İnformasiya texnologiyaları",
      institution: "Azərbaycan Dövlət Neft və Sənaye Universiteti",
      location: "Bakı, Azərbaycan",
    },
  ],
  certificates: [
    { title: "Frontend Developer - Fərqlənmə sertifikatı (təcrübə proqramı)" },
    {},
    { title: "Problem Solving (Basic), React (Basic), JavaScript (Basic və Intermediate)" },
  ],
  languages: [
    { name: "İngilis dili", level: "Orta-yuxarı (B2)" },
    { name: "Slovak dili", level: "A2" },
  ],
  skills: [
    { title: "Frontend" },
    { title: "State və data" },
    { title: "UI və dizayn" },
    { title: "Backend və verilənlər bazaları" },
    { title: "DevOps və alətlər" },
    { title: "AI" },
  ],
  researchStatement:
    "Adaptiv, süni intellektə əsaslanan təhsili tədqiq edirəm: sistem öyrənənin nə bildiyini necə modelləşdirə, növbəti nəyi öyrədəcəyinə necə qərar verə və bunu kurs materialına əsaslanan təbii dildə necə izah edə bilər.",
  researchDirections: [
    {
      title: "Öyrənənin modelləşdirilməsi",
      description:
        "Tələbənin nə bildiyini səs-küylü cavablardan qiymətləndirmək - beləliklə sistem öyrənəndən özünü qiymətləndirməsini istəmədən uyğunlaşa bilir.",
      methods: ["Bayes bilik izləmə (BKT)", "Aralıqlı təkrar", "Səhv taksonomiyası"],
    },
    {
      title: "Pedaqogika üçün gücləndirmə ilə öyrənmə",
      description:
        "Hər öyrənəni axın zonasında saxlayan siyasət öyrənmək - inkişaf üçün kifayət qədər çətin, imtina etməmək üçün kifayət qədər asan.",
      methods: ["PPO", "Mükafat funksiyasının dizaynı", "A/B qiymətləndirmə"],
    },
    {
      title: "Mənbəyə əsaslanan danışıq tutorları",
      description: "Pedaqoji strategiyaya əməl edən və kurs materialından məlumat çıxararaq faktlara sadiq qalan LLM tutorlar.",
      methods: ["Retrieval-augmented generation", "Neyro-simvolik idarəetmə", "Real vaxt nitqi"],
    },
  ],
  archive: [
    { description: "Dinamik sual arxitekturası və localStorage ilə quiz tətbiqi." },
    { description: "Asılılıqsız, səliqəli kodla səhifənin brauzerdə tərcüməsi." },
    { description: "Node.js və Express backend-i olan full-stack foto paylaşım platforması." },
    { description: "Context API, tünd rejim və localStorage ilə tapşırıq meneceri." },
    { description: "Filtrləmə və localStorage ilə vakansiya lövhəsi interfeysi." },
    { description: "Next.js-də JSON Web Token ilə autentifikasiya axını." },
    { description: "Validasiya, xəta idarəetməsi və xüsusi aliaslarla Spring Boot servisi." },
    { description: "E-poçt təsdiqi ilə insan resursları idarəetmə sistemi - Spring Boot backend və React frontend." },
  ],
};
