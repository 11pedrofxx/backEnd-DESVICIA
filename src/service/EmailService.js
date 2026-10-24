import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_HOST,
    port: Number(process.env.BREVO_PORT),
    secure: false,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS
    }
});

export async function enviarEmailCodigo(emailDestino, codigo) {

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #15499C; text-align: center;">DesVicia</h2>
            <p>Olá!</p>
            <p>Seu código de verificação para confirmar a criação da sua conta é:</p>
            <div style="background-color: #f4f6f9; padding: 15px; text-align: center; border-radius: 6px; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #15499C;">${codigo}</span>
            </div>
            <p style="font-size: 13px; color: #665;">Este código expira em <strong>15 minutos</strong>. Se você não solicitou este cadastro, desconsidere este e-mail.</p>
        </div>
    `;

    await transporter.sendMail({
        from: '"DesVicia" <desviciaa@gmail.com>',
        to: emailDestino,
        subject: 'Código de Confirmação - DesVicia',
        html: html
    });
}