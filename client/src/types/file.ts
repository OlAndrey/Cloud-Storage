export interface IFile {
    name: string
    type: 'file' | 'dir'
    created: Date
    modified: Date
    size?: number
    accessLink: string
}
