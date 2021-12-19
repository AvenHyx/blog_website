import React, { useState, useEffect, PureComponent, useRef } from "react";
import { Tag, Input, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './index.less'
import * as apis from "@/services/ant-design-pro/api"


export default () => {
    const [tags, setTag] = useState([]);
    const [inputVisible, setInputVisible] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [editInputIndex, setEditInputIndex] = useState(-1)
    const [editInputValue, setEditInputValue] = useState("")
    const saveEditInputRef = useRef()
    const saveInputRef = useRef()
    //关闭


    /**查询标签 */
    useEffect(async () => {
        queryTags()
    }, [])

    const queryTags = async () => {
        try {
            let res = await apis.getTags()
            if (res && res?.businessCode * 1 === 1000) {
                setTag(res.content)
            }
        } catch (error) {

        }
    }

    const handleClose = removedTag => {
        const tag = tags.filter(tag => tag !== removedTag);
        console.log(tag);
        setTag(tag)
    };

    const showInput = () => {
        setInputVisible(true)

        setTimeout(() => {
            saveInputRef.current.focus()
        }, 200);
    };

    const handleInputChange = e => {
        setInputValue(e.target.value)
    };

    const handleInputConfirm = async () => {
        let tag;
        console.log(tags, inputValue, "handleInputConfirm")
        // if (inputValue && tags.indexOf(inputValue) === -1) {
        //     tag = [...tags, inputValue].filter(_item => _item != "");

        //     setTag(tag)
        // }


        let res = await apis.addTag({
            tagName: inputValue
        })
        if (res && res?.businessCode * 1 === 1000) {
            // setTag(tag)
            queryTags()
        }
        setInputVisible(false)
        setInputValue("")

    };

    const handleEditInputChange = e => {
        setEditInputValue(e.target.value)
    };
    const handleEditInputConfirm = () => {
        let newTags = [...tags];
        newTags[editInputIndex] = editInputValue;
        setTag(newTags.filter(_item => _item != ""))
        setEditInputValue('')
        setEditInputIndex(-1)
    };

    return (

        <div className="admin-container">
            {tags && tags.length && tags.map((tag, index) => {
                if (editInputIndex === index) {
                    return (
                        <Input
                            ref={saveEditInputRef}
                            key={tag.tagId}
                            size="small"
                            className="tag-input"
                            value={editInputValue}
                            onChange={handleEditInputChange}
                            onBlur={handleEditInputConfirm}
                            onPressEnter={handleEditInputConfirm}
                        />
                    );
                }

                const isLongTag = tag.tagName.length > 20;

                const tagElem = (
                    <Tag
                        className="edit-tag"
                        key={tag.tagId}
                        closable={index !== 0}
                        onClose={() => handleClose(tag)}
                    >
                        <span
                            onDoubleClick={e => {
                                if (index !== 0) {
                                    setEditInputIndex(index)
                                    setEditInputValue(tag.tagName)
                                    setTimeout(() => {
                                        saveEditInputRef.current.focus()
                                    }, 200)

                                    e.preventDefault();
                                }
                            }}
                        >
                            {isLongTag ? `${tag.tagName.slice(0, 20)}...` : tag.tagName}
                        </span>
                    </Tag>
                );
                return isLongTag ? (
                    <Tooltip title={tag.tagName} key={tag.tagId}>
                        {tagElem}
                    </Tooltip>
                ) : (
                    tagElem
                );
            })}
            {inputVisible && (
                <Input
                    ref={saveInputRef}
                    type="text"
                    size="small"
                    className="tag-input"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                />
            )}
            {!inputVisible && (
                <Tag className="site-tag-plus" onClick={showInput}>
                    <PlusOutlined /> New Tag
                </Tag>
            )}
        </div>
    );
}


