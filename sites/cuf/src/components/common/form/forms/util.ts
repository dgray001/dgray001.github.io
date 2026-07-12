import { ContactFormData } from './contact_form/contact_form';

/** Creates HTML email from contact data */
export function createContactEmail(data: ContactFormData, contact_page = true) {
  const page_name = contact_page ? 'Contact Us' : 'Donate';
  const donate_message = contact_page
    ? ''
    : '<div><em>This email is not receipt of an actual donation. This email is sent when the user submits the donate form on CUF.org/donate. They will be redirected to authorize.net to complete their payment; authorize.net will send a receipt email if they complete the actual donation.</em></div>';

  let membership_html = '';
  if (data.membership) {
    membership_html += `
    <tr bgcolor="#EAF2FA">
      <td colspan="2">
        <font style="font-family: sans-serif; font-size:12px;"><strong>Membership Requests</strong></font>
      </td>
    </tr>
    <tr bgcolor="#FFFFFF">
      <td width="20">&nbsp;</td>
      <td>
        <font style="font-family: sans-serif; font-size:12px;">${data.membership.replaceAll(',', '<br />')}</font>
      </td>
    </tr>`;
  }
  return `
    <html>
      <head>
        <title>New submission from CUF.org - ${page_name} Page</title>
      </head>
      <body>
        ${donate_message}
        <table width="99%" border="0" cellpadding="1" cellspacing="0" bgcolor="#EAEAEA"><tr><td>
          <table width="100%" border="0" cellpadding="5" cellspacing="0" bgcolor="#FFFFFF">
          <tr bgcolor="#EAF2FA">
            <td colspan="2">
              <font style="font-family: sans-serif; font-size:12px;"><strong>Name</strong></font>
            </td>
          </tr>
          <tr bgcolor="#FFFFFF">
            <td width="20">&nbsp;</td>
            <td>
              <font style="font-family: sans-serif; font-size:12px;">${data.name}</font>
            </td>
          </tr>
          <tr bgcolor="#EAF2FA">
            <td colspan="2">
              <font style="font-family: sans-serif; font-size:12px;"><strong>Address</strong></font>
            </td>
          </tr>
          <tr bgcolor="#FFFFFF">
            <td width="20">&nbsp;</td>
            <td>
              <font style="font-family: sans-serif; font-size:12px;">${data.address.line1}<br />${data.address.line2}<br />${data.address.line3}<br/><a href='http://maps.google.com/maps?q=${data.address.line1}+${data.address.line2}+${data.address.line3}' target='_blank' class='map-it-link'>Map It</a></font>
            </td>
          </tr>
          <tr bgcolor="#EAF2FA">
            <td colspan="2">
              <font style="font-family: sans-serif; font-size:12px;"><strong>Phone</strong></font>
            </td>
          </tr>
          <tr bgcolor="#FFFFFF">
            <td width="20">&nbsp;</td>
            <td>
              <font style="font-family: sans-serif; font-size:12px;">${data.contact.phone}</font>
            </td>
          </tr>
          <tr bgcolor="#EAF2FA">
            <td colspan="2">
              <font style="font-family: sans-serif; font-size:12px;"><strong>Email</strong></font>
            </td>
          </tr>
          <tr bgcolor="#FFFFFF">
            <td width="20">&nbsp;</td>
            <td>
              <font style="font-family: sans-serif; font-size:12px;"><a href='mailto:${data.contact.email}'>${data.contact.email}</a></font>
            </td>
          </tr>
          <tr bgcolor="#EAF2FA">
            <td colspan="2">
              <font style="font-family: sans-serif; font-size:12px;"><strong>Message</strong></font>
            </td>
          </tr>
          <tr bgcolor="#FFFFFF">
            <td width="20">&nbsp;</td>
            <td>
              <font style="font-family: sans-serif; font-size:12px;">${data.message}</font>
            </td>
          </tr>
          ${membership_html}
          </table>
        </td></tr></table>
      </body>
    </html>`;
}
