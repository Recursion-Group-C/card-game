import {
  useSession,
  useSupabaseClient
} from '@supabase/auth-helpers-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Database } from '../utils/database.types';
import NavAvatar from './NavbarAvatar';

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();

  return (
    <div>
      <Head>
        <title>CARD GAME STADIUM</title>
        <meta
          name="description"
          content="CARD GAME STADIUM"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="navbar bg-base-300">
        <div className="navbar-start">
          <div className="dropdown">
            <label // eslint-disable-line jsx-a11y/label-has-associated-control
              tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
              className="btn-ghost btn lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-5"
                fill="none"
                viewBox="0 0 20 20"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
              className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-300 p-2 shadow"
            >
              <li>
                <Link href="/">HOME</Link>
              </li>
              <li>
                <Link href="/">PROFILE</Link>
              </li>
            </ul>
          </div>
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
            <h2 className="ml-2.5">CARD GAME STADIUM</h2>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/">HOME</Link>
            </li>
            <li>
              <Link href="/login">PROFILE</Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end">
          {!session ? (
            <Link href="/login">
              <button
                className="rounded-full border-white bg-base-300 px-6 py-2 text-white hover:bg-base-100"
                type="button"
              >
                <p className="text-lg">LOGIN</p>
              </button>
            </Link>
          ) : (
            <div className="dropdown dropdown-end">
              <label // eslint-disable-line jsx-a11y/label-has-associated-control
                tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
                className="btn-ghost btn-circle avatar btn"
              >
                <NavAvatar session={session} />
              </label>
              <ul
                tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
                className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
              >
                <li>
                  <Link href="/login">Profile</Link>
                </li>
                <li>
                  <Link href="/">Settings</Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    onClick={() => supabase.auth.signOut()}
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <main>{children}</main>

      {/* <footer className="!footer !footer-center bg-base-300 p-3 text-base-content">
      <div>
        <p>
          Copyright © 2023 - All right reserved by Recursion
        </p>
      </div>
    </footer> */}
    </div>
  );
};

export default Layout;
