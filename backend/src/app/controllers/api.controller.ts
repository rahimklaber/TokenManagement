import { Context, Get, HttpResponseInternalServerError, HttpResponseOK,  Post } from "@foal/core";
import { Server } from "xdb-digitalbits-sdk";
import { TokenService } from "../services/TokenService";

export class ApiController {
  server = new Server("https://frontier.testnet.digitalbits.io")
  tokenService: TokenService = new TokenService(this.server)



  /**
   * Create a new token.
   */
  @Post("/new")
  async createNewToken(ctx: Context){
    const body = ctx.request.body
    const issueTokenRes = await this.tokenService.issueToken("",body.tokenId,body.tokenName,"","",body.amount)
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
    const issueTokenRes = await this.tokenService.mintToken("",body.tokenId,body.amount)
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
    const res = await this.tokenService.payWithClaimableBalances("",body.tokenId,body.recipients)
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
    const res = await this.tokenService.payWithPayment("",body.tokenId,body.recipients)
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
  async info(){
    return new HttpResponseOK({
      tokenAccount : this.tokenService.tokenKeypair.publicKey(),
      distributionAccount : this.tokenService.distributionKeypair.publicKey()
    })
  }

  /**
   * get tokens issues by us. 
   */
  @Get("/")
  async tokensInfo(){
    return new HttpResponseOK(await this.tokenService.listTokens(""))
  }

}
