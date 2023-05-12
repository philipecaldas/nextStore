import type { AppProps } from "next/app";
import { globalStyles } from "../styles/global";
import Image from "next/image";
import logoImg from "../assets/nextStore_logo.svg";
import { Container, Header } from "../styles/pages/app";

globalStyles();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Header>
        <div>
          <Image src={logoImg} alt="" />
          <h1>Next Store</h1>
        </div>
      </Header>
      <Component {...pageProps} />
    </Container>
  );
}
