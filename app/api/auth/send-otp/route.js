import nodemailer from "nodemailer";
import { saveOtp } from "@/lib/otpStore";
import User from "@/models/User";
import connectDB from "@/lib/db";

export async function POST(req) {
  await connectDB(); // Ensure DB is connected

  try {
    const { email, type } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ message: "Email is required" }),
        { status: 400 }
      );
    }

    // If password reset, make sure user exists
    if (type === "reset") {
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        return new Response(
          JSON.stringify({ message: "No user found with this email" }),
          { status: 404 }
        );
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in memory store
    saveOtp(email.toLowerCase().trim(), otp, 5 * 60 * 1000); // expires in 5 minutes

    // Send OTP via Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: type === "reset" ? "Your Password Reset OTP" : "Your Registration OTP",
      text: `Your OTP code is: ${otp}`,
    });

    console.log(`✅ OTP sent to ${email}: ${otp}`);

    return new Response(
      JSON.stringify({ message: "OTP sent successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Send OTP Error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to send OTP" }),
      { status: 500 }
    );
  }
}
