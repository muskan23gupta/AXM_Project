const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(cors());

app.use(cors({
  origin: [
    "https://axmbearing.in",
    "https://www.axmbearing.in"
  ]
}));

app.get("/", (req, res) => {
  res.send("AXM backend is running");
});

// Route for sending email
app.post("/send", async (req, res) => {
  console.log("POST /send received");
  console.log("Form data received:", {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    alternate_phone: req.body.alternate_phone,
    message: req.body.message
  });

  const { name, email, phone, alternate_phone, message } = req.body;

  try {
    console.log("GMAIL_USER exists:", !!process.env.GMAIL_USER);
    console.log("GMAIL_PASS exists:", !!process.env.GMAIL_PASS);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    console.log("Attempting to send email...");

    const mailOptions = {
      from: process.env.GMAIL_USER,
      replyTo: email,
      to: "axiombearing@gmail.com",
      subject: "New Contact Form Message",
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone}
Alternate Phone: ${alternate_phone || "Not provided"}
Message: ${message}
      `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");
    console.log("Message ID:", info.messageId);

    res.json({
      success: true,
      message: "Message sent successfully!"
    });

  } catch (error) {
    console.error("EMAIL SEND FAILED");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("SMTP response:", error.response);

    res.status(500).json({
      success: false,
      message: "Error sending message"
    });
  }
});
const PORT = process.env.PORT || 5500;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
