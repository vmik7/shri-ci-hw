import { Request, Response } from 'express';
import { axiosInstance, testModeQuery } from '../../config';
import { getStubBuilds } from '../../stubs';

export const getBuilds = async (req: Request, res: Response) => {
    if (req.query[testModeQuery]) {
        res.json({
            data: getStubBuilds(),
        });
        return;
    }

    axiosInstance
        .get('/build/list', {
            params: {
                offset: req.query.offset || 0,
                limit: req.query.limit || 25,
            },
        })
        .then((response) => res.json(response.data))
        .catch((error) => res.send(error));
};
