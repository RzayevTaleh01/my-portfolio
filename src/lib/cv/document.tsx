import { Document, Font, Image, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { Children } from "react";
import { PdfIcon } from "./icons";
import type { CvDocumentData, CvEntry } from "./model";

const ACCENT = "#1b4f9c";
const INK = "#1f2430";
const MUTED = "#5b6472";
const RULE = "#b9c7de";
const BAND = "#eef2f9";

let fontsFrom: string | null = null;

export function registerCvFonts(base: string) {
  if (fontsFrom === base) return;
  fontsFrom = base;
  Font.register({
    family: "Open Sans",
    fonts: [
      { src: `${base}/OpenSans_400Regular.ttf`, fontWeight: 400 },
      { src: `${base}/OpenSans_400Regular_Italic.ttf`, fontWeight: 400, fontStyle: "italic" },
      { src: `${base}/OpenSans_600SemiBold.ttf`, fontWeight: 600 },
      { src: `${base}/OpenSans_700Bold.ttf`, fontWeight: 700 },
    ],
  });
  Font.registerHyphenationCallback((word) => [word]);
}

const s = StyleSheet.create({
  page: {
    fontFamily: "Open Sans",
    fontSize: 9.2,
    lineHeight: 1.45,
    color: INK,
    paddingTop: 30,
    paddingBottom: 44,
    paddingHorizontal: 40,
  },
  identity: { flexDirection: "row", alignItems: "center", gap: 16 },
  photo: { width: 70, height: 70, objectFit: "cover", borderRadius: 4 },
  name: { fontSize: 22, fontWeight: 700, color: ACCENT, lineHeight: 1.15 },
  headline: { fontSize: 11, fontWeight: 600, marginTop: 3 },
  contactBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 5,
    marginTop: 12,
    marginBottom: 4,
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: BAND,
    borderRadius: 4,
  },
  contactCell: { width: "33.33%", flexDirection: "row", alignItems: "center", gap: 5, paddingRight: 6 },
  contactText: { flex: 1, fontSize: 8.4 },
  link: { color: ACCENT, textDecoration: "none" },
  section: { marginTop: 12 },
  sectionHead: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 7 },
  sectionTitle: { fontSize: 10.5, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: 0.4 },
  sectionRule: { flexGrow: 1, borderBottomWidth: 1, borderBottomColor: RULE },
  entry: { marginBottom: 9 },
  meta: { fontSize: 7.8, color: MUTED, textTransform: "uppercase", letterSpacing: 0.3 },
  title: { fontSize: 10, fontWeight: 700 },
  org: { color: ACCENT, fontWeight: 600 },
  para: { marginTop: 2 },
  bulletRow: { flexDirection: "row", marginTop: 1.5, paddingLeft: 4 },
  bulletDot: { width: 10, color: ACCENT },
  bulletText: { flex: 1 },
  stack: { marginTop: 2.5, fontSize: 8.2, color: MUTED },
  stackLabel: { fontWeight: 600, color: INK },
  row: { flexDirection: "row", marginBottom: 3 },
  rowLabel: { width: 120, fontWeight: 600 },
  rowValue: { flex: 1 },
  groupHead: { marginBottom: 4 },
  groupOrg: { fontSize: 10, fontWeight: 700, color: ACCENT },
  role: { marginLeft: 3, paddingLeft: 9, paddingBottom: 6, borderLeftWidth: 1.2, borderLeftColor: RULE },
  lastRole: { marginBottom: 9 },
  roleHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", gap: 8 },
  rolePeriod: { fontSize: 7.8, color: MUTED, letterSpacing: 0.3 },
  pageHeader: {
    marginTop: -16,
    marginBottom: 16,
    paddingBottom: 5,
    borderBottomWidth: 0.6,
    borderBottomColor: RULE,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 7.5,
    color: MUTED,
  },
  pageNumber: { position: "absolute", top: 14.5, right: 40, fontSize: 7.5, color: MUTED },
  footer: { position: "absolute", bottom: 16, left: 40, right: 40, paddingTop: 5, borderTopWidth: 0.6, borderTopColor: RULE },
  footerText: { fontSize: 7, color: MUTED },
  footerLabel: { fontWeight: 700, color: ACCENT },
});

