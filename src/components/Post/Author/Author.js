// @flow
import React from 'react';
import { getContactHref } from '../../../utils';
import styles from './Author.module.scss';
import { useSiteMetadata } from '../../../hooks';

const Author = () => {
  const { author } = useSiteMetadata();

  return (
    <div className={styles['author']}>
      <p className={styles['author__bio']}>
        {author.bio}<br>
        Connect with me <a
          className={styles['author__bio-twitter']}
          href={getContactHref('twitter', author.contacts.twitter)}
          rel="https://twitter.com//inzamam_sahar"
          target="https://twitter.com//inzamam_sahar"
        >
        <strong>@{author.contacts.twitter}</strong>
        </a> on Twitter
      </p>
    </div>
  );
};

export default Author;
