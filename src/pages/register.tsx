import { Button } from '@chakra-ui/button';
import { Form, Formik } from 'formik';

import { InputField, Wrapper } from '../components';

export interface RegisterProps {
};

export const Register: React.FC<RegisterProps> = ({}) => {
  return (
    <Wrapper size="small">
      <Formik
        initialValues={{ password: '', username: '' }}
        onSubmit={(values) => { console.log(values); }}
      >{({ isSubmitting }) => (
        <Form className="spaced-rows">
          <InputField label="Username" name="username" placeholder="username" />
          <InputField label="Password" name="password" placeholder="password" type="password" />
          <Button isLoading={isSubmitting} type="submit">Register</Button>
        </Form>
      )}</Formik>
    </Wrapper>
  );
};

export default Register;
