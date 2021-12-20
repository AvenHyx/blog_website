import { Avatar } from 'antd';
import React from 'react';
import moment from 'moment';
import styles from './index.less';
import { defaultImg, htmlToText } from '@/utils/utils';

const ArticleListContent = ({ data: { createTime, blogContent, avatar, owner, href } }) => (
  <div className={styles.listContent} >
    <div className={styles.description} >{htmlToText(blogContent)}</div>
    <div className={styles.extra}>
      <Avatar src={avatar || defaultImg} size="small" />
      发布在
      <em>{createTime}</em>
    </div>
  </div>
);

export default ArticleListContent;
