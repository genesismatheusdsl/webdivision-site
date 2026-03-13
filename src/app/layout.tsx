import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="site-bg-motion" />
        <div className="grid-overlay" />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}