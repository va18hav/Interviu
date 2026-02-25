import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

console.log("Loaded User:", `[${process.env.SMTP_USER}]`);
console.log("Loaded Pass:", `[${process.env.SMTP_PASS}]`);

const user = (process.env.SMTP_USER || '').trim();
const pass = (process.env.SMTP_PASS || '').replace(/^"|"$/g, '').trim();

console.log("Processed User:", `[${user}]`);
console.log("Processed Pass:", `[${pass}]`);

const transporterSSL = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: { user, pass }
});

const transporterTLS = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 587,
    secure: false, // TLS
    auth: { user, pass }
});

console.log("\nAttempting SSL (Port 465)...");
transporterSSL.verify((err, success) => {
    if (err) {
        console.error("SSL Failed:", err.message);
        console.log("\nAttempting STARTTLS (Port 587)...");
        transporterTLS.verify((err2, success2) => {
            if (err2) {
                console.error("STARTTLS Failed:", err2.message);
                console.log("\n❌ Authenticaton completely failed. Hostinger is rejecting the credentials.");
                process.exit(1);
            } else {
                console.log("✅ STARTTLS Success! We should use port 587.");
                process.exit(0);
            }
        });
    } else {
        console.log("✅ SSL Success! We should use port 465.");
        process.exit(0);
    }
});
