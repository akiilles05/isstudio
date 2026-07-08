const SITE_URL = "https://isstudio.hu";
const LOGO_URL = `${SITE_URL}/logo-mark.png`;

function layout(bodyHtml: string) {
  return `<!DOCTYPE html>
<html lang="hu">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>I&amp;S Studio</title>
  </head>
  <body style="margin:0;padding:0;background-color:#07091c;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#07091c;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#0d1024;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:32px 40px 0 40px;">
                <img src="${LOGO_URL}" alt="I&amp;S Studio" width="50" height="28" style="display:block;margin-bottom:20px;" />
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px 40px 40px;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);">
                <p style="margin:0;font-size:12px;line-height:1.6;color:#5e7090;">
                  I&amp;S Studio &middot; Győr &amp; Budapest, Magyarország<br />
                  <a href="mailto:hello@isstudio.hu" style="color:#5e7090;">hello@isstudio.hu</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function iconBadge(color: string, bg: string, border: string, pathHtml: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
    <tr>
      <td width="40" height="40" style="width:40px;height:40px;border-radius:50%;background-color:${bg};border:1px solid ${border};text-align:center;vertical-align:middle;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;">${pathHtml}</svg>
      </td>
    </tr>
  </table>`;
}

function button(href: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px;">
    <tr>
      <td style="border-radius:8px;background-color:#4c7cf8;">
        <a href="${href}" style="display:inline-block;padding:13px 26px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">${label}</a>
      </td>
    </tr>
  </table>`;
}

export function bookingConfirmationEmail(params: { name: string; dateFormatted: string; duration: number }) {
  const { name, dateFormatted, duration } = params;
  return layout(`
    ${iconBadge("#22c55e", "rgba(34,197,94,0.1)", "rgba(34,197,94,0.28)", '<polyline points="20 6 9 17 4 12"></polyline>')}
    <p style="margin:0 0 4px 0;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#4c7cf8;">Foglalás megerősítve</p>
    <h1 style="margin:0 0 20px 0;font-size:24px;line-height:1.3;font-weight:800;letter-spacing:-0.02em;color:#eef2ff;">Szia ${name}!</h1>
    <p style="margin:0 0 24px 0;font-size:15px;line-height:1.7;color:#a8b4d0;">
      A konzultációs időpontod sikeresen lefoglalva. Az alábbi adatokkal számolj:
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(76,124,248,0.06);border:1px solid rgba(76,124,248,0.2);border-radius:12px;">
      <tr>
        <td style="padding:20px 22px;">
          <p style="margin:0 0 6px 0;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#7080a8;">Időpont</p>
          <p style="margin:0 0 16px 0;font-size:17px;font-weight:700;color:#eef2ff;">${dateFormatted}</p>
          <p style="margin:0 0 6px 0;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#7080a8;">Időtartam</p>
          <p style="margin:0;font-size:15px;color:#c0ccea;">${duration} perc &middot; Google Meet / telefon</p>
        </td>
      </tr>
    </table>
    <p style="margin:24px 0 0 0;font-size:14px;line-height:1.7;color:#7080a8;">
      Hamarosan emailben jelentkezünk a hívás pontos részleteivel. Ha közben módosítanod kell, válaszolj erre a levélre.
    </p>
    ${button(SITE_URL, "Vissza a weboldalra")}
  `);
}

export function bookingAdminNotificationEmail(params: {
  name: string;
  email: string;
  note: string | null;
  dateFormatted: string;
  duration: number;
}) {
  const { name, email, note, dateFormatted, duration } = params;
  return layout(`
    ${iconBadge("#4c7cf8", "rgba(76,124,248,0.1)", "rgba(76,124,248,0.28)", '<rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M3 10h18"></path><path d="M8 2v4"></path><path d="M16 2v4"></path>')}
    <p style="margin:0 0 4px 0;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#22c55e;">Új foglalás</p>
    <h1 style="margin:0 0 20px 0;font-size:24px;line-height:1.3;font-weight:800;letter-spacing:-0.02em;color:#eef2ff;">${name} lefoglalt egy időpontot</h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;">
      <tr>
        <td style="padding:20px 22px;">
          <p style="margin:0 0 6px 0;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#7080a8;">Időpont</p>
          <p style="margin:0 0 16px 0;font-size:17px;font-weight:700;color:#eef2ff;">${dateFormatted} &middot; ${duration} perc</p>
          <p style="margin:0 0 6px 0;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#7080a8;">Kapcsolat</p>
          <p style="margin:0 0 16px 0;font-size:15px;color:#c0ccea;">${name} &middot; <a href="mailto:${email}" style="color:#90b0ff;">${email}</a></p>
          ${note ? `<p style="margin:0 0 6px 0;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#7080a8;">Megjegyzés</p><p style="margin:0;font-size:14px;line-height:1.6;color:#c0ccea;">${note}</p>` : ""}
        </td>
      </tr>
    </table>
    ${button(`${SITE_URL}/admin/booking`, "Megnyitás az adminban")}
  `);
}
