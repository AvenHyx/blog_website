import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';
const NoFoundPage = (props) => {
  let { title, backHome, clickHome, isHide } = props

  return (
    <>
      <Result
        status={"404"}
        title={title}
        // subTitle={title}
        extra={
          <Button type="primary" onClick={clickHome && clickHome}>
            {backHome || "Back Home"}
          </Button>
        }
      />
    </>
  )
};

export default NoFoundPage;
