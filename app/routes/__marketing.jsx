import { Outlet } from "@remix-run/react";

import marketingStyles from "~/styles/marketing.css";
import MainHeader from "~/components/navigation/MainHeader";
import { getUserFromSession } from "../data/auth.server";

export default function MarketingAppLayout() {
  return (
    <>
      <MainHeader />
      <Outlet />;
    </>
  );
}

export function loader({ request }) {
  return getUserFromSession(request)
}

export function links() {
  return [{ rel: "stylesheet", href: marketingStyles }];
}

export function headers() {
  return {
    'Cache-Control': 'max-age=3600' // 60 minutes
  }
}