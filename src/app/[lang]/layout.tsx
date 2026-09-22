import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import "katex/dist/katex.min.css";
import "../globals.css";
import { Assistant } from "@/components/assistant";
import { ClapButton } from "@/components/clap-button";
import { GoogleAnalytics } from "@/components/google-analytics";
import type { CommandMenuProps } from "@/components/command-menu";
import { MobileHeader } from "@/components/layout/mobile-header";
import { DesktopControls, Sidebar } from "@/components/layout/sidebar";
import { MotionProvider } from "@/components/motion";
import { SiteFooter } from "@/components/site-footer";
import { ThemeProvider } from "@/components/theme";
import { TopLoader } from "@/components/top-loader";
import { getContent, navigation, withRegion } from "@/content";
import { fmt, hasLocale, localeTags, localize, locales } from "@/i18n/config";
import { buildAssistantTopics } from "@/lib/assistant-topics";
import { getAllPosts } from "@/lib/posts";
import { getRegion } from "@/lib/region";
import { getSiteTexts } from "@/lib/site/site-texts";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin", "latin-ext"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(props: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const { profile } = await getContent(lang);
  return {
    metadataBase: new URL(profile.siteUrl),
    title: { default: `${profile.name} - ${profile.headline}`, template: `%s - ${profile.name}` },
    description: profile.intro,
    authors: [{ name: profile.name }],
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(locales.map((l) => [localeTags[l], `/${l}`])),
    },
    openGraph: {
      type: "website",
      locale: localeTags[lang].replace("-", "_"),
      title: profile.name,
      description: profile.intro,
      siteName: profile.name,
      images: [profile.avatar],
    },
  };
}

export default async function RootLayout(props: LayoutProps<"/[lang]">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();

  const t = await getSiteTexts(lang);
  const content = await getContent(lang);
  const { projects } = content;
  const region = await getRegion();
  const profile = withRegion(content, region);
  const posts = await getAllPosts(lang);
  const who = { name: profile.name, firstName: profile.name.split(" ")[0] };
  const assistant = {
    ...t.assistant,
    subtitle: fmt(t.assistant.subtitle, who),
    greeting: fmt(t.assistant.greeting, who),
    teaser: fmt(t.assistant.teaser, who),
  };

  const menu: CommandMenuProps = {
    nav: navigation.map((n) => ({ href: localize(lang, n.href), label: t.nav[n.key] })),
    entries: [
      ...projects.map((p) => ({ group: "projects" as const, title: p.title, href: localize(lang, `/projects/${p.slug}`) })),
      ...posts.map((p) => ({ group: "articles" as const, title: p.title, href: localize(lang, `/writing/${p.slug}`) })),
    ],
    socials: profile.socials,
    t: t.common,
    groupLabels: { projects: t.nav.projects, articles: t.nav.articles },
  };

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} ${jetbrains.variable} antialiased`}
    >
      <body className="font-sans">
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <ThemeProvider>
          <TopLoader />
          <MotionProvider>
            <div className="mx-auto max-w-[1120px] px-5 sm:px-8 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-20 lg:px-10">
              <DesktopControls lang={lang} menu={menu} />
              <Sidebar lang={lang} profile={profile} menu={menu} />
              <MobileHeader lang={lang} profile={profile} menu={menu} />
              <div className="min-w-0 max-w-[720px] pb-12 pt-10 lg:pt-20">
                <main>{props.children}</main>
                <SiteFooter profile={profile} privacy={{ href: localize(lang, "/privacy"), label: t.privacy.footerLink }} t={t.footer} />
              </div>
            </div>
            <ClapButton t={t.clap} />
            {profile.gaMeasurementId && <GoogleAnalytics id={profile.gaMeasurementId} />}
            <Assistant topics={buildAssistantTopics(lang, region, { ...content, profile }, t, posts)} t={assistant} />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
