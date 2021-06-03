import { Dropdown, Menu, message } from 'antd';
import { MdAvTimer } from 'react-icons/md';
import { BiCalendarEvent } from 'react-icons/bi';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaBed } from 'react-icons/fa';
import React, { useContext } from 'react';
import moment from 'moment';
import { hasPermission } from '@utils/accessFunctions';
import { AccountContext } from '@components/accessControl/AccountContext';

const ScheduleCell = ({
  employeeSchedule = {},
  employeeRecord = {},
  date,
  cellKey,
  onClickSchedule,
  handleSelectCell,
  ...props
}) => {
  const accountContext = useContext(AccountContext);
  // console.log(employeeSchedule[cellKey + '_REST']);

  const onClickOIC = (record, date, isCustom, isOIC) => {
    let dateFormat = moment(date).format('MM_DD_YYYY');
    let regularSchedule = employeeSchedule[dateFormat];
    if (!regularSchedule) message.error('Must have regular schedule before adding OIC Schedule.');
    else handleSelectCell(record, date, false, isOIC);
  };

  const renderIcons = () => {
    let mockIcons = [];

    if (employeeSchedule[`${cellKey}_OIC`]) mockIcons = mockIcons.concat('person');
    if (employeeSchedule[`${cellKey}_OVERTIME_OIC`]) {
      mockIcons = mockIcons.concat('person');
      mockIcons = mockIcons.concat('overtime');
    }
    if (employeeSchedule[`${cellKey}_OVERTIME`]) mockIcons = mockIcons.concat('overtime');
    if (employeeSchedule[`${cellKey}_REST`]) mockIcons = mockIcons.concat('rest');

    var uniqueIcons = mockIcons
      .filter((value, i, arr) => arr.indexOf(value) === i)
      .map((icon) => {
        if (icon === 'person')
          return <BsFillPersonFill style={{ fontSize: 18, marginRight: 0 }} key="oic" />;
        else if (icon === 'overtime')
          return <MdAvTimer style={{ fontSize: 18, marginleft: 1 }} key="overtime" />;
        else if (icon === 'rest')
          return <FaBed style={{ fontSize: 18, marginLeft: 1 }} key="rest" />;
      });

    return uniqueIcons;
  };

  const { schedule = [], ...record } = employeeRecord;

  const isAllowed = hasPermission(['manage_work_schedule'], accountContext?.data?.user?.access);

  if (employeeSchedule[cellKey])
    return (
      <Dropdown
        placement="bottomCenter"
        trigger={isAllowed ? ['contextMenu'] : []}
        overlay={
          <Menu>
            {schedule.map((item, i) => {
              return (
                <React.Fragment key={item?.id}>
                  <Menu.Item
                    key={item?.id}
                    style={{ textAlign: 'center' }}
                    onClick={() => onClickSchedule(date, item, record, cellKey)}
                  >
                    {`${item?.label}(${item.dateTimeStart}-${item.dateTimeEnd})`}
                  </Menu.Item>
                  {i === schedule.length - 1 && <Menu.Divider />}
                </React.Fragment>
              );
            })}
            <Menu.Item
              key={'CUSTOM'}
              style={{ textAlign: 'center' }}
              onClick={() => handleSelectCell(record, date, true)}
            >
              Custom
            </Menu.Item>
            <Menu.Item
              key={'OIC'}
              style={{ textAlign: 'center' }}
              onClick={() => onClickOIC(record, date, false, true)}
            >
              OIC
            </Menu.Item>
            <Menu.Item
              key={'REST_DAY'}
              style={{ textAlign: 'center' }}
              onClick={() => onClickSchedule(date, 'REST_DAY', record, cellKey)}
            >
              Rest Day
            </Menu.Item>
          </Menu>
        }
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            cursor: 'pointer',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          onClick={isAllowed ? () => handleSelectCell(record, date) : () => {}}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 2 }}>
              {!employeeSchedule[cellKey]?.isCustom && employeeSchedule[cellKey]?.label}
            </span>
            {renderIcons()}
          </div>
          {employeeSchedule[cellKey] && (
            <>
              <div>
                {employeeSchedule[cellKey]?.timeStart}-{employeeSchedule[cellKey]?.timeEnd}
              </div>
            </>
          )}
        </div>
      </Dropdown>
    );
  else if (employeeSchedule[cellKey + '_REST']) {
    // console.log(cellKey, employeeSchedule);
    return (
      <Dropdown
        placement="bottomCenter"
        trigger={isAllowed ? ['contextMenu'] : []}
        overlay={
          <Menu>
            {schedule.map((item, i) => {
              return (
                <React.Fragment key={item?.id}>
                  <Menu.Item
                    key={item?.id}
                    style={{ textAlign: 'center' }}
                    onClick={() => onClickSchedule(date, item, record, cellKey)}
                  >
                    {`${item?.label}(${item.dateTimeStart}-${item.dateTimeEnd})`}
                  </Menu.Item>
                  {i === schedule.length - 1 && <Menu.Divider />}
                </React.Fragment>
              );
            })}
            <Menu.Item
              key={'CUSTOM'}
              style={{ textAlign: 'center' }}
              onClick={() => handleSelectCell(record, date, true)}
            >
              Custom
            </Menu.Item>
            <Menu.Item
              key={'OIC'}
              style={{ textAlign: 'center' }}
              onClick={() => onClickOIC(record, date, false, true)}
            >
              OIC
            </Menu.Item>
            <Menu.Item
              key={'REST_DAY'}
              style={{ textAlign: 'center' }}
              onClick={() => onClickSchedule(date, 'REST_DAY', record, cellKey)}
            >
              Rest Day
            </Menu.Item>
          </Menu>
        }
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            cursor: 'pointer',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          onClick={isAllowed ? () => handleSelectCell(record, date) : () => {}}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {employeeSchedule[cellKey + '_REST']?.label ?? 'N/A'}
            {employeeSchedule[`${cellKey}_OVERTIME`]?.length > 0 && (
              <MdAvTimer style={{ fontSize: 18 }} />
            )}
          </div>
          {employeeSchedule[cellKey + '_REST'] && (
            <div>
              {employeeSchedule[cellKey + '_REST']?.timeStart}-
              {employeeSchedule[cellKey + '_REST']?.timeEnd}
            </div>
          )}
        </div>
      </Dropdown>
    );
  } else
    return (
      <Dropdown
        placement="bottomCenter"
        trigger={isAllowed ? ['contextMenu'] : []}
        overlay={
          <Menu>
            {schedule.map((item, i) => {
              return (
                <React.Fragment key={item?.id}>
                  <Menu.Item
                    key={item?.id}
                    style={{ textAlign: 'center' }}
                    onClick={() => onClickSchedule(date, item, record, cellKey)}
                  >
                    {`${item?.label}(${item.dateTimeStart}-${item.dateTimeEnd})`}
                  </Menu.Item>
                  {i === schedule.length - 1 && <Menu.Divider />}
                </React.Fragment>
              );
            })}
            <Menu.Item
              key={'CUSTOM'}
              style={{ textAlign: 'center' }}
              onClick={() => handleSelectCell(record, date, true)}
            >
              Custom
            </Menu.Item>
            <Menu.Item
              key={'OIC'}
              style={{ textAlign: 'center' }}
              onClick={() => onClickOIC(record, date, false, true)}
            >
              OIC
            </Menu.Item>
            <Menu.Item
              key={'REST_DAY'}
              style={{ textAlign: 'center' }}
              onClick={() => onClickSchedule(date, 'REST_DAY', record, cellKey)}
            >
              Rest Day
            </Menu.Item>
          </Menu>
        }
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            cursor: 'pointer',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          onClick={isAllowed ? () => handleSelectCell(record, date) : () => {}}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {!employeeSchedule[cellKey]?.isCustom ? employeeSchedule[cellKey]?.label : 'N/A'}
            {employeeSchedule[`${cellKey}_OVERTIME`]?.length > 0 && (
              <MdAvTimer style={{ fontSize: 18 }} />
            )}
          </div>
          {employeeSchedule[cellKey] && (
            <div>
              {employeeSchedule[cellKey]?.timeStart}-{employeeSchedule[cellKey]?.timeEnd}
            </div>
          )}
        </div>
      </Dropdown>
    );
};

export default ScheduleCell;
