/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);

    const recipientId = chat?.members.find((id) => id !== user._id);

    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) return;
            try {
                const response = await getRequest(`${baseUrl}/users/${recipientId}`);

                if (response.error) {
                    setError(response.error);
                } else {
                    setRecipientUser(response);
                }
            } catch (err) {
                setError(err.message || 'An error occurred');
            }
        };

        getUser();
    }, [recipientId, baseUrl]);

    return { recipientUser, error };
};
