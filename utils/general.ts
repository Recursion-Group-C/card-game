const makeMoneyString = (amount: number): string => {
  let result: string;
  if (amount > 0) {
    result = `+$${amount.toLocaleString()}`;
  } else if (amount === 0) {
    result = '';
  } else {
    result = `-$${Math.abs(amount).toLocaleString()}`;
  }
  return result;
};

export { makeMoneyString }; // eslint-disable-line import/prefer-default-export
