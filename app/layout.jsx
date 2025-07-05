import "@/components/global.css";
import { App, ConfigProvider } from "antd";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "SciPro",
  description: "Research Project Management Process",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
      </head>
      <body className={inter.className}>
        <ConfigProvider
          theme={{
            token: {
              fontFamily: inter.style.fontFamily,
            },
          }}
        >
          <SessionProvider>
            <App>{children}</App>
          </SessionProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
