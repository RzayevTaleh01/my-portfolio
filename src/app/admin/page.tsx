import rawConfig from "@/content/cv/cv-config.json";
import { normalizeConfig } from "@/lib/cv/model";
import { getCvSource } from "@/lib/cv/source";
import { AdminApp } from "./admin-app";

export default function AdminPage() {
  return (
    <AdminApp
      source={getCvSource()}
      initialConfig={normalizeConfig(rawConfig)}
      canSave={process.env.NODE_ENV === "development"}
    />
  );
}
