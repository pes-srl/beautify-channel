import type { Metadata } from "next";
import { Figtree, Montserrat } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: "Beautify Channel",
  description: "Next-gen audio streaming for beauty centers.",
  icons: {
    icon: "/favicon512x512.png",
    shortcut: "/favicon512x512.png",
    apple: "/favicon512x512.png",
  },
};

import { HeaderNew } from "@/components/homepagenew/HeaderNew";
import { FooterNew } from "@/components/homepagenew/FooterNew";
import { AuthHashCatcher } from "@/components/AuthHashCatcher";
import { Toaster } from "@/components/ui/sonner";
import { PresencePing } from "@/components/PresencePing";
import { AudioPlayer } from "@/components/player/AudioPlayer";

import { createClient } from "@/utils/supabase/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("salon_name, role, plan_type, store_license_url, store_contract_url")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <html lang="it">
      <head>
        {/* Iubenda Cookie Policy Configuration */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              var _iub = _iub || [];
              _iub.csConfiguration = {"siteId":3794300,"cookiePolicyId":66648110,"storage":{"useSiteId":true}};
              _iub.csLangConfiguration = {"it":{"cookiePolicyId":66648110}};
            `
          }}
        />
        <script type="text/javascript" src="https://cs.iubenda.com/autoblocking/3794300.js"></script>
        <script type="text/javascript" src="//cdn.iubenda.com/cs/tcf/stub-v2.js"></script>
        <script type="text/javascript" src="//cdn.iubenda.com/cs/tcf/safe-tcf-v2.js"></script>
        <script type="text/javascript" src="//cdn.iubenda.com/cs/gpp/stub.js"></script>
        <script type="text/javascript" src="//cdn.iubenda.com/cs/iubenda_cs.js" charSet="UTF-8" async></script>
      </head>
      <body
        className={`${figtree.variable} ${montserrat.variable} font-sans antialiased bg-zinc-950 text-zinc-50 flex flex-col min-h-screen`}
      >
        <AuthHashCatcher />
        {user && <PresencePing />}
        <HeaderNew initialUser={user} initialProfile={profile} />
        <div className="flex-1">
          {children}
        </div>
        <FooterNew />
        <AudioPlayer />
        <Toaster position="bottom-right" richColors theme="dark" />
      </body>
    </html>
  );
}
