import React, {
    useEffect, useState
} from 'react'
import { useHistory } from 'react-router-dom'
import { Tag } from 'antd'
import styles from './index.less'
import { categoryList } from './data'
import { List, Avatar, Space } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import cls from 'classnames'
export default () => {
    const history = useHistory()
    const [currentIndex, setCurrentIndex] = useState(0)
    const {
        homeContainer,
        rightContent,
        asideStyle,
        asideItem,
        active,
        blogCenter,
        blogTitleStyle
    } = styles

    const handleTagClick = (index) => {
        setCurrentIndex(index)
    }

    const handleClickBlogDetail = (item) => {
        history.push('/blogDetail')
    }

    return <div className={homeContainer}>
        <div className={asideStyle}>
            {
                categoryList.map((_item, _index) => {
                    let { tagName } = _item
                    return <div key={_index} onClick={() => { handleTagClick(_index) }} className={cls([asideItem, currentIndex == _index ? active : null])}>{tagName}</div>
                })
            }
        </div>
        <div className={rightContent}>
            <div className={blogCenter}>
                <List
                    itemLayout="vertical"
                    size="large"

                    dataSource={categoryList[currentIndex].blogList}
                    footer={null}
                    renderItem={(item, index) => (
                        <List.Item
                            key={index}
                            actions={[]}
                            extra={
                                <img
                                    width={120}
                                    alt="logo"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                />
                            }
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item.avatar} />}
                                title={<div className={blogTitleStyle} onClick={() => {
                                    handleClickBlogDetail(item)
                                }}>{item.blogTitle}</div>}
                                description={item.blogContent}
                            />
                            <div style={{ paddingLeft: 50, color: "#00000073" }}><MessageOutlined /> 156</div>

                        </List.Item>
                    )}
                />
            </div>
        </div>
    </div>
}