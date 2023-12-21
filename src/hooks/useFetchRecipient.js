/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat, data) => {
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);

    const recipientId = chat?.members.find((id) => id !== data?._id);

    useEffect(() => {
        const getUser = async () => {
            if (!recipientId) return;
            try {
                const response = await getRequest(`${baseUrl}/api/v1/medic/profile/${recipientId}`);

                if (response.error) {
                    setError(response.error);
                } else {
                    setRecipientUser(response);
                }
            } catch (err) {
                setError(err.message || 'An error occurred');
            }
        };
        // console.log('recipient', recipientUser)
        getUser();
    }, [recipientId, baseUrl]);

    return { recipientUser, error };
};
