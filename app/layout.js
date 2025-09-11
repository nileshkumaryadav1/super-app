import "./globals.css";
import Navbar from "../components/navigation/Navbar";

export const metadata = {
  title: "Super App",
  description: "AI + Chat + News + Blog Super Web App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