function Section({ title, keepWithFirst = true, children }: { title: string; keepWithFirst?: boolean; children: React.ReactNode }) {
  const head = (
    <View style={s.sectionHead}>
      <Text style={s.sectionTitle}>{title}</Text>
      <View style={s.sectionRule} />
    </View>
  );
  const [first, ...rest] = Children.toArray(children);
  return (
    <View style={s.section}>
      {keepWithFirst ? (
        <View wrap={false}>
          {head}
          {first}
        </View>
      ) : (
        <>
          {head}
          {first}
        </>
      )}
      {rest}
    </View>
  );
}

function Entry({ entry, technologies }: { entry: CvEntry; technologies: string }) {
  return (
    <View style={s.entry} wrap={entry.bullets.length > 4}>
      <Text style={s.meta}>
        {[entry.period, entry.location].filter(Boolean).join("  ·  ")}
      </Text>
      <Text style={s.title}>
        {entry.title}
        {entry.organization ? (
          <Text style={s.org}>
            {"  -  "}
            {entry.organization}
          </Text>
        ) : null}
      </Text>
      {entry.summary ? <Text style={s.para}>{entry.summary}</Text> : null}
      <Bullets entry={entry} technologies={technologies} />
      {entry.link ? (
        <Link src={entry.link} style={[s.stack, s.link]}>
          {entry.link.replace(/^https?:\/\/(www\.)?/, "")}
        </Link>
      ) : null}
    </View>
  );
}

function Bullets({ entry, technologies }: { entry: CvEntry; technologies: string }) {
  return (
    <>
      {entry.bullets.map((b, i) => (
        <View key={i} style={s.bulletRow}>
          <Text style={s.bulletDot}>•</Text>
          <Text style={s.bulletText}>{b}</Text>
        </View>
      ))}
      {entry.stack?.length ? (
        <Text style={s.stack}>
          <Text style={s.stackLabel}>{technologies}: </Text>
          {entry.stack.join(" | ")}
        </Text>
      ) : null}
    </>
  );
}

function byOrganization(entries: CvEntry[]) {
  const groups = new Map<string, CvEntry[]>();
  entries.forEach((e, i) => {
    const key = e.organization.trim().toLowerCase() || `#${i}`;
    groups.set(key, [...(groups.get(key) ?? []), e]);
  });
  return [...groups.values()];
}

const same = (values: (string | undefined)[]) => values.every((v) => v === values[0]);
const periodEdges = (p: string) => p.split(/\s+[-–]\s+/);

function RoleGroup({ roles, technologies }: { roles: CvEntry[]; technologies: string }) {
  const [latest] = roles;
  const earliest = roles[roles.length - 1];
  const period = `${periodEdges(earliest.period)[0]} - ${periodEdges(latest.period).at(-1)}`;
  const sharedLocation = same(roles.map((r) => r.location));
  const sharedSummary = same(roles.map((r) => r.summary));
  return (
    <>
      <View style={s.groupHead} wrap={false}>
        <Text style={s.meta}>{[period, sharedLocation ? latest.location : ""].filter(Boolean).join("  ·  ")}</Text>
        <Text style={s.groupOrg}>{latest.organization}</Text>
        {sharedSummary && latest.summary ? <Text style={s.para}>{latest.summary}</Text> : null}
      </View>
      {roles.map((r, i) => (
        <View key={i} style={[s.role, i === roles.length - 1 ? s.lastRole : {}]} wrap={r.bullets.length > 4}>
          <View style={s.roleHead}>
            <Text style={s.title}>{r.title}</Text>
            <Text style={s.rolePeriod}>{[r.period, sharedLocation ? "" : r.location].filter(Boolean).join("  ·  ")}</Text>
          </View>
          {!sharedSummary && r.summary ? <Text style={s.para}>{r.summary}</Text> : null}
          <Bullets entry={r} technologies={technologies} />
        </View>
      ))}
    </>
  );
}

