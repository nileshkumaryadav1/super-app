import "./globals.css";
import Navbar from "../components/navigation/Navbar";

export const metadata = {
  title: "Super App",
  description: "AI + Chat + News + Blog Super Web App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Navbar />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
