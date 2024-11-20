import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

function UseReactQuery(URLPath, method) {
    const token = useSelector(state => state.accessTokenSlice.token)
    const[response, setResponse] = useState([])
    const[error, setError] = useState(false)
    const[loading, setLoading] = useState(false)

    useEffect(() => {
        (
            async () => {
                try {
                    setError(false)
                    setLoading(true)
                    const response = await fetch(URLPath, {
                        method,
                        headers: {
                        'Authorization': `Bearer ${token}`
                        },
                    });
    
                    if (!response.ok) {
                        throw new Error("Server response is not ok");
                    }
        
                    const responseData = await response.json();
                    setResponse(responseData.data);
                } catch (error) {
                    setError(true)
                    console.log(error);
                    throw new Error("Something went wrong while fetching videos from server");
                } finally {
                    setLoading(false)
                }
            }
        )()
    }, [])
    return {response, error, loading}
}

export default UseReactQuery
