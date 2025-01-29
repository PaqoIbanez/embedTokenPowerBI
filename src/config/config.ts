// src/config/config.ts
interface Config {
  workspaceId: string;
  reportId: string;
  clientId: string;
  clientSecret: string;
  tenantId: string;
  authorityUrl: string;
  powerBiApiUrl: string;
  scopeBase: string;
  authenticationMode: "ServicePrincipal";
  embedUsername: string;
  embedRoles: string[];
}

export const config: Config = {
  workspaceId: process.env.WORKSPACE_ID || "",
  reportId: process.env.REPORT_ID || "",
  clientId: process.env.CLIENT_ID || "",
  clientSecret: process.env.CLIENT_SECRET || "",
  tenantId: process.env.TENANT_ID || "",
  authorityUrl: "https://login.microsoftonline.com/",
  powerBiApiUrl: "https://api.powerbi.com/",
  scopeBase: "https://analysis.windows.net/powerbi/api/.default",
  authenticationMode: "ServicePrincipal",
  embedUsername: process.env.EMBED_USERNAME || "",
  embedRoles: [ "FiltroMatricula" ]
};