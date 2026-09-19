import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import "katex/dist/katex.min.css";
import "../globals.css";
import type { CommandMenuProps } from "@/components/command-menu";
import { MobileHeader } from "@/components/layout/mobile-header";
import { DesktopControls, Sidebar } from "@/components/layout/sidebar";
import { MotionProvider } from "@/components/motion";
import { SiteFooter } from "@/components/site-footer";
import { ThemeProvider } from "@/components/theme";
import { TopLoader } from "@/components/top-loader";
import { getContent, navigation } from "@/content";
import { hasLocale, localeTags, localize, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { withRegion } from "@/content/locations";
import { getAllPosts } from "@/lib/posts";
import { getRegion } from "@/lib/region";

const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin", "latin-ext"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

// Only /en, /az and /sk exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(props: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const { profile } = getContent(lang);
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

  const t = getDictionary(lang);
  const content = getContent(lang);
  const { projects } = content;
  // Location depends on where the visitor is (see src/content/locations.ts).
  const profile = withRegion(content.profile, lang, await getRegion());

  const menu: CommandMenuProps = {
    nav: navigation.map((n) => ({ href: localize(lang, n.href), label: t.nav[n.key] })),
    entries: [
      ...projects.map((p) => ({ group: "projects" as const, title: p.title, href: localize(lang, `/projects/${p.slug}`) })),
      ...getAllPosts(lang).map((p) => ({ group: "articles" as const, title: p.title, href: localize(lang, `/writing/${p.slug}`) })),
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
        {/* Without JavaScript, scroll-reveal content must still be visible. */}
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
                <SiteFooter profile={profile} />
              </div>
            </div>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
