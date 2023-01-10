// @ts-nocheck

import React, { FC } from 'react';
import InputCurrencyField, {
  CurrencyInputProps,
} from 'react-currency-input-field';
import InputBase, { InputBaseProps } from '@mui/material/InputBase';
import { transformToNumber } from '../utils/number';

export type IInputCurrencyProps = CurrencyInputProps &
  InputBaseProps & {
    empty?: string | number;
  };

type Ref = HTMLInputElement | any;

const InputCurrency: FC<IInputCurrencyProps> = React.forwardRef<
  Ref,
  IInputCurrencyProps
>(
  (
    { onChange, decimalSeparator = ',', groupSeparator = '.', empty, ...props },
    ref
  ) => (
    <InputCurrencyField
      customInput={InputBase}
      ref={ref}
      decimalSeparator={decimalSeparator}
      groupSeparator={groupSeparator}
      onValueChange={(value) => onChange(transformToNumber(value, empty))}
      {...props}
    />
  )
);

InputCurrency.defaultProps = {
  empty: '',
};

export default InputCurrency;
