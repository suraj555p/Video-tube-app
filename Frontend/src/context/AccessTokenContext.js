import { useContext, createContext } from "react";

export const AccessTokenContext = createContext({
    storeATLS: (token) => {},
    getATLS: () => {},
    deleteATLS: () => {}
})

export const AccessTokenProvider = AccessTokenContext.Provider

export const useAccessToken = () => {
    return useContext(AccessTokenContext)
}