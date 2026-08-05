import { useMutation } from '@tanstack/react-query';
import useAxiosSecure from '../hooks/useAxiosSecure';

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
      console.log('Shop Login Successful:', data);
    },

    onError: error => {
      console.error('Login Error:', error.response?.data || error.message);
    },
  });
};
