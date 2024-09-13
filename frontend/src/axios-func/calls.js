import router from "../router";
import { axiosInstance } from "./axiosInstance";
import axios from "axios";

// get user info
export const getUserInfo = async () => await axiosInstance({
    method: 'get',
    url: `/user/${localStorage.getItem('user-id')}`
}).then(res => {
    console.log('User data retrieved')
    return res.data.user_data
}).catch(err => {
    console.log('Error retrieving user data: ' + err.response.data.message)
    console.log('Error detail: ' + err.response.data.error)
    return {}
})

// FOR CHAT COMPONENTS
export const loadChats = () => axiosInstance({
    method: 'get',
    url: `/chat/load/${localStorage.getItem('user-id')}`
}).then(res => {
    console.log(res.data.chats)
    console.log(res.data.message)
    return res.data.chats
}).catch(err => {
    console.log(err.response.data.message)
    console.log(err.response.data.error)
    return []
})

export const addChat = (newChat, name) => axiosInstance(({
    method: 'post',
    url: '/chat/add',
    data: {
        username: newChat,
        petitioner_id: localStorage.getItem('user-id'),
        petitioner: name
    }
})).then(async res => {
    console.log(res.data.message)
    return res.data.chat
}).catch(err => {
    console.log(err.response.data.message)
    throw err
})

export const loadMessages = (chatId) => axiosInstance({
    method: 'get',
    url: `/chat/load-messages/${chatId}`
}).then(res => {
    console.log(res.data.messages)
    return res.data.messages
}).catch(err => {
    console.log(err.response.data.message)
    console.log(err.response.data.error)
    return []
})

export const deleteChat = (chatId) => axiosInstance({
    method: 'delete',
    url: `/chat/delete/${chatId}`
}).then(res => {
    console.log(res.data.message)
}).catch(err => {
    console.log(err.response.data.error)
    console.log(err.response.data.message)
})

export const deleteMessage = (msgId) => axiosInstance({
    method: 'delete',
    url: `/chat/delete-message/${msgId}`
}).then((res) => {
    console.log(res.data.message)
}).catch(err => {
    console.log(err.response.data.message)
    console.log(err.response.data.error)
})

const baseUrl = import.meta.env.VITE_BACK_BASE_URL
// SESSION METHODS
export const renewToken = () => {
    return axios({
        method: 'post',
        url: `${baseUrl}/token/renew/${localStorage.getItem("session-id")}`,
    }).then(res => {
        localStorage.setItem('access-token', res.data.access_token)
        console.log(res.data.message)
        return res.data.access_token
    }).catch(err => {
        console.log(err.response.data.message)
        console.log(err.response.data.error)
        logout()
        return null
    })
}

export const logout = () => axios({
    method: 'post',
    url: `${baseUrl}/token/revoke/${localStorage.getItem('session-id')}`,
}).then(res => {
    if (res.status === 204) {
        console.log('Refresh token revoked')
        axios({
            method: 'delete',
            url: `${baseUrl}/logout/${localStorage.getItem('session-id')}`
        }).then(res => {
            console.log(res.data.message)
            localStorage.clear()
            router.replace('/')
        }).catch(err => {
            console.log(err.message)
            console.log(err.response.data.error)
        })
    } else {
        console.log(err.message)
        console.log(err.response.data.error)
    }
}).catch(err => {
    console.log('Refresh token was not revoked: ' + err.response.data.message)
})