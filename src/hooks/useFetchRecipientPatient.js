/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientPatient = (chat, data) => {
    const [recipientPatient, setRecipientPatient] = useState(null);
    const [error, setError] = useState(null);

    const recipientPatientId = chat?.members.find((id) => id !== data?._id);

    useEffect(() => {
        const getUser = async () => {
            if (!recipientPatientId) return;
            try {
                const response = await getRequest(`${baseUrl}/api/v1/medic/profile/${recipientPatientId}`);

                if (response.error) {
                    setError(response.error);
                } else {
                    setRecipientPatient(response);
                }
            } catch (err) {
                setError(err.message || 'An error occurred');
            }
        };
        // console.log('recipient', recipientUser)
        getUser();
    }, [recipientPatientId, baseUrl]);

    return { recipientPatient, error };
};
