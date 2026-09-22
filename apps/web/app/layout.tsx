import "./globals.css";
import { EmailLinkReceiver } from "./email-link-receiver";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Estúdio Criativo",
  description: "Seu espaço de criação.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="pt-BR"><body><EmailLinkReceiver>{children}</EmailLinkReceiver></body></html>;
}
