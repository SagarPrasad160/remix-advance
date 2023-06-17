import { redirect } from "@remix-run/node";

import AuthForm from "~/components/auth/AuthForm";
import authStyles from "~/styles/auth.css";
import { login, signup } from "../../data/auth.server";
import { validateCredentials } from "../../data/validation.server";

export default function Auth() {
  return <AuthForm />;
}

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const authMode = searchParams.get("mode") || "login";

  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);
  try {
    validateCredentials(credentials);
  } catch (error) {
    return error
  }

  try {
    if (authMode === "login") {
      return await login(credentials);
    } else {
      return await signup(credentials);
    }
  } catch (error) {
    if (error.status === 422) {
      return { credentials: error.message }
    }
  }

}



export function links() {
  return [
    {
      rel: "stylesheet",
      href: authStyles,
    },
  ];
}

export function headers({ actionHeader, loaderHeaders, parentHeaders }) {
  return {
    'Cache-Control': parentHeaders.get('Cache-Control')
  }
}