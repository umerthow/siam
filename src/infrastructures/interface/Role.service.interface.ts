// import { ServiceParameter, ResponseInterface } from '../Interfaces'
import ResponseInterface from './response.interface'

export default interface RoleServiceInterface {
    save(params: any): Promise<ResponseInterface>
    delete(params: any): Promise<ResponseInterface>
    fetchAll(params: any): Promise<ResponseInterface>
    fetchBy(params: any): Promise<ResponseInterface>
    update(id: string | number, params: any): Promise<ResponseInterface>
    setPermission(params: any, type: string): Promise<ResponseInterface>
}