import { HRButton } from 'components/commons';
import { List, Tooltip, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const HRListItem = ({ item, handleEdit, handleDelete, itemKey, noAction, index, ...props }) => {
  let actions = [];
  if (handleEdit)
    actions.push(
      <Tooltip title="Edit" key="edit-button">
        <HRButton type="primary" shape="circle" icon={<EditOutlined />} onClick={handleEdit} />
      </Tooltip>,
    );
  if (handleDelete)
    actions.push(
      <Tooltip title="Delete" key="delete-button">
        <HRButton
          type="primary"
          shape="circle"
          danger
          icon={<DeleteOutlined />}
          onClick={handleDelete}
        />
      </Tooltip>,
    );
  actions = [...actions, ...(props?.actions || [])];
  return (
    <List.Item key={itemKey ?? index} actions={noAction ? [] : actions} {...props}>
      {props?.children}
    </List.Item>
  );
};

export default HRListItem;
