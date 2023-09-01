export interface IFile {
    _id: string
    name: string
    type: 'file' | 'dir'
    user: string
    inBasket: boolean
    createdAt: string
    updatedAt: string
    size?: number
    accessLink: string
}

export interface IRecentFile extends IFile {
    author: {
        id: string
        name: string
        avatar: string
    }
    newlyOpened: string
}

export interface IOrderSettings {
    by: 'name' | 'date'
    direction: 'ASC' | 'DESC'
}

export interface IDir {
    id: string | null
    name: string
}

export interface IUploadFile {
    file: File
    dirId?: string
}

export interface IUploadFileProcess {
    id: string
    name: string
    progress: number
    closeUpload: () => void
}

export interface ICreatedFolder {
    name: string
    parent: string
}