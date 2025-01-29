"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.getAccessToken = void 0;
const msal_node_1 = require("@azure/msal-node");
const config_1 = require("../config/config");
const getAccessToken = async () => {
    try {
        const tokenResponse = await clientApplication.acquireTokenByClientCredential({
            scopes: [config_1.config.scopeBase],
        });
        if (!tokenResponse) {
            throw new Error("Error al obtener token de acceso");
        }
        return {
            accessToken: tokenResponse.accessToken,
            expiresOn: tokenResponse.expiresOn || new Date(),
        };
    }
    catch (error) {
        console.error("Error al obtener el token de acceso:", error);
        throw error;
    }
};
exports.getAccessToken = getAccessToken;
const msalConfig = {
    auth: {
        clientId: config_1.config.clientId,
        authority: `${config_1.config.authorityUrl}${config_1.config.tenantId}`,
        clientSecret: config_1.config.clientSecret,
    },
    system: {
        loggerOptions: {
            loggerCallback: (loglevel, message) => {
                console.log(`[MSAL] ${message}`);
            },
            piiLoggingEnabled: false,
            logLevel: msal_node_1.LogLevel.Verbose,
        },
    },
};
// Cliente de MSAL
const clientApplication = new msal_node_1.ConfidentialClientApplication(msalConfig);
// Middleware de autenticación mejorado
const authenticate = async (req, res, next) => {
    try {
        const { accessToken, expiresOn } = await (0, exports.getAccessToken)();
        req.authContext = { accessToken, expiresOn };
        next();
    }
    catch (error) {
        console.error("Error de autenticación:", error);
        res.status(401).json({
            mensaje: "Error de autenticación",
            detalle: "Verifique las credenciales de servicio",
        });
    }
};
exports.authenticate = authenticate;
