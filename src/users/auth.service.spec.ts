import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('AuthService', () => {
    let service: AuthService
    let fakeUsersService: Partial<UsersService>

    beforeEach(async () => {
        // Create a fake copy of the users service
        fakeUsersService = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => Promise.resolve({ id: 1, email, password} as User)
        }
    
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile()
    
        service = module.get(AuthService)
    })
    
    
    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined()
    })


    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signUp('www@www.com', 'www')

        expect(user.password).not.toEqual('www')
        const [salt, hash] = user.password.split('.')
        expect(salt).toBeDefined()
        expect(hash).toBeDefined()
    })

    it('throws an error if user signs up with email that is in use', async () => {
        fakeUsersService.find = () => 
            Promise.resolve([{ id: 1, email: 'w', password: 'w'} as User])
            
            await expect(service.signUp('www@www.com', 'www')).rejects.toThrow(BadRequestException)
       
    })


    it('throws if sign in is called with an unused email', async () => {
        await expect(service.signIn('aasaasd@asd.com', 'asdasddd')).rejects.toThrow(NotFoundException)
    })


    it('throws if an invalid password is provided', async () => {
        fakeUsersService.find = () => Promise.resolve([{ email: 'assas@asas.com', password: 'sdsasd'} as User])

        await expect(service.signIn('sdfdfs@asda.com', 'passweord')).rejects.toThrow(BadRequestException)
    })


    it('returns a user if correct password is provided', async () => {
        fakeUsersService.find = () => 
            Promise.resolve([
                {   email: 'asdf@asdf.com', 
                    password: 'cba4afcf5f022a63.ed884c21d68f161b14834987ca55b697f7eeaced7377572f8851640d00e47df2'} as User
            ])

        const user = await service.signIn('asdf@asdf.com', 'mypassword')
        expect(user).toBeDefined()
        // const user = await service.signUp('asdf@asdf.com', 'mypassword')
        // console.log(user);
        
    })
})

