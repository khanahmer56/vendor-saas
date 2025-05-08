import Header from "@/components/shared/Header";
import "./global.css";
import { Poppins, Roboto } from "next/font/google";
import Providers from "@/Providers";

export const metadata = {
  title: "E Cart",
  description: "Cart Application",
};
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
        <Header />
        <body className={`${poppins.variable} ${roboto.variable}`}>
          {children}
        </body>
      </Providers>
    </html>
  );
}
