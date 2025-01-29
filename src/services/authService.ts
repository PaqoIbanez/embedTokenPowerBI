// src/services/authService.ts
import { ConfidentialClientApplication, LogLevel } from "@azure/msal-node";
import { config } from "../config/config";
import { Request, Response, NextFunction } from "express";

// Configuración de MSAL con tipos mejorados
interface MsalConfig {
  auth: {
    clientId: string;
    authority: string;
    clientSecret: string;
  };
  system: {
    loggerOptions: {
      loggerCallback: (loglevel: LogLevel, message: string) => void;
      piiLoggingEnabled: boolean;
      logLevel: LogLevel;
    };
  };
}

export const getAccessToken = async () => {
  try {
    const tokenResponse = await clientApplication.acquireTokenByClientCredential({
      scopes: [config.scopeBase],
    });

    if (!tokenResponse) {
      throw new Error("Error al obtener token de acceso");
    }

    return {
      accessToken: tokenResponse.accessToken,
      expiresOn: tokenResponse.expiresOn || new Date(),
    };
  } catch (error) {
    console.error("Error al obtener el token de acceso:", error);
    throw error;
  }
};


const msalConfig: MsalConfig = {
  auth: {
    clientId: config.clientId,
    authority: `${config.authorityUrl}${config.tenantId}`,
    clientSecret: config.clientSecret,
  },
  system: {
    loggerOptions: {
      loggerCallback: (loglevel, message) => {
        console.log(`[MSAL] ${message}`);
      },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Verbose,
    },
  },
};

// Cliente de MSAL
const clientApplication = new ConfidentialClientApplication(msalConfig);

// Middleware de autenticación mejorado
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken, expiresOn } = await getAccessToken();
    req.authContext = { accessToken, expiresOn };
    next();
  } catch (error) {
    console.error("Error de autenticación:", error);
    res.status(401).json({
      mensaje: "Error de autenticación",
      detalle: "Verifique las credenciales de servicio",
    });
  }
};