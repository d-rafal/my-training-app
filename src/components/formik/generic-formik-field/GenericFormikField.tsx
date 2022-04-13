import { Field, FieldAttributes } from "formik";
import * as React from "react";

const GenericFormikField = <T,>(
  props: FieldAttributes<T>,
  ref: React.ForwardedRef<typeof Field>
) => {
  const { children, ...restProps } = props;

  return (
    <Field {...restProps} ref={ref}>
      {children}
    </Field>
  );
};

export default React.forwardRef(GenericFormikField) as <T>(
  props: FieldAttributes<T>,
  ref: React.ForwardedRef<typeof Field>
) => ReturnType<typeof GenericFormikField>;
