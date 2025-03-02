import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta itemProp="type" property="og:type" content="website" />
        </Head>
        <body className='m-0 w-full h-full flex flex-wrap items-center justify-center'>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
