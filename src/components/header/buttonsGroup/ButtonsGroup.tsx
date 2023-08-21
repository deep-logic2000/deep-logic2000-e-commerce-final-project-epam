import React, { ReactElement } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { resetAuthState, selectAuthState } from '@/store/slices/authSlice';
import { setStateBurgerMenu } from '@/store/slices/menuSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import cart from '@/assets/images/cart-icon.png';
import { ERoute } from '../../../data/routes';
import styles from './styles.module.css';
import CustomerController from '@/api/controllers/CustomerController';

function ButtonsGroup(): ReactElement {
  const { authState } = useAppSelector(selectAuthState);
  const dispatch = useAppDispatch();

  const router = useRouter();

  const handleOpenBurgerMenu = (): void => {
    dispatch(setStateBurgerMenu(true));
  };

  const handleRedirectToSignUp = (): void => {
    router.push(ERoute.signup).catch((error) => {
      console.log(error);
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center">
        <Image src={cart} alt="cart" className="mr-8" />
        <button
          type="button"
          className="hidden rounded border-2 border-solid px-3 py-1 text-white60 transition-colors duration-300 hover:text-white md:block"
          onClick={(): void => {
            if (authState) {
              new CustomerController().logoutCustomer();
              dispatch(resetAuthState());
            } else {
              router.push(ERoute.login).catch((error) => {
                console.log(error);
              });
            }
          }}
        >
          {authState ? 'Sign Out' : 'Sign In'}
        </button>
        {!authState && (
          <button
            type="button"
            onClick={handleRedirectToSignUp}
            className="ml-1 hidden rounded border-2 border-solid px-3 py-1 text-white60 transition-colors duration-300 hover:text-white md:block"
          >
            Sign Up
          </button>
        )}
        <div
          className={styles.burgerButton}
          role="button"
          onClick={handleOpenBurgerMenu}
          tabIndex={0}
          aria-hidden="true"
        >
          <span className={styles.burgerSpan} />
        </div>
      </div>
      <div
        style={authState ? { color: 'green' } : { color: 'red' }}
        className="flex justify-center"
      >
        {authState ? 'Logged In' : 'Not Logged In'}
      </div>
    </div>
  );
}

export default ButtonsGroup;
