export interface ILoginUserValue {
    email: string
    password: string
}

export interface IRegisterUserValue extends ILoginUserValue {
    name: string
}

export interface IUserInfo {
    id: string
    name: string
    email: string
    diskSpace: number
    usedSpace: number
    avatarUrl: string
}