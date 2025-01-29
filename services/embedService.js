"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmbedInfo = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config/config");
const embedConfig_1 = require("../models/embedConfig");
const authService_1 = require("./authService");
// Obtener información de incrustación mejorada
const getEmbedInfo = async () => {
    try {
        const reportDetails = await getReportDetails();
        const embedToken = await generateEmbedToken(reportDetails);
        return {
            accessToken: embedToken.token,
            embedUrl: reportDetails.embedUrl,
            expiry: embedToken.expiration,
            status: 200
        };
    }
    catch (error) {
        const axiosError = error;
        console.error("Error al obtener información de incrustación:", axiosError.message);
        return {
            status: 500,
            error: "Error interno al procesar la solicitud"
        };
    }
};
exports.getEmbedInfo = getEmbedInfo;
// Obtener detalles del reporte
const getReportDetails = async () => {
    const url = `${config_1.config.powerBiApiUrl}v1.0/myorg/groups/${config_1.config.workspaceId}/reports/${config_1.config.reportId}`;
    const headers = await getAuthHeaders();
    const response = await axios_1.default.get(url, { headers });
    if (!response.data.embedUrl) {
        throw new Error("URL de incrustación no disponible");
    }
    return new embedConfig_1.PowerBiReportDetails(response.data.id, response.data.name, response.data.embedUrl, response.data.datasetId);
};
// Generar token de incrustación
const generateEmbedToken = async (report) => {
    const url = `${config_1.config.powerBiApiUrl}v1.0/myorg/GenerateToken`;
    const headers = await getAuthHeaders();
    const body = {
        reports: [{ id: report.reportId, groupId: config_1.config.workspaceId }],
        datasets: [{ id: report.datasetId }],
        identities: [{
                username: config_1.config.embedUsername,
                roles: config_1.config.embedRoles,
                datasets: [report.datasetId]
            }]
    };
    console.log({
        url,
        body: JSON.stringify(body),
        headers
    });
    const response = await axios_1.default.post(url, body, { headers });
    return {
        token: response.data.token,
        expiration: new Date(response.data.expiration)
    };
};
// Obtener cabeceras de autenticación
const getAuthHeaders = async () => {
    const { accessToken } = await (0, authService_1.getAccessToken)();
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
    };
};
