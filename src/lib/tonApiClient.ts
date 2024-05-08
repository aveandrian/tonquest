import { HttpClient, Api } from 'tonapi-sdk-js';
import { env } from '@/env';
// Configure the HTTP client with your host and token
const httpClient = new HttpClient({
    baseUrl: 'https://testnet.tonapi.io',
    baseApiParams: {
        headers: {
            Authorization: `Bearer ${env.TON_API_KEY}`,
            'Content-type': 'application/json'
        }
    }
});

// Initialize the API client
export const client = new Api(httpClient);

