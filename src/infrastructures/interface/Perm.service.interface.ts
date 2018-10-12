import ResponseInterface from './response.interface'

export default interface PermServiceInterface {
    fetchAll(params: any): Promise<ResponseInterface>
}