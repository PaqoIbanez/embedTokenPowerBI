"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerBiReportDetails = exports.EmbedConfig = void 0;
// Modelo para la configuración de incrustación
class EmbedConfig {
    constructor(type, reportsDetail, embedToken) {
        this.type = type;
        this.reportsDetail = reportsDetail;
        this.embedToken = embedToken;
    }
}
exports.EmbedConfig = EmbedConfig;
// Modelo para detalles del reporte de Power BI
class PowerBiReportDetails {
    constructor(reportId, reportName, embedUrl, datasetId) {
        this.reportId = reportId;
        this.reportName = reportName;
        this.embedUrl = embedUrl;
        this.datasetId = datasetId;
    }
}
exports.PowerBiReportDetails = PowerBiReportDetails;
