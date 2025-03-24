import axios from "axios";
import { ApiResponse } from "../../src/dto/ApiResponse";
import { Respuesta } from "../dto/Respuesta";

const BASE_URL = "http://localhost:6061/api/v1";

export class AuthService {
  static async login(usuario: string, clave: string, recordarSesion: boolean): Promise<ApiResponse> {
    try {
      const response = await axios.post<ApiResponse>(`${BASE_URL}/iniciar-sesion`, {
        usuario,
        clave,
        recordarSesion,
      }, { withCredentials: true });

      if (response.data.respuesta.esExitosa) {
        return response.data;
      } else {
        throw new Error(response.data.respuesta.mensaje);
      }
    } catch (error) {
      console.error("Error en la autenticación:", error);
      throw error;
    }
  }

  static async signUp(firstName: string, lastName: string, email: string, password: string, phoneNumber: string): Promise<Respuesta> {
    try {
      const response = await axios.post<Respuesta>(`${BASE_URL}/crear-usuario`, {
        firstName,
        lastName,
        email,
        passwordHash: password,
        phoneNumber,
        isSuperUser: false, // Valor quemado
        tipo2FA: 0,         // Valor quemado
      });

        return response.data;
    } catch (error) {
      console.error("Error en el registro:", error);
      throw error;
    }
  }
}
