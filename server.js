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
  const { name, email, phone, alternate_phone, message } = req.body;

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,   // Store in Render environment
        pass: process.env.GMAIL_PASS    // Store in Render environment
      }
    });

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

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error sending message" });
  }
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
