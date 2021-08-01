import { Context, Get, HttpResponseInternalServerError, HttpResponseOK,  Post } from "@foal/core";
import { Server } from "xdb-digitalbits-sdk";
import { TokenService } from "../services/TokenService";
import {JWTRequired} from "@foal/jwt";
@JWTRequired()
export class ApiController {
  server = new Server("https://frontier.testnet.digitalbits.io")
  tokenService: TokenService = new TokenService(this.server)



  /**
   * Create a new token.
   */
  @Post("/new")
  async createNewToken(ctx: Context){
    const body = ctx.request.body
    const issueTokenRes = await this.tokenService.issueToken(ctx.user.username,body.tokenId,body.tokenName,"","",body.amount)
    if(issueTokenRes.success){
      return new HttpResponseOK()
    }else{
      return new HttpResponseInternalServerError(issueTokenRes.error)
    }
  }

  /**
   * Create a new token.
   */
  @Post("/mint")
  async mintToken(ctx: Context){
    const body = ctx.request.body
    const issueTokenRes = await this.tokenService.mintToken(ctx.user.username,body.tokenId,body.amount)
    if(issueTokenRes.success){
      return new HttpResponseOK()
    }else{
      return new HttpResponseInternalServerError(issueTokenRes.error)
    }
  }


  /**
   * Create a claimable balance for the specified user.
   * 
   * Usefull if the user doesn't have a trustline to the asset.
   */
  @Post("/paywithclaimable")
  async payWithClaimable(ctx: Context){
    const body = ctx.request.body
    const res = await this.tokenService.payWithClaimableBalances(ctx.user.username,body.tokenId,body.recipients)
    if(res.success){
      return new HttpResponseOK()
    }else{
      return new HttpResponseInternalServerError(res.error)
    }
  }

  /**
   * pay a user that has a trustline to the asset
   */
  @Post("/pay")
  async pay(ctx: Context){
    const body = ctx.request.body
    const res = await this.tokenService.payWithPayment(ctx.user.username,body.tokenId,body.recipients)
    if(res.success){
      return new HttpResponseOK()
    }else{
      return new HttpResponseInternalServerError(res.error)
    }
  }
  
  /**
   * debug route
   */
  @Get("/info")
  async info(ctx: Context){
    const[tokenKeypair, distributionKeypair] = await this.tokenService.getKeyPairsForUserId(ctx.user.username)
    return new HttpResponseOK({
      tokenAccount : tokenKeypair.publicKey(),
      distributionAccount : distributionKeypair.publicKey()
    })
  }

  /**
   * get tokens issues by us. 
   */
  @Get("/")
  async tokensInfo(ctx : Context){
    return new HttpResponseOK(await this.tokenService.listTokens(ctx.user.username))
  }

}
