const SITE_URL = "https://isstudio.hu";
const LOGO_URL = `${SITE_URL}/logo-mark-navy.png`;

const NAVY = "#0d3b66";
const ACCENT = "#2e8cb2";
const INK = "#1f2933";
const MUTED = "#65758a";
const BORDER = "#e6ebf1";
const SURFACE = "#f6f8fb";

function layout(bodyHtml: string) {
  return `<!DOCTYPE html>
<html lang="hu">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>I&amp;S Studio</title>
  </head>
  <body style="margin:0;padding:0;background-color:${SURFACE};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${SURFACE};padding:48px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border:1px solid ${BORDER};border-radius:20px;overflow:hidden;box-shadow:0 2px 10px rgba(13,59,102,0.05);">
            <tr>
              <td style="padding:36px 44px 28px 44px;border-bottom:1px solid ${BORDER};">
                <img src="${LOGO_URL}" alt="I&amp;S Studio" width="36" height="20" style="display:block;" />
              </td>
            </tr>
            <tr>
              <td style="padding:40px 44px;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:24px 44px;background-color:${SURFACE};border-top:1px solid ${BORDER};">
                <p style="margin:0;font-size:12.5px;line-height:1.7;color:${MUTED};">
                  I&amp;S Studio &middot; Győr &amp; Budapest, Magyarország<br />
                  <a href="mailto:hello@isstudio.hu" style="color:${ACCENT};text-decoration:none;">hello@isstudio.hu</a>
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
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
    <tr>
      <td width="44" height="44" style="width:44px;height:44px;border-radius:50%;background-color:${bg};border:1px solid ${border};text-align:center;vertical-align:middle;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;">${pathHtml}</svg>
      </td>
    </tr>
  </table>`;
}

function eyebrow(color: string, label: string) {
  return `<p style="margin:0 0 8px 0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${color};">${label}</p>`;
}

function field(label: string, valueHtml: string, last = false) {
  return `<tr>
    <td style="padding:${last ? "0" : "0 0 16px 0"};">
      <p style="margin:0 0 4px 0;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${MUTED};">${label}</p>
      <div style="font-size:15px;line-height:1.6;color:${INK};">${valueHtml}</div>
    </td>
  </tr>`;
}

function button(href: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:32px;">
    <tr>
      <td style="border-radius:9px;background-color:${ACCENT};">
        <a href="${href}" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:9px;">${label}</a>
      </td>
    </tr>
  </table>`;
}

export function bookingConfirmationEmail(params: { name: string; dateFormatted: string; duration: number; videoUrl: string }) {
  const { name, dateFormatted, duration, videoUrl } = params;
  return layout(`
    ${iconBadge("#22c55e", "rgba(34,197,94,0.1)", "rgba(34,197,94,0.25)", '<polyline points="20 6 9 17 4 12"></polyline>')}
    ${eyebrow(ACCENT, "Foglalás megerősítve")}
    <h1 style="margin:0 0 16px 0;font-size:25px;line-height:1.3;font-weight:800;letter-spacing:-0.02em;color:${NAVY};">Szia ${name}!</h1>
    <p style="margin:0 0 28px 0;font-size:15px;line-height:1.75;color:${MUTED};">
      A konzultációs időpontod sikeresen lefoglaltuk. Az alábbi adatokkal számolj &mdash; egy naptárbejegyzést is csatoltunk ehhez a levélhez.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${SURFACE};border:1px solid ${BORDER};border-radius:14px;">
      <tr>
        <td style="padding:24px 26px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${field("Időpont", `<strong style="font-weight:700;color:${NAVY};">${dateFormatted}</strong>`)}
            ${field("Időtartam", `${duration} perc &middot; ingyenes videóhívás, időkorlát nélkül`, true)}
          </table>
        </td>
      </tr>
    </table>
    <p style="margin:28px 0 0 0;font-size:14px;line-height:1.75;color:${MUTED};">
      A hívás időpontjában ezen a linken tudsz csatlakozni, nincs szükség regisztrációra vagy alkalmazás telepítésére. Ha közben módosítanod kell, válaszolj erre a levélre.
    </p>
    ${button(videoUrl, "Csatlakozás a videóhíváshoz")}
  `);
}

export function bookingAdminNotificationEmail(params: {
  name: string;
  email: string;
  note: string | null;
  dateFormatted: string;
  duration: number;
  videoUrl: string;
}) {
  const { name, email, note, dateFormatted, duration, videoUrl } = params;
  return layout(`
    ${iconBadge(ACCENT, "rgba(46,140,178,0.1)", "rgba(46,140,178,0.25)", '<rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M3 10h18"></path><path d="M8 2v4"></path><path d="M16 2v4"></path>')}
    ${eyebrow("#22c55e", "Új foglalás")}
    <h1 style="margin:0 0 24px 0;font-size:25px;line-height:1.3;font-weight:800;letter-spacing:-0.02em;color:${NAVY};">${name} lefoglalt egy időpontot</h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${SURFACE};border:1px solid ${BORDER};border-radius:14px;">
      <tr>
        <td style="padding:24px 26px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${field("Időpont", `<strong style="font-weight:700;color:${NAVY};">${dateFormatted}</strong> &middot; ${duration} perc`)}
            ${field("Kapcsolat", `${name} &middot; <a href="mailto:${email}" style="color:${ACCENT};text-decoration:none;">${email}</a>`)}
            ${note ? field("Megjegyzés", note) : ""}
            ${field("Videóhívás", `<a href="${videoUrl}" style="color:${ACCENT};text-decoration:none;">${videoUrl}</a>`, true)}
          </table>
        </td>
      </tr>
    </table>
    ${button(`${SITE_URL}/admin/booking`, "Megnyitás az adminban")}
  `);
}
