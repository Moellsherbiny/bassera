import {
  Fira_Code as FontMono,
  IBM_Plex_Sans_Arabic,
} from "next/font/google";

export const fontSans = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});