import { ProfileOutlined, SettingOutlined, UserOutlined, PlusOutlined, HomeOutlined, ContactsOutlined, ClusterOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Divider, Input, Row, Tag } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Link, useRequest, history } from 'umi';
import forkUser from './components/ForkPerson';
import Articles from './components/Articles';
import styles from './Center.less';
import cls from 'classnames'
import Settings from './components/Settings'
import Admin from './components/Admin'
import *as apis from '@/services/ant-design-pro/api'

const currentUser = {
  name: 'Serati Ma',
  avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
  userid: '00000001',
  email: 'antdesign@alipay.com',
  signature: '海纳百川，有容乃大',
  title: '交互专家',
  group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
  tags: [
    {
      key: '0',
      label: '很有想法的',
    },
    {
      key: '1',
      label: '专注设计',
    },
    {
      key: '2',
      label: '辣~',
    },
    {
      key: '3',
      label: '大长腿',
    },
    {
      key: '4',
      label: '川妹子',
    },
    {
      key: '5',
      label: '海纳百川',
    },
  ],
  notifyCount: 12,
  unreadCount: 11,
  country: 'China',
  // access: getAccess(),
  geographic: {
    province: {
      label: '浙江省',
      key: '330000',
    },
    city: {
      label: '杭州市',
      key: '330100',
    },
  },
  address: '西湖区工专路 77 号',
  phone: '0752-268888888',
}


const menuList = [
  {
    menuId: 0,
    menuType: "blog",
    menuName: "博客中心"
  },
  {
    menuId: 1,
    menuType: "settings",
    menuName: "设置中心"
  },
  {
    menuId: 2,
    menuType: "admin",
    menuName: "管理中心"
  }
]

const IconMap = {
  "blog": <ProfileOutlined />,
  "settings": <SettingOutlined />,
  "admin": <UserOutlined />
}


const loading = false;



const Center = () => {
  const [tabKey, setTabKey] = useState('articles'); //  获取用户信息
  const [current, setCurrent] = useState(0) //当前高亮的tab
  const [personInfo, setPersonInfo] = useState({}) //个人中心信息

  useEffect(async () => {
    try {
      let res = await apis.getPersonalCenter()
      if (res && res?.businessCode * 1 === 1000) {
        setPersonInfo(res.content)
      }
    } catch (error) {

    }

  }, [])

  const renderUserInfo = ({ title, group, geographic }) => {
    return (
      <div className={styles.detail}>
        <p>
          <ContactsOutlined
            style={{
              marginRight: 8,
            }}
          />
          {title}
        </p>
        <p>
          <ClusterOutlined
            style={{
              marginRight: 8,
            }}
          />
          {group}
        </p>
        <p>
          <HomeOutlined
            style={{
              marginRight: 8,
            }}
          />
          {
            (
              geographic || {
                province: {
                  label: '',
                },
              }
            ).province.label
          }
          {
            (
              geographic || {
                city: {
                  label: '',
                },
              }
            ).city.label
          }
        </p>
      </div>
    );
  }; // 渲染tab切换


  //切换tab
  const clickToUrl = (_index, _item) => {
    let { menuType } = _item
    setCurrent(_index)
    switch (menuType) {
      case "blog":
        return renderBlog()
      case "settings":
        // history.push('/setting')
        return <><Settings /></>

      default:
        break
    }
  }

  /**博客 */
  const renderBlog = () => {

    return <Card
      className={styles.tabsCard}
      bordered={false}
      tabList={operationTabList}
      activeTabKey={tabKey}
      onTabChange={(_tabKey) => {
        setTabKey(_tabKey);
      }}
    >
      {renderChildrenByTabKey(tabKey)}
    </Card>
  }

  const renderTabs = () => {
    const { active } = styles
    return (
      <div className={styles.tabStyle}>
        {personInfo.asideMenu.map((_item, _index) => {
          let { menuId, menuName, menuType } = _item
          return (
            <p onClick={() => {
              clickToUrl(_index, _item)
            }} key={menuId} className={cls(current == _index ? active : null)}>
              {IconMap[menuType]}
              <span style={{
                marginLeft: 8,
              }}>{menuName}</span>
            </p>
          )
        })}

      </div>
    );
  }
  const renderChildrenByTabKey = (tabValue) => {
    switch (tabValue) {
      case "articles":
        return <Articles listData={personInfo.myBlogList} />;
      case "fork":
        return <forkUser listData={personInfo.forkList} />;
      case "follow":
        return <forkUser listData={personInfo.followerList} />;
      default:
        break;
    }

    // if (tabValue === 'articles') {

    //   return <Articles listData={personInfo.myBlogList} />;
    // }
    // if (tabValue === 'projects') {
    //   return <Projects />;
    // }

    // if (tabValue === 'applications') {
    //   return <Applications />;
    // }



    return null;
  };

  console.log(personInfo, ">>>>personInfo")

  if (!Object.keys(personInfo).length) {


    return null
  }

  const operationTabList = [
    {
      key: 'articles',
      tab: (
        <span>
          博客文章
          <span
            style={{
              fontSize: 14,
            }}
          >
            {`(${personInfo?.myBlogList?.length})` || ""}
          </span>
        </span>
      ),
    },
    {
      key: 'fork',
      tab: (
        <span>
          关注者
          <span
            style={{
              fontSize: 14,
            }}
          >
            {`(${personInfo?.forkList?.length})` || ""}
          </span>
        </span>
      ),
    },
    {
      key: 'follow',
      tab: (
        <span>
          粉丝
          <span
            style={{
              fontSize: 14,
            }}
          >
            {`(${personInfo?.followerList?.length})` || ""}
          </span>
        </span>
      ),
    },
  ];

  return (
    <GridContent>
      <Row gutter={24}>
        <Col lg={7} md={24}>
          <Card
            bordered={false}
            style={{
              marginBottom: 24,
            }}
            loading={loading}
          >
            {!loading && currentUser && (
              <div>
                <div className={styles.avatarHolder}>
                  <img alt="" src={currentUser.avatar} />
                  <div className={styles.name}>{currentUser.name}</div>
                  <div>{currentUser?.signature}</div>
                </div>
                {renderUserInfo(currentUser)}
                {/* <Divider dashed /> */}
                {/* <TagList tags={currentUser.tags || []} /> */}
                {/* <Divider
                  style={{
                    marginTop: 16,
                  }}
                  dashed
                /> */}


              </div>
            )}
          </Card>
          {
            personInfo.asideMenu.length ? <div className={styles.team}>
              {renderTabs()}
            </div> : null
          }
        </Col>
        <Col lg={17} md={24}>
          {current == 0 && renderBlog()}
          {current == 1 && <Settings />}
          {current == 2 && <Admin />}
        </Col>
      </Row>

    </GridContent>
  );
};

export default Center;
