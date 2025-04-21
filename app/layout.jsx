import "@/components/global.css";
import { ConfigProvider } from "antd";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SciPro",
  description: "Research Project Management Process",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigProvider
          theme={{
            token: {
              fontFamily: inter.style.fontFamily,
            },
          }}
        >
          <SessionProvider>{children}</SessionProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
