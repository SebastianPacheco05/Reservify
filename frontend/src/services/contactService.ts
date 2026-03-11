import { getApiEndpoint } from "../config/api";

export interface ContactFormData {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}

const getContactRecipient = (): string => {
  const to = import.meta.env.VITE_CONTACT_EMAIL as string | undefined;

  if (!to) {
    console.error(
      "VITE_CONTACT_EMAIL no está definida en el .env del frontend. Se usará el correo genérico de soporte."
    );
    return "soporte@reservify.com";
  }

  return to;
};

export const sendContactEmail = async (data: ContactFormData): Promise<void> => {
  const endpoint = getApiEndpoint("/contactanos");

  const body = {
    to: getContactRecipient(),
    subject: `Nuevo mensaje de contacto - ${data.asunto || "Reservify"}`,
    message: [
      "Nuevo mensaje desde el formulario de contacto de Reservify:",
      "",
      `Nombre: ${data.nombre}`,
      `Email: ${data.email}`,
      "",
      "Mensaje:",
      data.mensaje,
    ].join("\n"),
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      errorText || "No se pudo enviar el mensaje. Inténtalo de nuevo más tarde."
    );
  }
}

