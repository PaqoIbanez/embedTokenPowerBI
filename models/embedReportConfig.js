"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerBiReportDetails = void 0;
/**
 * Modelo que contiene los detalles de un reporte de Power BI para incrustar
 */
class PowerBiReportDetails {
    constructor(reportId, reportName, embedUrl) {
        this.reportId = reportId;
        this.reportName = reportName;
        this.embedUrl = embedUrl;
    }
}
exports.PowerBiReportDetails = PowerBiReportDetails;
