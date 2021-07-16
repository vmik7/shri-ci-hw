import { Request, Response } from 'express';
import { axiosInstance } from '../../config';
import { cloneRepo } from '../../util/cloneRepo';
import { setUpdateInterval } from '../../util/updateInterval';

export const saveSettings = async (req: Request, res: Response) => {
    const repoUrl = `https://github.com/${req.body.repoName}.git`;

    const cloneResult = await cloneRepo(repoUrl);
    if (cloneResult.successful) {
        setUpdateInterval({ repoUrl, period: req.body.period });

        try {
            await axiosInstance.post('/conf', req.body, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            res.status(200).send({
                isSaved: true,
            });
        } catch (error) {
            res.send(error);
        }
    } else {
        res.status(200).send({
            isSaved: false,
            errorMessage: cloneResult.error,
        });
    }
};
