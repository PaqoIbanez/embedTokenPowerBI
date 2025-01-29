"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const embedService_1 = require("./services/embedService");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5300;
// Middlewares
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use("/assets", express_1.default.static(path_1.default.join(__dirname, "../node_modules")));
// Rutas
app.get("/", (_, res) => {
    res.sendFile(path_1.default.join(__dirname, "../views/index.html"));
});
app.get("/getEmbedToken", async (_, res) => {
    try {
        const result = await (0, embedService_1.getEmbedInfo)();
        res.status(result.status).json(result);
    }
    catch (error) {
        console.error("Error en /getEmbedToken:", error);
        res.status(500).json({
            error: "Error interno del servidor",
            detalle: "No se pudo generar el token de incrustación"
        });
    }
});
// Manejo de errores centralizado
app.use((err, _, res) => {
    console.error("Error global:", err);
    res.status(500).json({
        mensaje: "Error inesperado en el servidor",
        error: err.message
    });
});
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
