// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });
import Image from "next/image";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { GetStaticProps } from "next";
import Stripe from "stripe";
import { stripe } from "../lib/stripe";
import { HomeContainer, Product } from "../styles/pages/home";

interface HomeProps {
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
  }[];
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({ slides: { perView: 3, spacing: 48 } });

  return (
    <HomeContainer ref={sliderRef} className="keen-slider">
      {products?.map((product) => (
        <Link href={`/product/${product.id}`} key={product.id}>
          <Product className="keen-slider__slide">
            {/* Add Blurhash to blur img before loaded */}
            <Image src={product.imageUrl} width={580} height={580} alt="" />
            <footer>
              <strong>{product.name}</strong>
              <span>{product.price}</span>
            </footer>
          </Product>
        </Link>
      ))}
    </HomeContainer>
  );
}

//getServerSideProps

export const getStaticProps: GetStaticProps = async () => {
  const res = await stripe.products.list({
    expand: ["data.default_price"],
  });

  const products = res.data.map((product) => {
    const usdCurrency = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    const price = product.default_price as Stripe.Price;

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: usdCurrency.format((price.unit_amount ?? 0) / 100),
    };
  });

  return {
    props: { products },
    revalidate: 180, // 3 min
  };
};
