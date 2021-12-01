import React from 'react';
import styles from './index.less'
import { IconFont, Button } from 'antd'
import { UserOutlined, HeartOutlined, StarOutlined, PlusOutlined } from '@ant-design/icons';
import cls from 'classnames'


const defaultImg = "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
export default () => {
    const { blogContainer, blogSide,
        userCard, avatarImg, avatarHolder,
        userInfoStyle, userNameStyle,
        createTimeStyle, blogRightCenter, antCenterName, mt_12, mr_8, flexRow,
        article_title,
        infoStyle,
        blogContentStyle
    } = styles
    const IconStyle = {
        fontSize: 20,
        marginRight: 8
    }
    return <div className={blogContainer}>

        <div className={blogSide}>
            <div className={userCard}>
                <div className={avatarHolder}>
                    <img alt="" className={avatarImg} src={defaultImg} />
                    <div className={antCenterName}>Serati Ma</div><div>加入时间：2021-11-30</div>
                </div>
                <div style={{ textAlign: "center" }}>
                    <Button type="primary" shape="round" style={{ backgroundColor: "#0e5fc9", textAlign: "center" }} icon={<PlusOutlined style={{ fontSize: 16 }} />} size={18}>
                        关注
                    </Button>
                </div>

                <div className={userInfoStyle}>
                    <div className={mt_12}>
                        <UserOutlined style={IconStyle} />
                        <span >身份--管理员？</span>
                    </div>
                    <div className={mt_12}>
                        <HeartOutlined style={IconStyle} />
                        <span >关注</span>
                    </div>
                    <div className={cls([mt_12, flexRow])}>
                        <StarOutlined style={IconStyle} />
                        <span>粉丝</span>
                    </div>

                </div>

            </div>
        </div>
        <div className={blogRightCenter}>
            <h1 className={article_title}>
                一名【合格】前端工程师的自检清单
            </h1>
            <div className={infoStyle}>
                <img src={defaultImg} alt="" style={{
                    width: 20, height: 20, marginRight: 4, verticalAlign: "middle"
                }} />
                <span className={mr_8} style={{ fontSize: 12 }}>用户昵称</span>
                <span style={{ fontSize: 12 }}>创建时间</span>
            </div>
            <div className={blogContentStyle}>
                前端开发是一个非常特殊的行业，它的历史实际上不是很长，但是知识之繁杂，技术迭代速度之快是其他技术所不能比拟的。
                前端开发是一个非常特殊的行业，它的历史实际上不是很长，但是知识之繁杂，技术迭代速度之快是其他技术所不能比拟的。
                前端开发是一个非常特殊的行业，它的历史实际上不是很长，但是知识之繁杂，技术迭代速度之快是其他技术所不能比拟的。
                前端开发是一个非常特殊的行业，它的历史实际上不是很长，但是知识之繁杂，技术迭代速度之快是其他技术所不能比拟的。
            </div>

        </div>

    </div>
}
