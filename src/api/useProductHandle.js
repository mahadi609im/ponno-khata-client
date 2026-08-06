import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../hooks/useAxiosSecure';

// Get Products by Category
export const useProductsByCategory = categoryId => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ['products', categoryId],

    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/api/products/category/${categoryId}`,
      );

      return data.products || data;
    },

    enabled: !!categoryId,
  });
};

// Get Products by Shop
export const useProductsByShop = shopId => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ['products-shop', shopId],

    queryFn: async () => {
      const { data } = await axiosSecure.get(`/api/products/shop/${shopId}`);

      return data.products || data;
    },

    enabled: !!shopId,
  });
};

// Create Product
export const useCreateProduct = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async productData => {
      const { data } = await axiosSecure.post('/api/products', productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return data;
    },

    onSuccess: (data, variables) => {
      // FormData হলে সরাসরি variables থেকে মান পেতে সমস্যা হতে পারে
      const categoryId =
        variables instanceof FormData
          ? variables.get('categoryId')
          : variables.categoryId;

      const shopId =
        variables instanceof FormData
          ? variables.get('shopId')
          : variables.shopId;

      // Single Category Products
      if (categoryId) {
        queryClient.invalidateQueries({
          queryKey: ['products', categoryId],
        });

        queryClient.refetchQueries({
          queryKey: ['products', categoryId],
        });
      }

      // Shop Products
      if (shopId) {
        queryClient.invalidateQueries({
          queryKey: ['products-shop', shopId],
        });

        queryClient.refetchQueries({
          queryKey: ['products-shop', shopId],
        });

        // Grouped Products (All Categories)
        queryClient.invalidateQueries({
          queryKey: ['grouped-products', shopId],
        });

        queryClient.refetchQueries({
          queryKey: ['grouped-products', shopId],
        });
      }

      // Backup
      queryClient.invalidateQueries({
        queryKey: ['products'],
      });
    },

    onError: error => {
      console.error(
        'Create Product Error:',
        error.response?.data || error.message,
      );
    },
  });
};

export const useGroupedProducts = shopId => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ['grouped-products', shopId],

    queryFn: async () => {
      const { data } = await axiosSecure.get(`/api/products/grouped/${shopId}`);

      return data.groupedProducts;
    },

    enabled: !!shopId,
  });
};

// Delete Product
export const useDeleteProduct = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }) => {
      const { data } = await axiosSecure.delete(`/api/products/${id}`);

      return data;
    },

    onSuccess: (_, variables) => {
      const { categoryId, shopId } = variables;

      // Single Category Products
      if (categoryId) {
        queryClient.invalidateQueries({
          queryKey: ['products', categoryId],
        });

        queryClient.refetchQueries({
          queryKey: ['products', categoryId],
        });
      }

      // Shop Products
      if (shopId) {
        queryClient.invalidateQueries({
          queryKey: ['products-shop', shopId],
        });

        queryClient.refetchQueries({
          queryKey: ['products-shop', shopId],
        });

        // Grouped Products (All Categories)
        queryClient.invalidateQueries({
          queryKey: ['grouped-products', shopId],
        });

        queryClient.refetchQueries({
          queryKey: ['grouped-products', shopId],
        });
      }

      // Backup
      queryClient.invalidateQueries({
        queryKey: ['products'],
      });
    },

    onError: error => {
      console.error(
        'Delete Product Error:',
        error.response?.data || error.message,
      );
    },
  });
};
