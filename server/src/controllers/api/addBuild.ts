import { Request, Response } from 'express';
import { axiosInstance } from '../../config';
import { getCommitDetails } from '../../util/getCommitDetails';

export const addBuild = async (req: Request, res: Response) => {
    const { commitHash } = req.params;

    const { successful, params } = await getCommitDetails(commitHash);

    if (successful) {
        try {
            const response = await axiosInstance.post(
                '/build/request',
                params,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
            res.json({ isAdded: true, ...response.data });
        } catch (error) {
            res.json({ isAdded: false, errorMessage: error });
        }
    } else {
        res.json({ isAdded: false, errorMessage: 'Коммит не найден!' });
    }
};
