export const baseUrl = 'http://localhost:5000';

export async function postRequest(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Include other headers as needed
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error('Error in postRequest:', error);
        throw error; // Re-throw the error to be caught in the calling function
    }
}

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
            console.error('Request failed:', response, 'Response data:', data); // More detailed error logging
            return { error: true, message };
        }

        return data;
    } catch (error) {
        console.error('Error in getRequest:', error);
        return { error: true, message: `Error fetching data: ${error.message || ''}` };
    }
}



