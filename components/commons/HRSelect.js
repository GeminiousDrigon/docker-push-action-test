import React, { forwardRef } from 'react';
import { Input, Select } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

function HRSelect(props) {
  const func = useFormContext();
  const { custom } = props;
  const { Option } = Select;

  const CustomSelect = custom;

  let options = _.map(props?.options, (row, i) => {
    return (
      <Option key={`${i}_${row?.value}`} value={row?.value}>
        {row?.label}
      </Option>
    );
  });

  if (props?.useNative) {
    return (
      <>
        {props?.label ? (
          <div>
            <label>
              {props?.label}
              <span style={{ color: 'red' }}>{func?.errors[props?.name] && ' (required)'}</span>
            </label>
          </div>
        ) : null}
        <Select
          style={{ marginBottom: 5, width: '100%' }}
          placeholder={props?.placeholder ?? props?.label}
          {...props}
        >
          {options}
        </Select>
      </>
    );
  }

  return func ? (
    <>
      {props?.label ? (
        <div>
          <label>
            {props?.label}{' '}
            <span style={{ color: 'red' }}>{func?.errors[props?.name] && ' (required)'}</span>
          </label>
        </div>
      ) : null}

      <Controller
        control={func?.control}
        render={({ onChange, onBlur, value, name }) => (
          <Select
            name={name}
            style={{ marginBottom: 5, width: '100%' }}
            onChange={(value) => onChange(value ?? null)}
            onBlur={onBlur}
            value={value}
            placeholder={props?.placeholder ?? props?.label}
            {...props}
          >
            {options}
          </Select>
        )}
        {...props}
      />
    </>
  ) : (
    <>
      {props?.label ? (
        <div>
          <label>{props?.label}</label>
        </div>
      ) : null}
      <Select style={{ marginBottom: 5, width: '100%' }} {...props}>
        {options}
      </Select>
    </>
  );
}

export default HRSelect;
