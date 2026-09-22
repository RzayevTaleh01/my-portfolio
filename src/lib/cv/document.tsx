/**
 * The Europass-style CV page, drawn with @react-pdf/renderer.
 * Used by the PDF route (server) and the admin preview (browser).
 */
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

/**
 * Open Sans covers Slovak (č, ľ, ž…) and Azerbaijani (ə) - the built-in PDF fonts don't.
 * `base` is "/fonts/cv" in the browser, the absolute folder path on the server.
 */
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
  // Never split words across lines.
  Font.registerHyphenationCallback((word) => [word]);
}

const s = StyleSheet.create({
  page: {
    fontFamily: "Open Sans",
    fontSize: 9.2,
    lineHeight: 1.45,
    color: INK,
    paddingTop: 34,
    paddingBottom: 40,
    paddingHorizontal: 40,
  },
  identity: { flexDirection: "row", alignItems: "center", gap: 16 },
  photo: { width: 70, height: 70, objectFit: "cover", borderRadius: 4 },
  name: { fontSize: 22, fontWeight: 700, color: ACCENT, lineHeight: 1.15 },
  headline: { fontSize: 11, fontWeight: 600, marginTop: 3 },
  // Full-width strip under the name: icon + value, three per row.
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
  // Several roles at one company: the company once, the roles on a rule beneath it.
  groupHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  groupOrg: { fontSize: 10, fontWeight: 700, color: ACCENT },
  roles: { marginTop: 4, marginLeft: 3, paddingLeft: 9, borderLeftWidth: 1.2, borderLeftColor: RULE },
  role: { marginBottom: 6 },
  roleHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", gap: 8 },
  rolePeriod: { fontSize: 7.8, color: MUTED, letterSpacing: 0.3 },
  // Closing call-out: the live portfolio.
  portfolio: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    backgroundColor: BAND,
    borderLeftWidth: 3,
    borderLeftColor: ACCENT,
    borderRadius: 4,
  },
  portfolioTitle: { fontSize: 9.5, fontWeight: 700, color: ACCENT },
  portfolioLink: { fontSize: 9.5, fontWeight: 600, color: ACCENT, textDecoration: "none" },
  footer: { position: "absolute", bottom: 18, left: 40, right: 40, fontSize: 7.5, color: MUTED, flexDirection: "row", justifyContent: "space-between" },
});

/**
 * A titled section. The title is kept on one page with the first item, so it is
 * never left alone at the bottom (minPresenceAhead does not handle unbreakable items).
 * `keepWithFirst={false}` for a first item that may be long enough to span pages.
 */
function Section({ title, keepWithFirst = true, children }: { title: string; keepWithFirst?: boolean; children: React.ReactNode }) {
  const head = (
    <View style={s.sectionHead} minPresenceAhead={40}>
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

/** Entries of one organisation together, in their original order (newest first). */
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

/** One company, several roles: the company, place and overall period once, then each role. */
function RoleGroup({ roles, technologies }: { roles: CvEntry[]; technologies: string }) {
  const [latest] = roles;
  const earliest = roles[roles.length - 1];
  const period = `${periodEdges(earliest.period)[0]} - ${periodEdges(latest.period).at(-1)}`;
  const sharedLocation = same(roles.map((r) => r.location));
  const sharedSummary = same(roles.map((r) => r.summary));
  return (
    <View style={s.entry}>
      <View minPresenceAhead={60}>
        <Text style={s.meta}>{[period, sharedLocation ? latest.location : ""].filter(Boolean).join("  ·  ")}</Text>
        <Text style={s.groupOrg}>{latest.organization}</Text>
        {sharedSummary && latest.summary ? <Text style={s.para}>{latest.summary}</Text> : null}
      </View>
      <View style={s.roles}>
        {roles.map((r, i) => (
          <View key={i} style={s.role} wrap={r.bullets.length > 4}>
            <View style={s.roleHead}>
              <Text style={s.title}>{r.title}</Text>
              <Text style={s.rolePeriod}>{[r.period, sharedLocation ? "" : r.location].filter(Boolean).join("  ·  ")}</Text>
            </View>
            {!sharedSummary && r.summary ? <Text style={s.para}>{r.summary}</Text> : null}
            <Bullets entry={r} technologies={technologies} />
          </View>
        ))}
      </View>
    </View>
  );
}

export function CvDocument({ data }: { data: CvDocumentData }) {
  const L = data.labels;
  return (
    <Document title={`${data.name} - CV`} author={data.name} subject={data.headline} language={data.language}>
      <Page size="A4" style={s.page}>
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
            {byOrganization(data.experience).map((roles, i) =>
              roles.length > 1 ? (
                <RoleGroup key={i} roles={roles} technologies={L.technologies} />
              ) : (
                <Entry key={i} entry={roles[0]} technologies={L.technologies} />
              ),
            )}
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

        <View style={s.portfolio} wrap={false}>
          <PdfIcon icon="website" size={16} color={ACCENT} />
          <View style={{ flex: 1 }}>
            <Text>
              <Text style={s.portfolioTitle}>{L.portfolio}: </Text>
              <Link src={data.portfolio.href} style={s.portfolioLink}>
                {data.portfolio.label}
              </Link>
            </Text>
            <Text style={{ color: MUTED, marginTop: 1 }}>{L.portfolioText}</Text>
          </View>
        </View>

        <View style={s.footer} fixed>
          <Text>{data.name}</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
