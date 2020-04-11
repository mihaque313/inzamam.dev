// @flow
import React from 'react';
import Helmet from 'react-helmet';
import type { Node as ReactNode } from 'react';
import styles from './Layout.module.scss';

type Props = {
  children: ReactNode,
  title: string,
  description?: string
};

const Layout = ({ children, title, description }: Props) => (
  <div className={styles.layout}>
    <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:site_name" content={title} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <!-- Global site tag (gtag.js) - Google Analytics -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-100765023-2"></script>
      <script>
         window.dataLayer = window.dataLayer || [];
           function gtag(){dataLayer.push(arguments);}
           gtag('js', new Date());

         gtag('config', 'UA-100765023-2');
      </script>

    </Helmet>
    {children}
  </div>
);

export default Layout;
