import { Respuesta } from "./Respuesta";

export interface ApiResponse {
  resultado: {
    validarFactorAutenticacion: boolean;
    jwt: {
        accessToken: string;
        refreshToken: string;
        expiration: string;
    };
};
respuesta: Respuesta;
  }
  