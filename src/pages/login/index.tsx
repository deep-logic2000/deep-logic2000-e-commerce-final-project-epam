/* eslint-disable jsx-a11y/label-has-associated-control */
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { useState, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { HttpErrorType } from '@commercetools/sdk-client-v2';
import {
  AuthState,
  setAuthState,
  setExpirationTime,
  setRefreshToken,
  setToken,
} from '@/store/slices/authSlice';
import { LoginProps } from '@/pages/api/user/login';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import Loader from '@/components/ui/loader/Loader';
import { emailSchema, passwordSchema } from '@/validation/schemas';
import CustomInput from '@/components/CustomInput';
import CustomerController from '../../api/controllers/CustomerController';
import { HttpStatus } from '../api/lib/types';
import { IApiLoginResult } from '../../api/types';
import { ERoute } from '../../data/routes';

const initialValues: LoginProps = {
  email: '',
  password: '',
};

const LoginPage: NextPage<AuthState> = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (values: LoginProps): void => {
    setIsLoading(true);

    const customerController = new CustomerController();

    customerController
      .loginCustomer(values)
      .then((response: IApiLoginResult) => {
        console.log(response);

        if (
          response.apiResult.statusCode === HttpStatus.OK &&
          response.token?.token.length
        ) {
          if (response.token) {
            const { token, refreshToken, expirationTime } = response.token;

            dispatch(setAuthState(true));
            dispatch(setToken(token));
            dispatch(setRefreshToken(refreshToken ?? ''));
            dispatch(setExpirationTime(expirationTime));

            toast.success('Authenticated successfully');

            router.push(ERoute.home).catch(() => {
              toast.error('Error while redirecting to home page');
            });

            setIsLoading(false);

            return;
          }
        }

        setIsLoading(false);

        const errorMessage: string = (response.apiResult as HttpErrorType).body
          ?.message as string;

        toast.error(errorMessage);
      })
      .catch(() => {
        toast.error('General login error');

        setIsLoading(false);
      });
  };

  const validationSchema = Yup.object({
    email: emailSchema,
    password: passwordSchema,
  });

  const handleRegistration = (): void => {
    router.push(ERoute.signup).catch(() => {
      toast.error('Error while redirecting to registration page');
    });
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-96 rounded bg-background-main p-6 shadow-modal">
        <h1 className="mb-4 text-2xl font-semibold text-white">Login</h1>
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {(): ReactNode => (
            <Form>
              <div className="mb-4">
                <CustomInput name="email" type="text" placeholder="Email" />
              </div>
              <div className="relative mb-4">
                <CustomInput
                  name="password"
                  type="password"
                  placeholder="Password"
                  isWhiteSpacesAllowed={false}
                />
              </div>
              <button
                type="submit"
                className={`flex w-full items-center justify-center rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600 ${
                  isLoading ? 'cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
              >
                {isLoading ? <Loader /> : ''}
                <span className="mx-[4px]">
                  {isLoading ? 'Logging In...' : 'Log In'}
                </span>
              </button>
              <button
                type="button"
                onClick={handleRegistration}
                className="mt-2 w-full rounded-md bg-gray-600 py-2 text-white hover:bg-gray-700"
              >
                Sign Up
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
