/**
 * This function checks whether passed variable and can be converted to a finite number, if yes, returns converted value, otherwise returns null.
 * By default null value is converted to zero, but you can change this behavior by passing second argument set to true.
 *
 * @param variable - variable to be converted
 * @param doNotConvertNullToZero - set to true if you want don't want to convert null to zero, otherwise it returns zero for null
 * @returns finite converted number or null
 */
const tryConvertToFiniteNumber = (
  variable: any,
  doNotConvertNullToZero?: boolean
) => {
  if (variable !== null || !doNotConvertNullToZero) {
    let convertedValue = Number(variable);
    if (Number.isFinite(convertedValue)) return convertedValue;
  }
  return null;
};
export default tryConvertToFiniteNumber;
