import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../hooks/useAxiosSecure';

// Get Categories
export const useCategories = shopId => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ['categories', shopId],

    queryFn: async () => {
      const { data } = await axiosSecure.get(`/api/categories/${shopId}`);

      return data.categories || data;
    },

    enabled: !!shopId,
  });
};

// Create Category
export const useCreateCategory = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async categoryData => {
      const { data } = await axiosSecure.post('/api/categories', categoryData);

      return data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['categories', variables.shopId],
      });
    },

    onError: error => {
      console.error(
        'Create Category Error:',
        error.response?.data || error.message,
      );
    },
  });
};

// Update Category
export const useUpdateCategory = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name }) => {
      const { data } = await axiosSecure.patch(`/api/categories/${id}`, {
        name,
      });

      return data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['categories', variables.shopId],
      });
    },

    onError: error => {
      console.error(
        'Update Category Error:',
        error.response?.data || error.message,
      );
    },
  });
};

// Delete Category
export const useDeleteCategory = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }) => {
      const { data } = await axiosSecure.delete(`/api/categories/${id}`);

      return data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['categories', variables.shopId],
      });
    },

    onError: error => {
      console.error(
        'Delete Category Error:',
        error.response?.data || error.message,
      );
    },
  });
};
