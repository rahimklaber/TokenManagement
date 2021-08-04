import {
    Context,
    Get, Hook, HttpResponseBadRequest,
    HttpResponseInternalServerError,
    HttpResponseNoContent,
    HttpResponseOK,
    HttpResponseUnauthorized,
    Options,
    Post,
    ValidateBody, verifyPassword
} from "@foal/core";
import {User} from "../entities";
import {getSecretOrPrivateKey} from "@foal/jwt";
import {sign} from "jsonwebtoken"
import {AccountService} from "../services/AccountService";
import {Server} from "xdb-digitalbits-sdk";

@Hook(() => response => {
    // Every response of this controller and its sub-controllers will be added this header.
    response.setHeader('Access-Control-Allow-Origin', '*');
  })
export class AuthController {
    server = new Server("https://frontier.testnet.digitalbits.io")
    accountService = new AccountService(this.server)

    @Post("/login")
    // @ValidateBody({
    //     additionalProperties: false,
    //     properties: {
    //         username: { type: 'string' },
    //         password: { type: 'string' }
    //     },
    //     required: [ 'username', 'password' ],
    //     type: 'object',
    // })
    async login(ctx : Context){
        console.log(ctx.request.body)
        const {username, password} = ctx.request.body
        // verify password
        const user = await User.findOne({ username })

        if (!user) {
            return new HttpResponseUnauthorized()
        }

        if (!await verifyPassword(password, user.password)) {
            return new HttpResponseUnauthorized()
        }

        const jwtToken = sign(
            { username },
            getSecretOrPrivateKey(),
            { expiresIn: '10000h' }
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

    
    @Options('*')
    options(ctx: Context) {
      console.log("hi")
      const response = new HttpResponseNoContent();
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  
      return response;
    }

}
