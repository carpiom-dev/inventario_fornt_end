import { useState } from "react";
import { Link, useNavigate} from "react-router-dom"; // Cambié "react-router" a "react-router-dom"
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import axios from "axios";
import Button from "../ui/button/Button";
import { AuthService } from "../../apis/authService";

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    setError("");

    try {
      const response = await AuthService.signUp(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.phoneNumber
      );

      if (response.esExitosa) {
        setSuccess("Registro exitoso. ¡Bienvenido!");
        navigate("/");
      } else {
        setError(response.mensaje);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.respuesta?.mensaje || "Error en el registro");
      } else {
        setError("Error desconocido al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Registro
            </h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <Label>
                    Nombre<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="Ingresa tu nombre"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="sm:col-span-1">
                  <Label>
                    Apellido<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Ingresa tu apellido"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <Label>
                  Teléfono<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Ingresa tu número de teléfono"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>
                  Correo electrónico<span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Ingresa tu correo"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>
                  Contraseña<span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Ingresa tu contraseña"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}
              <div>
                <Button disabled={loading}
                  className="w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                >
                {loading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </div>
          </form>
          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Ingresa aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
