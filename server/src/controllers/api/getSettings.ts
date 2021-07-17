import { Request, Response } from 'express';
import { axiosInstance, testModeQuery } from '../../config';
import { getStubSettings } from '../../stubs';

export const getSettings = async (req: Request, res: Response) => {
    if (req.query[testModeQuery]) {
        res.json({
            data: getStubSettings(),
        });
        return;
    }

    axiosInstance
        .get('/conf')
        .then((response) => res.json(response.data))
        .catch((error) => res.send(error));
};