export function CvDocument({ data }: { data: CvDocumentData }) {
  const L = data.labels;
  return (
    <Document title={`${data.name} - CV`} author={data.name} subject={data.headline} language={data.language}>
      <Page size="A4" style={s.page}>
        <View style={s.pageHeader} fixed>
          <Text>
            {L.download}:{" "}
            <Link src={data.download.href} style={s.link}>
              {data.download.label}
            </Link>
          </Text>
        </View>
        <Text style={s.pageNumber} fixed render={({ pageNumber, totalPages }) => `${L.page} ${pageNumber} / ${totalPages}`} />

        <View style={s.identity}>
          {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt */}
          {data.photo ? <Image src={data.photo} style={s.photo} /> : null}
          <View style={{ flex: 1 }}>
            <Text style={s.name}>{data.name}</Text>
            {data.headline ? <Text style={s.headline}>{data.headline}</Text> : null}
          </View>
        </View>

        {data.contact.length > 0 && (
          <View style={s.contactBar}>
            {data.contact.map((c) => (
              <View key={`${c.icon}-${c.value}`} style={s.contactCell}>
                <PdfIcon icon={c.icon} size={9} color={ACCENT} />
                {c.href ? (
                  <Link src={c.href} style={[s.contactText, s.link]}>
                    {c.value}
                  </Link>
                ) : (
                  <Text style={s.contactText}>{c.value}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {data.summary ? (
          <Section title={L.aboutMe}>
            <Text>{data.summary}</Text>
          </Section>
        ) : null}

        {data.experience.length > 0 && (
          <Section title={L.workExperience} keepWithFirst={false}>
            {byOrganization(data.experience).map((roles, i) => (
              <RoleGroup key={i} roles={roles} technologies={L.technologies} />
            ))}
          </Section>
        )}

        {data.skills.length > 0 && (
          <Section title={L.digitalSkills}>
            {data.skills.map((g) => (
              <View key={g.title} style={s.row} wrap={false}>
                <Text style={s.rowLabel}>{g.title}</Text>
                <Text style={s.rowValue}>{g.items.join(" | ")}</Text>
              </View>
            ))}
          </Section>
        )}

        {data.education.length > 0 && (
          <Section title={L.education}>
            {data.education.map((e, i) => (
              <Entry key={i} entry={e} technologies={L.technologies} />
            ))}
          </Section>
        )}

        {(data.motherTongue || data.languages.length > 0) && (
          <Section title={L.languageSkills}>
            <View wrap={false}>
              {data.motherTongue ? (
                <View style={s.row}>
                  <Text style={s.rowLabel}>{L.motherTongue}:</Text>
                  <Text style={s.rowValue}>{data.motherTongue}</Text>
                </View>
              ) : null}
              {data.languages.length > 0 && (
                <View style={s.row}>
                  <Text style={s.rowLabel}>{L.otherLanguages}:</Text>
                  <View style={s.rowValue}>
                    {data.languages.map((l) => (
                      <Text key={l.name}>
                        <Text style={{ fontWeight: 600 }}>{l.name}</Text> - {l.level}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </Section>
        )}

        {data.projects.length > 0 && (
          <Section title={L.projects}>
            {data.projects.map((e, i) => (
              <Entry key={i} entry={e} technologies={L.technologies} />
            ))}
          </Section>
        )}

        {data.volunteering.length > 0 && (
          <Section title={L.volunteering}>
            {data.volunteering.map((e, i) => (
              <Entry key={i} entry={e} technologies={L.technologies} />
            ))}
          </Section>
        )}

        {data.certificates.length > 0 && (
          <Section title={L.certificates}>
            {data.certificates.map((c) => (
              <View key={c.title} style={s.bulletRow} wrap={false}>
                <Text style={s.bulletDot}>•</Text>
                <Text style={s.bulletText}>
                  {c.link ? (
                    <Link src={c.link} style={[s.link, { fontWeight: 600 }]}>
                      {c.title}
                    </Link>
                  ) : (
                    <Text style={{ fontWeight: 600 }}>{c.title}</Text>
                  )}
                  <Text style={{ color: MUTED }}> - {c.issuer}</Text>
                </Text>
              </View>
            ))}
          </Section>
        )}

        {data.publications.length > 0 && (
          <Section title={L.publications}>
            {data.publications.map((p, i) => (
              <View key={i} style={s.bulletRow} wrap={false}>
                <Text style={s.bulletDot}>•</Text>
                <Text style={s.bulletText}>{p}</Text>
              </View>
            ))}
          </Section>
        )}

        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            <Text style={s.footerLabel}>{L.portfolio}: </Text>
            <Link src={data.portfolio.href} style={[s.link, s.footerLabel]}>
              {data.portfolio.label}
            </Link>
            {"  ·  "}
            {L.portfolioText}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
