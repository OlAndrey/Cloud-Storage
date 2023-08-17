export interface IFile {
    _id: string
    name: string
    type: 'file' | 'dir'
    user: string
    createdAt: string
    updatedAt: string
    size?: number
    accessLink: string
}

export interface IDir {
    id: string | null
    name: string
}

export interface IUploadFile {
    file: File
    dirId?: string
}

export interface ICreatedFolder {
    name: string
    parent: string
}