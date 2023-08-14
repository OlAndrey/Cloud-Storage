export interface IFile {
    name: string
    type: 'file' | 'dir'
    user: string
    createdAt: string
    updatedAt: string
    size?: number
    accessLink: string
}

export interface ICreatedFolder {
    name: string
    parent: string
}