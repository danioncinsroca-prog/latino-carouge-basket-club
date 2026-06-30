## LATINO CAROUGE BASKET CLUB

Landing bilingüe FR/ES en Next.js para el club, con home deportiva, secciones stub y soporte para conectar un calendario compartido de partidos.

## Getting Started

1. Instala dependencias:

```bash
npm install
```

2. Si quieres alimentar los partidos desde un calendario ICS, crea `.env.local`:

```bash
INFOMANIAK_CALENDAR_ICS_URL=https://tu-feed-publico.ics
```

3. Arranca el servidor:

```bash
npm run dev -- --port 3024
```

4. Abre:

```text
http://127.0.0.1:3024/fr
http://127.0.0.1:3024/es
```

## Calendar Feed

- La web usa `INFOMANIAK_CALENDAR_ICS_URL` o `CALENDAR_ICS_URL` como feed ICS.
- Si no hay URL configurada o el feed falla, la UI mantiene los partidos manuales definidos en `src/lib/site.ts`.
- La home usa los 3 próximos partidos como preview y la página de partidos muestra el calendario completo resuelto.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
