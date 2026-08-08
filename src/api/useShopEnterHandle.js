import { useMutation } from '@tanstack/react-query';
import useAxiosSecure from '../hooks/useAxiosSecure';

export const useShopRegister = setShop => {
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationFn: async shopData => {
      const { data } = await axiosSecure.post('/api/shops/register', shopData);
      return data;
    },

    onSuccess: data => {
      if (setShop) {
        setShop(data.shop);
      }
    },

    onError: error => {
      console.error(
        'Registration Error:',
        error.response?.data || error.message,
      );
    },
  });
};

export const useShopEnterHandle = setShop => {
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationFn: async pinData => {
      const { data } = await axiosSecure.post('/api/shops/login', pinData);
      return data;
    },

    onSuccess: data => {
      // সফলভাবে লগইন হলে সরাসরি এখানে শপ সেট হয়ে যাবে
      if (setShop) {
        setShop(data);
      }
    },

    onError: error => {
      console.error('Login Error:', error.response?.data || error.message);
    },
  });
};
