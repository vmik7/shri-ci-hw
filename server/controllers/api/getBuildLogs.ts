import { Request, Response } from 'express';
import { axiosInstance, testModeQuery } from '../../config';
import { getStubLogs } from '../../stubs';

export const getBuildLogs = async (req: Request, res: Response) => {
    if (req.query[testModeQuery]) {
        res.json({
            data: getStubLogs(),
        });
        return;
    }

    // TODO: Долго обрабатывается запрос, надо придумать кеширование. Пока что довольствуемся заглушкой
    axiosInstance
        .get('/build/log', {
            params: {
                buildId: req.params.buildId,
            },
        })
        .then((response) =>
            res.json({
                data: response.data,
            }),
        )
        .catch((error) => res.send(error));

    // res.json({
    //     data: getStubLogs(),
    // });
};
