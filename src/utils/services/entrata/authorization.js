import { ENTRATA_API } from 'src/config-global';

export const authorization = `Basic ${Buffer.from(`${ENTRATA_API.username}:${ENTRATA_API.password}`).toString('base64')}`;
