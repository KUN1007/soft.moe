export const GA = {
  head: [
    [
      'script',
      {
        async: true,
        src: `https://www.googletagmanager.com/gtag/js?id=${process.env.KUN_GOOGLE_ANALYTICS_ID}`,
      },
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', '${process.env.KUN_GOOGLE_ANALYTICS_ID}');`,
    ],
  ],
}
