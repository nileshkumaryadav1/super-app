// /api/auth/verify-otp
import { otpStore } from "@/lib/otpStore";
import connectDB from "@/lib/db";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "@/models/User";

export async function POST(req) {
  await connectDB();

  try {
    const { name, email, password, otp } = await req.json();

    if (!email || !otp) {
      return new Response(JSON.stringify({ message: "Email and OTP are required" }), { status: 400 });
    }

    // Check OTP validity
    const stored = otpStore[email.toLowerCase().trim()];
    if (!stored || stored.otp !== otp || stored.expires < Date.now()) {
      return new Response(JSON.stringify({ message: "Invalid or expired OTP" }), { status: 400 });
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return new Response(JSON.stringify({ message: "Email already registered" }), { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    // Remove OTP from memory
    delete otpStore[email.toLowerCase().trim()];

    // Send welcome email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Super Web App Team" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "🎉 Welcome to Super Web App!",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: auto; background: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #4CAF50;">Welcome, ${name}!</h2>
          <p>We’re thrilled to have you onboard. Here’s a quick overview of your account:</p>
          <ul>
            <li><b>Email:</b> ${email}</li>
          </ul>
          <p>Enjoy exploring and engaging with our platform!</p>
          <p style="margin-top: 20px;">Cheers,</p>
          <p><b>The Super Web App Team</b></p>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ message: "Registration successful", user }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
