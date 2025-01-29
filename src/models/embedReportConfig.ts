// src/models/embedReportConfig.ts
/**
 * Modelo que contiene los detalles de un reporte de Power BI para incrustar
 */
export class PowerBiReportDetails {
  reportId: string;
  reportName: string;
  embedUrl: string;

  constructor(reportId: string, reportName: string, embedUrl: string) {
    this.reportId = reportId;
    this.reportName = reportName;
    this.embedUrl = embedUrl;
  }
}
