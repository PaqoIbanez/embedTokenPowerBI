// src/server.ts
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import path from "path";
import { getEmbedInfo } from "./services/embedService";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 5300;
const serverUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${port}`;

// Middlewares
app.use( express.json() );
// app.use( express.static( path.join( __dirname, "../public" ) ) );
app.use( "/assets", express.static( path.join( __dirname, "../node_modules" ) ) );

// Rutas
// app.get( "/", ( _: Request, res: Response ) => {
//   res.sendFile( path.join( __dirname, "../views/index.html" ) );
// } );

app.get( "/getEmbedToken", async ( _: Request, res: Response ) => {
  try {
    const result = await getEmbedInfo();
    res.status( result.status ).json( result );
  } catch ( error ) {
    console.error( "Error en /getEmbedToken:", error );
    res.status( 500 ).json( {
      error: "Error interno del servidor",
      detalle: "No se pudo generar el token de incrustación"
    } );
  }
} );

// Manejo de errores centralizado
app.use( ( err: Error, _: Request, res: Response ) => {
  console.error( "Error global:", err );
  res.status( 500 ).json( {
    mensaje: "Error inesperado en el servidor",
    error: err.message
  } );
} );

app.listen(port, () => {
    console.log(`Servidor ejecutándose en ${serverUrl}`);
});
