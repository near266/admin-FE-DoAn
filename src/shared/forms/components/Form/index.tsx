import PropTypes from 'prop-types';

import FormContext from '../../contexts/FormContext';

const Form = ({ initForm, children, ...rest }) => {
  return (
    <FormContext.Provider value={{ form: initForm }}>
      <form {...rest}>{children}</form>
    </FormContext.Provider>
  );
};

Form.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Form;
