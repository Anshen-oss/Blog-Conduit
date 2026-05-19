import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? 'smtp.mailtrap.io',
      port: parseInt(process.env.SMTP_PORT ?? '587'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPasswordReset(email: string, resetUrl: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"Conduit Blog" <${process.env.SMTP_FROM ?? 'noreply@conduit.dev'}>`,
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Réinitialisation de mot de passe</h2>
            <p>Tu as demandé à réinitialiser ton mot de passe sur Conduit Blog.</p>
            <p>Clique sur le lien ci-dessous (valable <strong>1 heure</strong>) :</p>
            <a
              href="${resetUrl}"
              style="display:inline-block;padding:12px 24px;background:#5cb85c;color:white;text-decoration:none;border-radius:4px;"
            >
              Réinitialiser mon mot de passe
            </a>
            <p style="margin-top:24px;color:#666;font-size:14px;">
              Si tu n'as pas fait cette demande, ignore cet email.
              Ton mot de passe reste inchangé.
            </p>
          </div>
        `,
      });
      this.logger.log(`Email de reset envoyé à ${email}`);
    } catch (error) {
      this.logger.error(`Échec envoi email reset à ${email}`, error);
      // On ne throw pas — l'échec email ne doit pas bloquer la réponse API
    }
  }
}
