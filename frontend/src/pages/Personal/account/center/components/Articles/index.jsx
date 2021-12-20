import React, { useEffect, useState } from 'react';
import { StarTwoTone, LikeOutlined, MessageFilled } from '@ant-design/icons';
import { useRequest, history } from 'umi';

import {
  List,
  // Tag 
} from 'antd';
import ArticleListContent from '../ArticleListContent';
import styles from './index.less';

const Articles = (props) => {
  const { listData } = props
  const IconText = ({ icon, text }) => (
    <span>
      {icon} {text}
    </span>
  ); // 获取tab列表数据


  /**
   * 跳转到博客详情
   * @param {*} id 博客id
   * @returns 
   */
  const clickToBlogDetail = id => history.push(`/blogDetail?blogId=${id}`)

  return (
    <List
      size="large"
      className={styles.articleList}
      rowKey="id"
      itemLayout="vertical"
      dataSource={listData || []}
      renderItem={(item) => (
        <List.Item
          key={item.id}
          actions={[
            <IconText key="message" icon={<MessageFilled />} text={item.commentAmount} />,
          ]}
        >
          <List.Item.Meta
            title={
              <div className={styles.listItemMetaTitle} onClick={() => {
                clickToBlogDetail(item.blogId)
              }} >
                {item.blogTitle}
              </div>
            }
          />
          <ArticleListContent data={item} />
        </List.Item>
      )}
    />
  );
};

export default Articles;
