import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ApplicationPayload = {
  whyOutlfy: string;
  founderInsight: string;
  strategyPillars: string;
  workLinks: string;
  strategyLink: string;
  availability: string;
  accountability: string;
  name: string;
  email: string;
  phone: string;
  documentLink: string;
  loomLink?: string;
};

const REQUIRED_FIELDS: Array<keyof ApplicationPayload> = [
  "whyOutlfy",
  "founderInsight",
  "strategyPillars",
  "workLinks",
  "strategyLink",
  "availability",
  "accountability",
  "name",
  "email",
  "phone",
  "documentLink",
];

const REQUIRED_ENV_VARS = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"] as const;

const buildHtml = (payload: ApplicationPayload) => `
  <h2>Outlfy Internship Application</h2>
  <p><strong>Name:</strong> ${payload.name}</p>
  <p><strong>Email:</strong> ${payload.email}</p>
  <p><strong>Phone:</strong> ${payload.phone}</p>
  <p><strong>Why Outlfy / Desired Outcome:</strong><br/>${payload.whyOutlfy}</p>
  <p><strong>Insight from Presentation:</strong><br/>${payload.founderInsight}</p>
  <p><strong>Expansion & Outreach Pillars:</strong><br/>${payload.strategyPillars}</p>
  <p><strong>Portfolio / Work Links:</strong><br/>${payload.workLinks}</p>
  <p><strong>Strategy Deck Link:</strong><br/>${payload.strategyLink}</p>
  <p><strong>Availability & Timezone:</strong><br/>${payload.availability}</p>
  <p><strong>Remote Accountability Approach:</strong><br/>${payload.accountability}</p>
  <p><strong>CV + Strategy Document Link:</strong><br/>${payload.documentLink}</p>
  <p><strong>Optional Loom / Notion Link:</strong><br/>${payload.loomLink || "N/A"}</p>
`;

const buildText = (payload: ApplicationPayload) =>
  [
    "Outlfy Internship Application",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    "",
    `Why Outlfy / Desired Outcome:\n${payload.whyOutlfy}`,
    `Insight from Presentation:\n${payload.founderInsight}`,
    `Expansion & Outreach Pillars:\n${payload.strategyPillars}`,
    `Portfolio / Work Links:\n${payload.workLinks}`,
    `Strategy Deck Link:\n${payload.strategyLink}`,
    `Availability & Timezone:\n${payload.availability}`,
    `Remote Accountability Approach:\n${payload.accountability}`,
    `CV + Strategy Document Link:\n${payload.documentLink}`,
    `Optional Loom / Notion Link:\n${payload.loomLink || "N/A"}`,
  ].join("\n\n");

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<ApplicationPayload>;

    if (!payload || typeof payload !== "object") {
      return NextResponse.json(
        { error: "Invalid application payload." },
        { status: 400 }
      );
    }

    const missingFields = REQUIRED_FIELDS.filter((field) => {
      const value = payload?.[field];
      return !value || (typeof value === "string" && !value.trim());
    });

    if (missingFields.length) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const sanitizedPayload = payload as ApplicationPayload;

    const missingEnv = REQUIRED_ENV_VARS.filter((envKey) => !process.env[envKey]);

    if (missingEnv.length) {
      console.error("SMTP configuration is incomplete", missingEnv);
      return NextResponse.json(
        { error: "Email configuration is missing on the server." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE !== "false" : true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const envRecipients = process.env.APPLICATION_TARGET_EMAIL
      ?.split(",")
      .map((email) => email.trim())
      .filter(Boolean);
    const toAddress = envRecipients && envRecipients.length ? envRecipients : "info@outlfy.com";
    const fromAddress = process.env.SMTP_FROM || (process.env.SMTP_USER as string);

    await transporter.sendMail({
      from: `Outlfy Careers <${fromAddress}>`,
      to: toAddress,
      replyTo: sanitizedPayload.email,
      subject: `New Internship Application - ${sanitizedPayload.name}`,
      text: buildText(sanitizedPayload),
      html: buildHtml(sanitizedPayload),
    });

    return NextResponse.json({ message: "Application sent successfully." });
  } catch (error) {
    console.error("Failed to send internship application", error);
    return NextResponse.json(
      { error: "Failed to send application. Please try again later." },
      { status: 500 }
    );
  }
}
