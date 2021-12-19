import React, { useState } from 'react';
import { Modal, Button } from 'antd';

export default (props) => {
    const { modalTitle, children, handleOk, handleCancel, isModalVisible } = props
    return (
        <>
            <Modal Modal title={modalTitle} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} >
                {children && children}
            </Modal>
        </>
    );
};