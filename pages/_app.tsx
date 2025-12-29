import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";

type AppPropsWithSession = AppProps<{
  session: Session | null;
}>;

const App = ({ Component, pageProps }: AppPropsWithSession) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default App;

// import { SessionProvider } from "next-auth/react";
// import { AppProps } from "next/app";

// const App = ({ Component, pageProps }: AppProps) => {
//   return (
//     <SessionProvider session={pageProps.session}>
//       <Component {...pageProps} />
//     </SessionProvider>
//   );
// };

// export default App;
