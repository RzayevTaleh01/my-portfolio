import type { DeepPartial } from "../localize";
import type {
  ArchiveProject,
  Certificate,
  Education,
  Experience,
  Language,
  Profile,
  Project,
  ResearchDirection,
  SkillGroup,
} from "../types";

/** Text-only translation of the English content. See src/content/localize.ts. */
export interface ContentOverrides {
  profile?: DeepPartial<Profile>;
  experience?: DeepPartial<Experience>[];
  education?: DeepPartial<Education>[];
  educationIntl?: DeepPartial<Education>[];
  certificates?: DeepPartial<Certificate>[];
  languages?: DeepPartial<Language>[];
  skills?: DeepPartial<SkillGroup>[];
  researchStatement?: string;
  researchDirections?: DeepPartial<ResearchDirection>[];
  archive?: DeepPartial<ArchiveProject>[];
  /** Keyed by project slug. */
  projects?: Record<string, DeepPartial<Project>>;
}
