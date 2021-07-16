import { Request, Response } from 'express';
import { axiosInstance, testModeQuery } from '../../config';
import { getStubBuildById } from '../../stubs';

export const getBuildInfo = async (req: Request, res: Response) => {
    if (req.query[testModeQuery]) {
        res.json({
            data: getStubBuildById(req.params.buildId),
        });
        return;
    }

    axiosInstance
        .get('/build/details', {
            params: {
                buildId: req.params.buildId,
            },
        })
        .then((response) => res.json(response.data))
        .catch((error) => res.send(error));
};
