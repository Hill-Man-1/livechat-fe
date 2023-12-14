export const baseUrl = 'http://localhost:5000';

export const postRequest = async (url, body) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        const isBodyString = typeof body === 'string';
        const requestBody = isBodyString ? body : JSON.stringify(body);

        const res = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: requestBody,
        });

        const data = await res.json();

        if (!res.ok) {
            let message = data?.message || 'An error occurred';
            return { error: true, message };
        }
        return data;
    } catch (error) {
        console.error('Error in postRequest:', error);
        return { error: true, message: error.message || 'Error fetching data' };
    }
};

export const getRequest = async (url) => {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            let message = data?.message || 'An error occurred';
            return { error: true, message };
        }

        return data;
    } catch (error) {
        console.error('Error in getRequest:', error);
        return { error: true, message: error.message || 'Error fetching data' };
    }
}
