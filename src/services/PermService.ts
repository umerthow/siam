import PermServiceInterface from '../infrastructures/interface/Perm.service.interface'
import ResponseInterface  from '../infrastructures/interface/response.interface'
import { UseCaseInterface } from '../domain/UseCase'
import Service, { ServiceConstructorInterface } from './Service'
import { DBResponseInterface } from '../infrastructures/Interfaces';

export default class PermService extends Service implements PermServiceInterface {

    constructor(
            private permProvider: UseCaseInterface,
            protected parameters: ServiceConstructorInterface
        ) {
        super(parameters)
    }


    public async fetchAll(): Promise<ResponseInterface> {
        let result: DBResponseInterface = await this.permProvider.fetchAll(-1)

        return this.response('200', result.data, '')
    }

}