import { useInfiniteQuery, useMutation, useQuery } from 'react-query';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { IUpdateUser, IUser } from 'types/users';
import axiosServices from 'utils/axios';

type dataUserList = {
    page: number;
    size: number;
};

const useUserApi = ({
    keyword = '',
    page = 0,
    size = 50,
    enableUserList = false,
    id
}: {
    keyword?: string;
    page?: number;
    size?: number;
    enableUserList?: boolean;
    id?: number;
}) => {
    const mUserList = useMutation((data: dataUserList) => axiosServices.post(`/v1/user/getAll`, data));

    const mUpdateUser = useMutation((data: IUpdateUser) => axiosServices.put(`/v1/user/${id}`, data), {
        onSuccess(data: any, variables, context) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Update Success',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: true,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right'
                    }
                })
            );
        },
        onError(error: any) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: error,
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: true,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right'
                    }
                })
            );
        }
    });

    return { mUserList, dataUserList: mUserList?.data?.data?.content as IUser[], mUpdateUser };
};

export default useUserApi;
