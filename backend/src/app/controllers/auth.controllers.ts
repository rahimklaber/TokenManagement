import {
    Context,
    Get, HttpResponseBadRequest,
    HttpResponseInternalServerError,
    HttpResponseOK,
    HttpResponseUnauthorized,
    Post,
    ValidateBody, verifyPassword
} from "@foal/core";
import {User} from "../entities";
import {getSecretOrPrivateKey} from "@foal/jwt";
import {sign} from "jsonwebtoken"
import {AccountService} from "../services/AccountService";
import {Server} from "xdb-digitalbits-sdk";
export class AuthController {
    server = new Server("https://frontier.testnet.digitalbits.io")
    accountService = new AccountService(this.server)

    @Post("/login")
    @ValidateBody({
        additionalProperties: false,
        properties: {
            username: { type: 'string' },
            password: { type: 'string' }
        },
        required: [ 'username', 'password' ],
        type: 'object',
    })
    async login(ctx : Context){
        const {username, password} = ctx.request.body
        // verify password
        const user = await User.findOne({ username })

        if (!user) {
            return new HttpResponseUnauthorized()
        }

        if (!await verifyPassword(ctx.request.body.password, user.password)) {
            return new HttpResponseUnauthorized()
        }

        const jwtToken = sign(
            { username },
            getSecretOrPrivateKey(),
            { expiresIn: '1h' }
        )

        return new HttpResponseOK({jwtToken})
    }

    @Post("/register")
    @ValidateBody({
        additionalProperties: false,
        properties: {
            username: { type: 'string' },
            password: { type: 'string' }
        },
        required: [ 'username', 'password' ],
        type: 'object',
    })
    async register(ctx : Context){
        const {username, password} = ctx.request.body
        // check if user exists
        const check = await User.findOne({ username })

        if (check) {
            return new HttpResponseBadRequest()
        }

        const user = User.create()
        user.username = username
        user.tokenAccountSecret = await this.accountService.createAndFundNewAccount()
        user.distributionAccountSecret = await this.accountService.createAndFundNewAccount()
        await user.setPassword(password)
        await user.save()

        return new HttpResponseOK()


    }

}
