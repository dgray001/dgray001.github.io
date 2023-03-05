export {};

const {version} = await import(`./version.js?v=${Math.floor(Date.now() / 86400000)}`);

await import(`../__components/header/header.js?v=${version}`);
await import(`../__components/footer_contact/footer_contact.js?v=${version}`);
await import(`../__components/sidebar/sidebar.js?v=${version}`);
await import(`../__components/content_card/content_card.js?v=${version}`);
