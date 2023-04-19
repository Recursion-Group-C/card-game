import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => (
  <div>
    <Head>
      <title>Card Game Stadium</title>
      <meta
        name="description"
        content="Card Game Stadium"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link
          href="/"
          className="btn-ghost btn text-xl normal-case"
        >
          <Image
            src="/images/logo.png"
            width={50}
            height={50}
            alt="logo"
          />
          <h2 className="ml-2.5">Card Game Stadium</h2>
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {/* <li>
            <a>Item 1</a>
          </li>
          <li>
            <a>Item 2</a>
          </li> */}
        </ul>
      </div>
    </div>

    <main>{children}</main>

    <footer className="!footer !footer-center bg-base-300 p-3 text-base-content">
      <div>
        <p>
          Copyright © 2023 - All right reserved by Recursion
        </p>
      </div>
    </footer>
  </div>
);
export default Layout;
