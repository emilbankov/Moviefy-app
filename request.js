import AsyncStorage from '@react-native-async-storage/async-storage';

const buildOptions = async (data) => {
    const options = {};

    if (data) {
        options.body = JSON.stringify(data);
        options.headers = {
            'content-type': 'application/json'
        };
    }

    try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
            options.headers = {
                ...options.headers,
                'X-Authorization': token
            };
        }
    } catch (error) {
        console.error('Error getting token:', error);
    }

    return options;
};

const request = async (method, url, data) => {
    const options = await buildOptions(data);
    
    const response = await fetch(url, {
        ...options,
        method,
    });

    if (response.status === 204) {
        return {};
    }

    const result = await response.json();

    if (!response.ok) {
        throw result;
    }

    return result;
};

export const get = request.bind(null, 'GET');
export const post = request.bind(null, 'POST');
export const put = request.bind(null, 'PUT');
export const del = request.bind(null, 'DELETE');