import * as React from 'react';
import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';
// import { ServerStyleSheets } from '@mui/styles';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="sv">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// MyDocument.getInitialProps = async (ctx: DocumentContext) => {
//   const sheets = new ServerStyleSheets();
//   const originalRenderPage = ctx.renderPage;

//   ctx.renderPage = () =>
//     originalRenderPage({
//       enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
//     });

//   const initialProps = await Document.getInitialProps(ctx);

//   return {
//     ...initialProps,
//     // styles fragment is rendered after the app and page rendering finish.
//     styles: [
//       ...React.Children.toArray(initialProps.styles),
//       sheets.getStyleElement(),
//     ],
//   };
// };

export default MyDocument;
