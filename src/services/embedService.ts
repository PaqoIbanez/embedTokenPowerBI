// src/services/embedService.ts

import axios, { AxiosError } from "axios";
import { config } from "../config/config";
import { PowerBiReportDetails } from "../models/embedConfig";
import { getAccessToken } from "./authService";

// Obtener información de incrustación mejorada
export const getEmbedInfo = async () => {
  try {
    const reportDetails = await getReportDetails();
    const embedToken = await generateEmbedToken( reportDetails );

    return {
      accessToken: embedToken.token,
      embedUrl: reportDetails.embedUrl,
      expiry: embedToken.expiration,
      status: 200
    };
  } catch ( error ) {
    const axiosError = error as AxiosError;
    console.error( "Error al obtener información de incrustación:", axiosError.message );
    return {
      status: 500,
      error: "Error interno al procesar la solicitud"
    };
  }
};

// Obtener detalles del reporte
const getReportDetails = async () => {
  const url = `${ config.powerBiApiUrl }v1.0/myorg/groups/${ config.workspaceId }/reports/${ config.reportId }`;
  const headers = await getAuthHeaders();
  const response = await axios.get( url, { headers } );
  if ( !response.data.embedUrl ) {
    throw new Error( "URL de incrustación no disponible" );
  }

  return new PowerBiReportDetails(
    response.data.id,
    response.data.name,
    response.data.embedUrl,
    response.data.datasetId
  );
};

// Generar token de incrustación
const generateEmbedToken = async ( report: PowerBiReportDetails ) => {
  const url = `${ config.powerBiApiUrl }v1.0/myorg/GenerateToken`;

  const headers = await getAuthHeaders();
  const body = {
    reports: [ { id: report.reportId, groupId: config.workspaceId } ],
    datasets: [ { id: report.datasetId } ],
    identities: [ {
      username: config.embedUsername,
      roles: config.embedRoles,
      datasets: [ report.datasetId ]
    } ]
  };


  console.log( {
    url,
    body: JSON.stringify( body ),
    headers
  } );

  const response = await axios.post( url, body, { headers } );

  return {
    token: response.data.token,
    expiration: new Date( response.data.expiration )
  };
};

// Obtener cabeceras de autenticación
const getAuthHeaders = async () => {
  const { accessToken } = await getAccessToken();
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${ accessToken }`,
  };
};
